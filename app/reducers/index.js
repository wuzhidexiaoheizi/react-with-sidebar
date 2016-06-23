import {combineReducers} from 'redux';
import cakeList from './cakeList';
import shop from './shop';

const rootReducer = combineReducers({
  cakeList,
  shop,
});

export default rootReducer;
