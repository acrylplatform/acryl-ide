import { observable, action, computed, reaction, runInAction, autorun } from 'mobx';

import { generateMnemonic } from 'bip39';
import { libs, nodeInteraction } from '@waves/waves-transactions';

const {privateKey, publicKey, address} = libs.crypto;

import RootStore from '@stores/RootStore';
import SubStore from '@stores/SubStore';
import { Overwrite } from '@stores/FilesStore';
import { INode } from '@stores';

const POLL_INTERVAL = 20000;

interface IAccountProps {
    seed: string
    label: string
    chainId: string
    acrylBalance?: number
    isScripted?: boolean
}

interface IAccount extends IAccountProps {
    address: string
    publicKey: string
    privateKey: string
}

interface IAccountGroup {
    accounts: IAccount[],
    activeAccountIndex: number
}

const accountObs = (account: IAccountProps): IAccount => {
    return observable({
        seed: account.seed,
        label: account.label,
        chainId: account.chainId,
        acrylBalance: account.acrylBalance,
        isScripted: account.isScripted,
        get address() {
            return address(this.seed, this.chainId);
        },
        get publicKey() {
            return publicKey(this.seed);
        },
        get privateKey() {
            return privateKey(this.seed);
        }
    });
};

class AccountsStore extends SubStore {
    @observable accountGroups: Record<string, IAccountGroup> = {
        'A': {
            accounts: [],
            activeAccountIndex: -1
        },
        'K': {
            accounts: [],
            activeAccountIndex: -1
        }
    };

    private pollTimeout?: NodeJS.Timeout;

    constructor(rootStore: RootStore, initState: any) {
        super(rootStore);

        if (initState != null) {
            this.accountGroups = this.deserialize(initState);
        }

        this.newChainIdReaction();

        autorun( () => {
            if (this.pollTimeout) clearTimeout(this.pollTimeout);
            const currentNode = this.rootStore.settingsStore.defaultNode;
            this.bulkUpdateAccountInfo(this.accounts, currentNode.url).catch(console.error);
            this.pollTimeout = this.scheduleNextUpdate(currentNode);
        });

    }

    public serialize = () => ({
        accountGroups: this.accountGroups
    });

    public deserialize = (initState: any) => {
        return Object.entries(initState.accountGroups as Record<string, IAccountGroup>)
            .reduce((accountGroup, [chainId, {activeAccountIndex, accounts}]) => ({
                ...accountGroup,
                [chainId]: {
                    activeAccountIndex,
                    accounts: accounts.map(account => accountObs(account))
                }
            }), {} as Record<string, IAccountGroup>);
    };

    private newChainIdReaction = () => {
        reaction(
            () => this.rootStore.settingsStore.defaultChainId,
            defaultChainId => {
                let chainIdGroup = this.accountGroups[defaultChainId];

                if (chainIdGroup == null) {
                    chainIdGroup = observable({
                        accounts: [],
                        activeAccountIndex: -1
                    });

                    this.accountGroups[defaultChainId] = chainIdGroup;
                }
            }
        );
    };

    @computed
    get activeChainIdAccountGroup() {
        const chainId = this.rootStore.settingsStore.defaultChainId;

        return this.accountGroups[chainId];
    }

    @computed
    get accounts() {
        return this.activeChainIdAccountGroup.accounts;
    }

    @computed
    get activeAccountIndex() {
        return this.activeChainIdAccountGroup.activeAccountIndex;
    }

    set activeAccountIndex(i) {
        this.activeChainIdAccountGroup.activeAccountIndex = i;
    }

    @computed
    get activeAccount() {
        return this.accounts.length < 1
            ? undefined
            : this.accounts[this.activeAccountIndex];
    }

    @action
    addAccount(account: Overwrite<IAccountProps, { chainId?: string, isScripted?: boolean, acrylBalance?: number }>) {

        this.accounts.push(accountObs({chainId: this.rootStore.settingsStore.defaultChainId, ...account}));

        if (this.accounts.length === 1) {
            this.activeAccountIndex = 0;
        }
    }

    @action
    deleteAccount(i: number) {
        this.accounts.splice(i, 1);
        if (this.activeAccountIndex >= i) this.activeAccountIndex -= 1;
        if (this.activeAccountIndex < 0) this.activeAccountIndex = 0;
    }

    @action
    setAccountLabel(i: number, label: string) {
        this.activeChainIdAccountGroup.accounts[i].label = label;
    }

    @action
    setAccountSeed(i: number, seed: string) {
        this.activeChainIdAccountGroup.accounts[i].seed = seed;
    }

    @action
    generateAccount() {
        let maxLabel = Math.max(0, ...this.accounts.map(account => {
            const match = account.label.match(/Account (\d+)/);
            if (match != null) return parseInt(match[1]);
            else return 0;
        }));

        const newAccount = accountObs({
            seed: generateMnemonic(),
            label: `Account ${maxLabel + 1}`,
            chainId: this.rootStore.settingsStore.defaultChainId
        });

        this.addAccount(newAccount);
    }

    @action
    async updateAccountInfo(account: IAccount, url: string) {
        // const url = this.rootStore.settingsStore.defaultNode.url;
        const balance = await nodeInteraction.balance(account.address, url);
        const scriptInfo = await nodeInteraction.scriptInfo(account.address, url);
        runInAction(() => {
            account.acrylBalance = balance;
            account.isScripted = scriptInfo.extraFee !== 0;
        });
    }

    async bulkUpdateAccountInfo(accounts: IAccount[], url: string) {
        for (let acc of accounts) {
            await this.updateAccountInfo(acc, url);
        }
    }

    scheduleNextUpdate(node: INode) {
        return setTimeout(async () => {
            await this.bulkUpdateAccountInfo(this.accounts, node.url);
            this.pollTimeout = this.scheduleNextUpdate(node);
        }, POLL_INTERVAL);
    }
}

export {
    AccountsStore,
    IAccount,
};

