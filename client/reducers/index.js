import { combineReducers } from 'redux';
import tablesReducer from './tablesReducer';
// import reducers written in other files here

const reducers = combineReducers({ tables: tablesReducer });
// add object with each property being a reducer

export default reducers;
