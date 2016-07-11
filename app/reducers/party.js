import update from 'react-addons-update';

const initialState = {
  party: {}
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'FETCH_PARTY_DONE': {
    return update(state, {
      party: { $set: action.party }
    });
  }

  case 'UPDATE_PARTY_MESSAGE': {
    return update(state, {
      party: {
        message: { $set: action.message }
      }
    });
  }

  case 'UPDATE_PARTY_AVATAR': {
    return update(state, {
      party: {
        person_avatar: { $set: action.url }
      }
    });
  }

  case 'UPDATE_PARTY': {
    return update(state, {
      party: { $merge: action.party }
    });
  }

  default: return state;
  }
}
