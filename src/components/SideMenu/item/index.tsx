import React, {
  FunctionComponent,
  useState,
  MouseEvent,
  useEffect,
  useRef,
  RefObject,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ArrowRight, ArrowDown, ShareFolder } from 'src/components/icons';
import CreateItem from './CreateItem';
import { selectPrefix } from 'src/store/system.slice';
import { addDialog, removeDialog } from 'src/components/common';
import ShareFolderDialog from './ShareFolderDialog';

import styles from './style.module.scss';

interface Props {
  ItemIcon: FunctionComponent;
  item: Item;
  SubItemIcon: FunctionComponent;
  subItems: Item[];
  defaultExpand?: boolean;
  onSelect?: (ele: HTMLElement, itemData: Item) => void;
  showCreateFolder?: boolean;
  CreateItemIcon?: FunctionComponent;
  createItem?: (itemName: string) => void;
}

const ItemComponent: FunctionComponent<Props> = ({
  ItemIcon,
  item,
  SubItemIcon,
  subItems,
  defaultExpand,
  onSelect,
  showCreateFolder,
  CreateItemIcon,
  createItem,
}: Props) => {
  const dispatch = useDispatch();
  const prefix = useSelector(selectPrefix);
  const itemRef: RefObject<HTMLDivElement> = useRef(null);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (defaultExpand !== undefined) {
      setExpand(defaultExpand);
    }
  }, [defaultExpand]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024 && expand) {
        setExpand(false);
      }
    };
    window.addEventListener('resize', onResize);

    return () => { window.removeEventListener('resize', onResize); };
  });

  const removeActiveEle = () => {
    if (!itemRef.current) { return; }

    const avtiveEles = itemRef.current.getElementsByClassName(styles.active);
    Array.from(avtiveEles).forEach((ele) => {
      ele.classList.remove(styles.active);
    });
  };

  const itemOnSelect = (e: MouseEvent<HTMLDivElement>, itemData: Item) => {
    removeActiveEle();
    e.currentTarget.classList.add(styles.active);

    if (onSelect) {
      onSelect(e.currentTarget, itemData);
    }
  };

  const expandOnSelect = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setExpand(!expand);
  };

  const getItemClassName = (targetItem: Item): string => {
    return ` ${prefix === targetItem.data.prefix ? styles.active : null}`;
  };

  const getSubItemsClassName = (): string => {
    return window.innerWidth > 1024 ? '' : expand ? ` ${styles.boxShadow}` : '';
  };

  const shareFolder = (subItem: Item) => {
    dispatch(addDialog({
      component: (
        <ShareFolderDialog
          item={subItem}
          close={() => { dispatch(removeDialog()); }}
        ></ShareFolderDialog>
      ),
      closeUI: true,
    }));
  };

  const renderSubItems = () => {
    return subItems.map((subItem, i) => {
      return (
        <div
          key={i}
          className={styles.subItem + getItemClassName(subItem)}
          onClick={(e) => { itemOnSelect(e, subItem); }}
        >
          <span className={styles.icon}>
            <SubItemIcon></SubItemIcon>
          </span>
          <span className={styles.text}>
            {subItem.name}
          </span>
          <span
            className={styles.share}
            onClick={(e) => {
              e.stopPropagation();
              shareFolder(subItem);
            }}
          >
            <ShareFolder></ShareFolder>
          </span>
        </div>
      );
    });
  };

  return (
    <div ref={itemRef} className={styles.itemContainer}>
      <div
        className={styles.item + getItemClassName(item)}
        onClick={(e) => { itemOnSelect(e, item); }}
      >
        <div className='vert-align-mid'></div>
        <span className={styles.expand} onClick={expandOnSelect}>
          {expand ? <ArrowDown></ArrowDown> : <ArrowRight></ArrowRight>}
        </span>
        <span className={styles.icon}>
          <ItemIcon></ItemIcon>
        </span>
        <span className={styles.text}>{item.name}</span>
      </div>
      <div
        className={styles.subItems + getSubItemsClassName()}
        style={{ height: expand ? 'auto' : '0px' }}
      >
        {renderSubItems()}
        {showCreateFolder ?
          <CreateItem CreateItemIcon={CreateItemIcon} createItem={createItem}></CreateItem> : null
        }
      </div>
    </div>
  );
};

export default ItemComponent;

export interface Item {
  name: string;
  data: {
    prefix: string;
  };
}
