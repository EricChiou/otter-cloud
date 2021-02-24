import React, { ChangeEvent, FunctionComponent, useRef, RefObject } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Folder } from '../SideMenu/CloudFolder';
import { selectUserProfile } from 'src/store/user.slice';
import { selectSharedFolderList, updateSharedFolderList } from 'src/store/system.slice';
import { intl, keys, IntlType } from 'src/i18n';
import { BaseInput, BaseButton, ButtonType, BaseTooltip, BaseSelect } from 'src/components/common';
import { Add, Cancel } from 'src/components/icons';
import { addSharedFolder, removeSharedFolder, updateSharedFolder } from 'src/api/shared';
import { ApiResult, sharedFolderPermsType } from 'src/constants';
import { Share } from 'src/interface/common';
import { addMessage, MessageType } from 'src/components/Message';
import { getUserFuzzyList } from 'src/api/user';

import styles from './style.module.scss';

interface Props {
  folder: Folder;
  close: () => void;
}

const ShareFolderDialog: FunctionComponent<Props> = ({ folder }) => {
  const dispatch = useDispatch();
  const sharedFolderList = useSelector(selectSharedFolderList);
  const userProfile = useSelector(selectUserProfile);
  const onLoading = useRef(false);
  const shareToRef: RefObject<HTMLDivElement> = useRef(null);
  let sharedAcc = '';
  let permission: string | sharedFolderPermsType = sharedFolderPermsType.read;
  const permissionOptions = [
    { label: intl(keys.canRead, IntlType.firstUpper), value: sharedFolderPermsType.read },
    { label: intl(keys.canWrite, IntlType.firstUpper), value: sharedFolderPermsType.write },
  ];

  const doAddSharedFolder = () => {
    if (onLoading.current || !sharedAcc || !permission) { return; }

    onLoading.current = true;
    addSharedFolder(sharedAcc, folder.data.prefix, permission, userProfile.token).then((resp) => {
      // console.log(resp);
      if (resp.status === ApiResult.Success && shareToRef.current) {
        shareToRef.current.getElementsByTagName('input')[0].value = '';
      }
      dispatch(updateSharedFolderList(userProfile.token));

    }).catch((error) => {
      if (error.status && error.status === ApiResult.DBError) {
        dispatch(addMessage(intl(keys.accNotExisting), MessageType.warning));

      } else if (error.status && error.status === ApiResult.Duplicate) {
        dispatch(addMessage(intl(keys.sharedDuplicate), MessageType.warning));
      }

    }).finally(() => {
      onLoading.current = false;
    });
  };

  const doRemoveSharedFolder = (sharedFolder: Share) => {
    if (onLoading.current) { return; }

    onLoading.current = true;
    removeSharedFolder(sharedFolder.id, userProfile.token).then((resp) => {
      if (resp.status === ApiResult.Success && shareToRef.current) {
        dispatch(updateSharedFolderList(userProfile.token));
      }
    }).catch((error) => {
      console.log(error);

    }).finally(() => {
      onLoading.current = false;
    });
  };

  const shareToOnChange = (e: ChangeEvent<HTMLInputElement> | null, value: string) => {
    sharedAcc = e ? e.target.value : value;
  };

  const updatePermission = (sharedFolder: Share, permission: string) => {
    if (onLoading.current) { return; }

    onLoading.current = true;
    updateSharedFolder(sharedFolder.id, permission, userProfile.token).then(() => {
      // do nothing
    }).catch((error) => {
      console.log(error);

    }).finally(() => {
      dispatch(updateSharedFolderList(userProfile.token));
      onLoading.current = false;
    });
  };

  const getAutoCompleteOptions = async (inputValue: string): Promise<string[]> => {
    if (!inputValue) { return []; }

    const resp = await getUserFuzzyList(inputValue, userProfile.token);
    const options = resp.data ? resp.data.filter((acc) => acc !== userProfile.acc) : [];

    return options;
  };

  const renderShareFolderList = () => {
    return sharedFolderList
      .filter((sharedFolder) =>
        (sharedFolder.ownerAcc === userProfile.acc && sharedFolder.prefix === folder.data.prefix))
      .map((sharedFolder) => {
        return (
          <BaseTooltip
            key={sharedFolder.id}
            content={`${sharedFolder.sharedName}, ${sharedFolder.sharedAcc}`}
          >
            <div className={styles.sharedBlock}>
              <span className={styles.sharedName}>
                {sharedFolder.sharedName}, {sharedFolder.sharedAcc}
              </span>
              <BaseSelect
                style={{ width: '75px', height: '28px', verticalAlign: 'middle' }}
                options={permissionOptions}
                defaultSelect={sharedFolder.permission}
                onChange={(e) => { updatePermission(sharedFolder, e.target.value); }}
              >
              </BaseSelect>
              <BaseButton
                style={{ padding: '0', verticalAlign: 'middle' }}
                type={ButtonType.danger}
                onClick={() => { doRemoveSharedFolder(sharedFolder); }}
              >
                <Cancel></Cancel>
              </BaseButton>
            </div>
          </BaseTooltip>
        );
      });
  };

  return (
    <div className={styles.shareFolder}>
      <div className={styles.header}>{intl(keys.shareFolder, IntlType.perUpper)}</div>
      <BaseTooltip content={folder.name}>
        <div className={styles.target}>{folder.name}</div>
      </BaseTooltip>
      <div ref={shareToRef} className={styles.shareTo}>
        {intl(keys.shareTo, IntlType.perUpper)}：<br />
        <BaseInput
          style={{ width: 'calc(100% - 75px - 36px)', height: '22px', verticalAlign: 'middle' }}
          placeholder={intl(keys.account, IntlType.perUpper)}
          autoComplete={getAutoCompleteOptions}
          onChange={shareToOnChange}
        ></BaseInput>
        <BaseSelect
          style={{ width: '75px', height: '28px', verticalAlign: 'middle' }}
          options={permissionOptions}
          defaultSelect={permissionOptions[0].value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => { permission = e.target.value; }}
        ></BaseSelect>
        <BaseButton
          style={{ padding: '0', verticalAlign: 'middle' }}
          onClick={doAddSharedFolder}>
          <Add></Add>
        </BaseButton>
      </div>
      <div className={styles.shared}>
        {intl(keys.shared, IntlType.perUpper)}：<br />
        <div className={styles.sharedList}>
          {renderShareFolderList()}
        </div>
      </div>
    </div >
  );
};

export default ShareFolderDialog;
