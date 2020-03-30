import React from 'react';
import styles from './styles.less';
import Scrollbar from '@src/components/Scrollbar';

const rideDocs = {
    title: 'ride documentation',
    link: 'https://docs.acrylplatform.com/en/ride/about-ride.html'
};
const dapDocs = {
    title: 'writing dApps',
    link: 'https://docs.acrylplatform.com/en/smart-contracts/writing-dapps.html'
};

interface ILinkProps {
    title: string,
    link: string
}

const Link = ({title, link}: ILinkProps) =>
    <a target="_blank" className={styles.link} href={link}>{title}</a>;

export default class WelcomePage extends React.Component {

    render(): React.ReactNode {

        return <Scrollbar className={styles.root}>
            <div className={styles.H0}>Acryl dApps</div>

            <div className={styles.block}>
                <div className={styles.H3}>Ride language</div>
                <div className={styles.text}>
                    Acryl blockchain uses functional programming language based on expressions called RIDE.
                    It is simple, yet efficient. Please check <Link {...rideDocs}/>
                </div>
            </div>

            <div className={styles.block}>
                <div className={styles.H3}>Writing dApps</div>
                <div className={styles.text}>
                    A dApp, or decentralised application, is an application, that executes in a distributed computer
                    system, for instance, in a blockchain. In particular, Acryl dApp is an application, written in RIDE
                    language and executed on the nodes of the Acryl blockchain. Check <Link {...dapDocs}/> section
                </div>
            </div>

            <div className={styles.block}>
                <div className={styles.H3}>Examples</div>
                <div className={styles.text}>
                    IDE contains a lot of runnable Scripts, dApps and tests to help you get used to Ride language.
                    Check them in Library menu
                </div>
            </div>
        </Scrollbar>;
    }

}
