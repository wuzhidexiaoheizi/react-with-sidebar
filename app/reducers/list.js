import { parseData } from '../helper';
import update from 'react-addons-update';

const initialState = {
  fetching: true,
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'FETCH_LIST_DONE': {
    const items = action.items.map(item => {
      return parseData(item);
    });
    return update(state, {
      fetching: {$set: false},
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

  default: return state;
  }
}
