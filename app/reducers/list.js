import { parseData } from '../helper';

const initialState = {
  fetching: true,
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'FETCH_LIST_DONE':
    const items = [];
    for (const item of action.items) {
      item.has_fetch_detail = false;
      items.push(parseData(item, action.td));
    }

    return Object.assign({}, state, {fetching: false, items});

  case 'UPDATE_ITEM_STATUS':
    const newItems = state.items.copyWithin();
    const index = newItems.findIndex(item => item.id === action.id);
    newItems[index] = action.status;

    return Object.assign({}, state, {items: newItems});

  default: return state;
  }
}
