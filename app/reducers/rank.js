import update from 'react-addons-update';

const initialState = {
  listFetching: false,
  parties: [],
  loadedPage: 0,
};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'FETCH_RANK_PAGE_DATA_DONE': {
    const { parties, page } = action;

    if (page > state.loadedPage && parties.length > 0) {
      return update(state, {
        listFetching: { $set: false },
        parties: { $merge: [ ...parties ] },
        loadedPage: { $set: page }
      });
    }

    return update(state, {
      listFetching: { $set: false },
    });
  }
  case 'FETCH_RANK_DATA_START': {
    return update(state, {
      listFetching: { $set: true }
    });
  }
  default: return state;
  }
}
