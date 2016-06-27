import {combineReducers} from 'redux';
import cakeList from './cakeList';
import shop from './shop';
import party from './party';
import bless from './bless';
import virtualPresent from './virtualPresent';

const rootReducer = combineReducers({
  cakeList,
  shop,
  party,
  bless,
  virtualPresent
});

export default rootReducer;
