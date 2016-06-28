import update from 'react-addons-update';

const initialState = {
  users: [],
  currentUser: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'SET_CURRENT_USER': {
    const { user } = action;

    return update(state, {
      currentUser: { $set: user },
      users: { $push: [ user ] },
    });
  }

  default: return state;
  }
}
