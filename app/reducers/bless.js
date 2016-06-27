import update from 'react-addons-update';

const initialState = {
  listFetching: false,
  blesses: [],
  total: 0,
  earliestId: '',
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'FETCH_BLESS_PAGE_DATA_DONE': {
    const { blesses, total } = action.result;

    if (blesses.length > 0) {
      return update(state, {
        blesses: { $push: [ ...blesses ] },
        listFetching: { $set: false },
        total: { $set: total },
        earliestId: { $set: blesses[blesses.length - 1].id },
      });
    }

    return update(state, {
      listFetching: { $set: false },
    });
  }

  case 'FETCH_BLESS_PAGE_DATA_START': {
    return update(state, {
      listFetching: { $set: true },
    });
  }

  case 'INSERT_BLESS': {
    const { bless } = action;

    return update(state, {
      listFetching: { $set: false },
      blesses: { $unshift: [ bless ] },
    });
  }

  default: return state;
  }
}
