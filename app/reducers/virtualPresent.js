import update from 'react-addons-update';

const initialState = {
  listFetching: false,
  presents: [],
  loadedPage: 0,
  totalPage: 0,
  forbidPresentNames: [],
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'FETCH_PRESENT_PAGE_DATA_DONE': {
    const { virtual_presents, page, total_page } = action.result;
    const { loadedPage } = state;

    if (page > loadedPage) {
      return update(state, {
        presents: { $merge: [...virtual_presents] },
        loadedPage: { $set: page },
        totalPage: { $set: total_page },
        listFetching: { $set: false }
      });
    }

    return update(state, {
      listFetching: { $set: false }
    });
  }

  case 'FETCH_PRESENT_PAGE_DATA_START': {
    return update(state, {
      listFetching: { $set: true }
    });
  }

  case 'ADD_FORBIDDEN_PRESENT': {
    const { forbidPresentNames } = state;
    const { name } = action;

    if (forbidPresentNames.indexOf(name) == -1) {
      return update(state, {
        forbidPresentNames: { $merge: [ name ] }
      });
    }
  }

  default: return state;
  }
}
