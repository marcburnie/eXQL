import React from 'react';
import { Menu } from 'react-data-grid-addons';

const { ContextMenu, MenuItem, SubMenu } = Menu;

function TableContextMenu({
  idx,
  id,
  rowIdx,
  onRowDelete,
  onRowInsertAbove,
  onRowInsertBelow,
}) {
  return (
    <ContextMenu id={id}>
      <MenuItem data={{ rowIdx, idx }} onClick={onRowDelete}>
        Delete Row
      </MenuItem>
      <SubMenu title="Insert Row">
        <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertAbove}>
          Above
        </MenuItem>
        <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertBelow}>
          Below
        </MenuItem>
      </SubMenu>
    </ContextMenu>
  );
}

export default TableContextMenu;
