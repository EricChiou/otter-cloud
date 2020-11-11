import React, { FunctionComponent, useState, MouseEvent, useEffect, useRef, RefObject } from 'react';
import { useSelector } from 'react-redux';

import { ArrowRight, ArrowDown } from 'src/components/icons';
import CreateItem from './create-item/CreateItem';
import { selectPrefix } from 'src/store/system.slice';

import styles from './Item.module.scss';

interface Props {
  ItemIcon: FunctionComponent;
  item: Item;
  SubItemIcon: FunctionComponent;
  subItems: Item[];
  onSelect?: (ele: HTMLElement, itemData: Item) => void;
  showCreateFolder?: boolean;
  CreateItemIcon?: FunctionComponent;
  createItem?: (itemName: string) => void;
}

const Item: FunctionComponent<Props> = ({
  ItemIcon,
  item,
  SubItemIcon,
  subItems,
  onSelect,
  showCreateFolder,
  CreateItemIcon,
  createItem,
}) => {
  const prefix = useSelector(selectPrefix);
  const itemRef: RefObject<HTMLDivElement> = useRef(null);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024 && expand) {
        setExpand(false);
      }
    };
    window.addEventListener('resize', onResize);

    return () => { window.removeEventListener('resize', onResize); };
  });

  const itemOnSelect = (e: MouseEvent<HTMLElement>, itemData: Item) => {
    removeActiveEle();
    e.currentTarget.classList.add(styles.active);

    if (onSelect) {
      onSelect(e.currentTarget, itemData);
    }
  };

  const removeActiveEle = () => {
    if (!itemRef.current) { return; }

    const avtiveEles = itemRef.current.getElementsByClassName(styles.active);
    Array.from(avtiveEles).forEach((ele) => {
      ele.classList.remove(styles.active);
    });
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
  }

  const renderSubItems = () => {
    return subItems.map((subItem, i) => {
      return (
        <div key={i} className={styles.subItem + getItemClassName(subItem)} onClick={(e) => { itemOnSelect(e, subItem); }}>
          <div className='vert-align-mid'></div>
          <span className={styles.icon}>
            <SubItemIcon></SubItemIcon>
          </span>
          <span className={styles.text}>
            {subItem.name}
          </span>
        </div>
      );
    });
  };

  return (
    <div ref={itemRef} className={styles.itemContainer}>
      <div className={styles.item + getItemClassName(item)} onClick={(e) => { itemOnSelect(e, item); }}>
        <div className='vert-align-mid'></div>
        <span className={styles.expand} onClick={expandOnSelect}>
          {expand ? <ArrowDown></ArrowDown> : <ArrowRight></ArrowRight>}
        </span>
        <span className={styles.icon}>
          <ItemIcon></ItemIcon>
        </span>
        <span className={styles.text}>{item.name}</span>
      </div>
      <div className={styles.subItems + getSubItemsClassName()} style={{ height: expand ? 'auto' : '0px' }}>
        {renderSubItems()}
        {showCreateFolder ?
          <CreateItem CreateItemIcon={CreateItemIcon} createItem={createItem}></CreateItem>
          : null
        }
      </div>
    </div>
  );
};

export default Item;

export interface Item {
  name: string;
  data: {
    bucketName: string;
    prefix: string;
  };
}
