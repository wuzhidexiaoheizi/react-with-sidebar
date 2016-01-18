import { parseData } from '../helper';
import update from 'react-addons-update';

const initialState = {
  listFetched: false,
  items: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'FETCH_LIST_DONE': {
    const items = action.items.map(item => {
      return parseData(item);
    });
    return update(state, {
      listFetched: {$set: true},
      items: {$set: items}
    });
  }

  case 'UPDATE_ITEM_STATUS': {
    const index = state.items.findIndex(item => item.id === action.id);

    return update(state, {
      items: {$apply: (items) => {
        items[index].status = action.status;
      }}
    });
  }

  case 'FETCH_DETAIL_DONE': {
    const index = state.items.findIndex(item => item.id == action.id);

    if (index > -1) {
      return update(state, {
        items: {
          [index]: {$merge: parseData(action.item)}
        }
      });
    }
    return update(state, {
      items: {$push: [parseData(action.item)]}
    });
  }
  default: return state;
  }
}
