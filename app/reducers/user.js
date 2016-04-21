const initialState = {
  currentUser: null,
  isAnonymous: true
};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'SET_CURRENT_USER': {
    const {currentUser} = action;

    return Object.assign({}, state, {currentUser});
  }
  default: return state;
  }
}
