import {combineReducers} from 'redux';
import cakeList from './cakeList';
import shop from './shop';
import party from './party';
import bless from './bless';
import virtualPresent from './virtualPresent';
import user from './user';
import rank from './rank';

const rootReducer = combineReducers({
  cakeList,
  shop,
  party,
  bless,
  virtualPresent,
  user,
  rank,
});

export default rootReducer;
