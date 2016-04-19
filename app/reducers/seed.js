const initialState = {
  fromSeed: null,
  seed: null,
  seeds: []
};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'SET_SEED': {
    const {seed} = action;
    return Object.assign({}, state, {seed});
  }

  case 'SET_FROM_SEED': {
    const {fromSeed} = action;
    return Object.assign({}, state, {fromSeed});
  }

  case 'RECEIVE_SEEDS': {
    const {seeds} = action;
    return Object.assign({}, state, {seeds});
  }

  default: return state;
  }
}
