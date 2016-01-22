import {combineReducers} from 'redux';
import list from './list';
import alert from './alert';

const rootReducer = combineReducers({
  list,
  alert,
});

export default rootReducer;
