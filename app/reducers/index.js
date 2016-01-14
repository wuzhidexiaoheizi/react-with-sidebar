import { combineReducers } from 'redux';
import { parseData } from '../helper';

function list(state = {fetching: true, items: []}, action) {
  switch (action.type) {
  case 'FETCH_LIST_DONE':
    const items = [];
    for (const item of action.items) {
      items.push(parseData(item, action.td));
    }
    return Object.assign({}, state, {fetching: false, items});

  case 'UPDATE_ITEM_STATUS':
    const newItems = state.items.concat();
    newItems[action.index].status = action.status;

    return Object.assign({}, state, {items: newItems});

  default: return state;
  }
}

function home(state = {}, action) {
  switch (action.type) {
  case 'test' : return [{name: 'test-item'}];
  default: return state;
  }
}

const rootReducer = combineReducers({
  home,
  list,
});

export default rootReducer;
