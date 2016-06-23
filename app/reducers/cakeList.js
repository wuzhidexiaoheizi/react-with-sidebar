import update from 'react-addons-update';

const initialState = {
  listFetching: true,
  cakeItems: [],
  loadedPage: 0,
  totalPage: 0
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'FETCH_PAGE_DATA_DONE': {
    const { cakes, page, total_page } = action.result;

    if (page > state.loadedPage) {
      return update(state, {
        loadedPage: { $set: page },
        totalPage: { $set: total_page },
        cakeItems: { $push: [...cakes]},
        listFetching: { $set: false }
      });
    }

    return state;
  }

  case 'FETCH_PAGE_DATA_START': {
    return update(state, {
      listFetching: { $set: true }
    });
  }

  case 'FETCH_CAKE_ITEM_SALED_COUNT_DONE': {
    const { saledCount } = action;
    const index = state.cakeItems.findIndex(item => item.id == action.id);

    if (index > -1) {
      return update(state, {
        cakeItems: {
          [index]: {
            saled_count: { $set: saledCount }
          }
        }
      });
    }

    return state;
  }

  case 'FETCH_CAKE_ITEM_DONE': {
    const { cakeItem } = action;
    const index = state.cakeItems.findIndex(item => item.id == action.id);

    if (index > -1) {
      return update(state, {
        cakeItems: {
          [index]: { $merge: cakeItem }
        }
      });
    }

    return update(state, {
      cakeItems: { $push: [cakeItem] }
    });
  }

  default: return state;
  }
}
