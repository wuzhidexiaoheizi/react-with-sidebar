import {combineReducers} from 'redux';
import list from './list';
import home from './home';
import alert from './alert';

const rootReducer = combineReducers({
  home,
  list,
  alert,
});

export default rootReducer;
