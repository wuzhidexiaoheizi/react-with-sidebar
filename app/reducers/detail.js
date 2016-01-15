import update from 'react-addons-update';
import {parseData} from '../helper';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'FETCH_DETAIL_DONE': {
    return update(state, {
      [action.id]: {$set: parseData(action.item, action.td)}
    });
  }
  case 'ITEM_STARTED': {
    return update(state, {
      [action.id]: {status: {$set: 'started'}}
    });
  }
  case 'ITEM_END': {
    return update(state, {
      [action.id]: {status: {$set: 'end'}}
    });
  }

  default: return state;
  }
}
