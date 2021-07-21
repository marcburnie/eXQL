import * as types from '../constants/actionTypes';

export const getTables = (tableData) => ({
  type: types.GET_TABLES,
  payload: tableData,
});

export const getTable = (name, columns, rows, primary_key) => ({
  type: types.GET_TABLE,
  payload: {
    name,
    columns,
    rows,
    primary_key,
  },
});

export const updateTable = (fromRow, toRow, updated) => ({
  type: types.UPDATE_TABLE,
  payload: {fromRow, toRow, updated},
});
