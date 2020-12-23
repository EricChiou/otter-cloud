import React, { FunctionComponent } from 'react';

import { addDialog, removeDialog } from 'src/components/Dialog/dialog.slice';
import { Success, Info, Warning, Error } from 'src/components/icons';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseButton, ButtonType } from 'src/components/common/BaseButton';

import styles from './style.module.scss';

export enum MessageType {
    normal = 'normal',
    success = 'success',
    info = 'info',
    warning = 'warning',
    error = 'error',
}

export const addMessage = (dispatch: any, msg: string, type?: MessageType) => {

    const config = getConfig(type);
    const component = getComponent(dispatch, msg, config);

    dispatch(addDialog({
        component,
        closeUI: config.closeUI,
        closeByClick: config.closeByClick,
    }));
}

interface MsgConfig {
    Icon: FunctionComponent | null,
    iconClassName: string,
    closeUI: boolean,
    closeByClick: boolean
}

const getConfig = (type?: MessageType): MsgConfig => {
    let Icon = null, iconClassName = styles.icon, closeUI = false, closeByClick = false;

    switch (type) {
        case 'success':
            Icon = Success;
            iconClassName = iconClassName + ' ' + styles.success;
            closeUI = true;
            closeByClick = true;
            break;
        case 'info':
            Icon = Info;
            iconClassName = iconClassName + ' ' + styles.info;
            closeUI = true;
            closeByClick = true;
            break;
        case 'warning':
            Icon = Warning;
            iconClassName = iconClassName + ' ' + styles.warning;
            break;
        case 'error':
            Icon = Error;
            iconClassName = iconClassName + ' ' + styles.error;
            break;
        default:
            closeUI = true;
            closeByClick = true;
            break;
    }

    return { Icon, iconClassName, closeUI, closeByClick, };
};

const getComponent = (dispatch: any, msg: string, config: MsgConfig) => {
    const buttonStyle = {
        width: '80px',
        textAlign: 'center',
    };

    return (
        <div>
            <div className={styles.message}>
                <div className={config.iconClassName}>
                    {config.Icon ? <config.Icon></config.Icon> : null}
                </div>
                <div className={styles.text}>
                    {msg}
                </div>
                <BaseButton
                    type={ButtonType.default}
                    style={buttonStyle}
                    onClick={() => { dispatch(removeDialog()); }}
                >
                    {intl(keys.confirm, IntlType.perUpper)}
                </BaseButton>
            </div>
        </div>
    );
};