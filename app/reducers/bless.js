import update from 'react-addons-update';

const initialState = {
  listFetching: false,
  blesses: [],
  total: 0,
  earliestId: '',
  partyId: ''
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'FETCH_BLESS_PAGE_DATA_DONE': {
    const { result: {blesses, total}, partyId } = action;

    if (partyId != state.partyId) {
      const { length } = blesses;

      return update(state, {
        blesses: { $set: blesses },
        listFetching: { $set: false },
        total: { $set: total },
        earliestId: { $set: length > 0 ? blesses[length - 1].id : ''},
        partyId: { $set: partyId },
      });
    }

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
      partyId: { $set: partyId },
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
