export const VERSION = 3;

let createAccountGroups = (oldState: any, chainId: string) => {
    const oldAccounts = oldState.accountsStore.accounts;

    const hasAccounts = oldAccounts.length > 0;

    const newAccounts = hasAccounts
        ? oldAccounts.map((account: any) => ({ chainId, ...account }))
        : [];

    const activeAccountIndex = hasAccounts
        ? oldState.accountsStore.defaultAccountIndex
        : -1;

    return {
       accounts: newAccounts,
       activeAccountIndex: activeAccountIndex
    };
};

export function migrate(oldState: any) {
    const newState = {
        ...oldState,
        accountsStore: {
            accountGroups: {
                'A': createAccountGroups(oldState, 'A'),
                'K': createAccountGroups(oldState, 'K'),
            }
        }
    };

    return newState;
}
