import React from 'react';

import styles from './styles.less';
import { inject, observer } from 'mobx-react';
import { TAB_TYPE, TabsStore } from "@stores";

const links = {
    Demotour: '',
    Docs: 'https://docs.acrylplatform.com/en/smart-contracts/writing-dapps.html',
    ['Env doc']: 'http://acrylplatform.github.io/js-test-env',
    Community: '',
    git: 'https://github.com/acrylplatform/acryl-ide'
};

interface IInjectedProps{
    tabsStore?: TabsStore
}

@inject('tabsStore')
class Footer extends React.Component<IInjectedProps> {

    openHotKeysPage = () => this.props.tabsStore!.openTutorialTab(TAB_TYPE.HOTKEYS);

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.content}>
                    <div>
                        {Object.entries(links).filter(([name, link]) => name !== 'git' && link !== '')
                            .map(([name, link]) =>
                                <a className={styles.link} target="_blank" href={link} key={name}>{name}</a>)
                        }
                                <a className={styles.link} onClick={this.openHotKeysPage} >Hotkeys</a>
                    </div>
                    <div>
                        <a className={styles.link} target="_blank" href={links.git}>Acryl IDE on GitHub</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;
