import * as React from 'react';
import { IAccount } from '@stores';
import Select from '@src/components/Select';
import styles from './styles.less';
import classNames from 'classnames';

interface ITransactionSigningFormProps {
    signType: 'account' | 'seed'
    onSignTypeChange: (v: string) => void;
    seed: string;
    availableProofIndexes: number[];
    proofIndex: number;
    accounts: IAccount[];
    selectedAccount: number;
    signDisabled: boolean;
    onSign: () => Promise<boolean>;
    onProofNChange: (v: string) => void;
    onSeedChange: (v: string) => void;
    onAccountChange: (v: string) => void;
    disableAwaitingConfirmation: () => void;
    isAwaitingConfirmation: boolean
}

export default class TransactionSigningFormComponent extends React.Component<ITransactionSigningFormProps> {

    state = {
        justSigned: false
    };

    onSign = async () => {
        if (await this.props.onSign()) this.setState({justSigned: true});
    };

    onSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => this.props.onSeedChange(e.target.value);


    render(): React.ReactNode {
        const {
            signType, onSignTypeChange, seed, proofIndex, availableProofIndexes, onProofNChange, accounts, selectedAccount, onAccountChange, signDisabled, isAwaitingConfirmation
        } = this.props;
        const signOptions = [{value: 'seed', title: 'Seed phrase'}, {value: 'account', title: 'IDE Account'}];
        const {justSigned} = this.state;
        return isAwaitingConfirmation
            ? <div></div>
            : (
                <div className={styles.signingForm}>
                    <div className={styles.signing_field}>
                        <div className={styles.signing_title}>Sign with</div>
                        <Select
                            options={signOptions}
                            name="SignWith"
                            className={styles.signing_select}
                            required={true}
                            value={signType}
                            onChange={onSignTypeChange}
                        />
                    </div>
                    <div className={styles.signing_field}>
                        {{
                            account: <>
                                <div className={styles.signing_title}>Account</div>
                                <Select
                                    className={styles.signing_select}
                                    required={true}
                                    value={accounts.length !== 0 ? selectedAccount : undefined}
                                    onChange={onAccountChange}
                                    disabled={availableProofIndexes.length === 0}
                                    options={accounts.map((acc, i) => ({title: acc.label, value: i}))}
                                />
                            </>,
                            seed: <>
                                <div className={styles.signing_title}>Seed to sign</div>
                                <input
                                    className={
                                        classNames(styles.signing_input, seed === '' && styles.signing_input_error)
                                    }
                                    value={seed}
                                    onChange={this.onSeedChange}
                                    required
                                />
                            </>
                        }[signType]}
                    </div>
                    <div className={styles.signing_field}>
                        <div className={styles.signing_title}>Proof index</div>
                        <Select options={availableProofIndexes.map((n => ({title: n + 1, value: n})))}
                                onChange={onProofNChange}
                                required={true}
                                name="N"
                                disabled={availableProofIndexes.length === 0}
                                value={proofIndex}
                                className={styles.signing_selectSmall}
                                invalid={
                                    availableProofIndexes.length > 0 && !availableProofIndexes.includes(proofIndex)
                                }
                        />
                    </div>
                    <div className={styles.signing_buttonField}>

                        {
                            <button
                                className={styles[`signing_button${justSigned ? '-added' : ''}`]}
                                disabled={signDisabled}
                                onClick={justSigned ? () => this.setState({justSigned: false}) : this.onSign}
                                onBlur={() => this.setState({justSigned: false})}
                            >
                                <div className={justSigned ? styles.check : styles.plus}/>
                                {justSigned ? 'Sign added' : 'Add sign'}
                            </button>}
                    </div>
                </div>
            );
    }
}