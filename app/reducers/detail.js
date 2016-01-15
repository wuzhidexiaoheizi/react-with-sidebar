import {parseData} from '../helper';

const initialState = {};

export default function(state = initialState, action) {
  let _item;
  switch (action.type) {
  case 'FETCH_DETAIL_DONE':
    return Object.assign({}, state, {[action.id]: parseData(action.item, action.td)});

  case 'ITEM_STARTED':
    _item = Object.assign({}, state[action.id]);
    _item.status = 'started';
    return Object.assign({}, state, {[action.id]: _item});

  case 'ITEM_END':
    _item = Object.assign({}, state[action.id]);
    _item.status = 'end';
    return Object.assign({}, state, {[action.id]: _item});

  default: return state;
  }
}
