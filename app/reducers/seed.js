const initialState = {
  fromSeed: null,
  seed: null,
  seeds: [],
  given_user: null
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

  case 'SET_USER': {
    const {user, seed_id} = action;
    const seed = state.seeds.find(_seed => _seed.id == seed_id );

    if (seed) {
      Object.assign({}, seed, {given_user: user});
    }

    return state;
  }

  default: return state;
  }
}
