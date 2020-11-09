import React, { FunctionComponent, useState, MouseEvent } from 'react';

import { ArrowRight, ArrowDown } from 'src/components/icons';
import CreateItem from './create-item/CreateItem';

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
  const [expand, setExpand] = useState(true);

  const itemOnSelect = (e: MouseEvent<HTMLElement>, itemData: Item) => {
    if (onSelect) {
      onSelect(e.currentTarget, itemData);
    }
  };

  const expandOnSelect = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setExpand(!expand);
  };

  const renderSubItems = () => {
    return subItems.map((subItem, i) => {
      return (
        <div key={i} className={styles.subItem} onClick={(e) => { itemOnSelect(e, subItem); }}>
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
    <div className={styles.itemContainer}>
      <div className={styles.item} onClick={(e) => { itemOnSelect(e, item); }}>
        <div className='vert-align-mid'></div>
        <span className={styles.expand} onClick={expandOnSelect}>
          {expand ? <ArrowDown></ArrowDown> : <ArrowRight></ArrowRight>}
        </span>
        <span className={styles.icon}>
          <ItemIcon></ItemIcon>
        </span>
        <span className={styles.text}>{item.name}</span>
      </div>
      <div className={styles.subItems} style={{ height: expand ? 'auto' : '0px' }}>
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
