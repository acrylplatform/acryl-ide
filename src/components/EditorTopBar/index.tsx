import React from 'react';
import { inject, observer } from 'mobx-react';
import notification from 'rc-notification';
import { mediator } from '@services';
import { EVENTS } from '@components/Editor';
import styles from './styles.less';
import { TAB_TYPE, TabsStore, UIStore } from '@stores';
import { NotificationService } from '@services/notificationService';

interface IInjectedProps {
    uiStore?: UIStore,
    tabsStore?: TabsStore
    notificationService?: NotificationService
}

@inject('uiStore', 'tabsStore', 'notificationService')
@observer
export default class TopBar extends React.Component<IInjectedProps> {
    openSearchBar = () => mediator.dispatch(EVENTS.OPEN_SEARCH_BAR);

    changeSize = () => {
        const editor = this.props.uiStore!.editorSettings;
        editor.fontSize = editor.fontSize >= 20 ? 8 : editor.fontSize + 2;
        this.props.notificationService!.notify(`Font size is ${editor.fontSize} px`, {key: 'editor-font-size'});
    };

    // changeTheme = () => {
    //     const editor = this.props.uiStore!.editorSettings;
    //     editor.isDarkTheme = !editor.isDarkTheme;
    //     mediator.dispatch(EVENTS.UPDATE_THEME, editor.isDarkTheme);
    // };

    render() {
        const activeTab =  this.props.tabsStore!.activeTab;
        const isEditorOpen = activeTab && activeTab.type === TAB_TYPE.EDITOR;

        return (<>{isEditorOpen && <div className={styles.root}>
            <div className={styles.searchBtn}
                 onClick={this.openSearchBar}
            />
            <div className={styles.fontBtn}
                 onClick={this.changeSize}
            />
            {/*<div className={styles.themeBtn} onClick={this.changeTheme}/>*/}
        </div>}</>);
    }
}


