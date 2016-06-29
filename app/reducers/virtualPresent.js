import update from 'react-addons-update';

const initialState = {
  listFetching: false,
  presents: [],
  loadedPage: 0,
  totalPage: 0,
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'FETCH_PRESENT_PAGE_DATA_DONE': {
    const { virtual_presents, page, total_page } = action.result;
    const { loadedPage } = state;

    if (page > loadedPage) {
      return update(state, {
        presents: { $push: [...virtual_presents] },
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

  default: return state;
  }
}
