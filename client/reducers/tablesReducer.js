import * as types from '../constants/actionTypes';

const initialState = {
  tableData: [],
  columns: [],
  rows: [],
  name: '',
  primary_key: '',
};

const tablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_TABLES:
      const tableData = action.payload;
      return {...state, tableData };
    case types.GET_TABLE:
      return {...state, ...action.payload};
    case types.UPDATE_TABLE:
      const {fromRow, toRow, updated} = action.payload;
      // update state when cell values change
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i += 1) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { ...state, rows };
    default:
      return state;
  }
};

export default tablesReducer;
