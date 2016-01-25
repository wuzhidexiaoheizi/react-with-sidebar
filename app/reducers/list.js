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
    return {
      listFetched: true,
      items,
    };
  }

  case 'FETCH_CALLBACK_DONE': {
    if (action.item.grabs && action.item.grabs.length) action.item.status = action.item.grabs[0].status;
    if (action.item.status == 'success') delete action.item.status;

    const index = state.items.findIndex(item => item.id == action.id);
    if (index > -1) {
      return update(state, {
        items: {
          [index]: {$merge: parseData(action.item)}
        }
      });
    }
  }

  case 'UPDATE_ITEM_DONE': {
    const index = state.items.findIndex(item => item.id == action.id);

    if (action.item.item_status) {
      action.item.status = action.item.item_status;
      delete action.item.item_status;
    }
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

  case 'FETCH_GRAB_SUCCESS': {
    const index = state.items.findIndex(item => item.id == action.id);
    return update(state, {
      items: {
        [index]: {
          grabs: {$set: [action.grab]}
        }
      }
    });
  }
  default: return state;
  }
}
