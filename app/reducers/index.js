import {combineReducers} from 'redux';
import list from './list';
import home from './home';
import detail from './detail';

const rootReducer = combineReducers({
  home,
  list,
  detail,
});

export default rootReducer;
