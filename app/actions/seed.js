import {_fetch} from '../helper';
import {fetchCurrentUser} from './user';

export function setFromSeed(seed) {
  return dispatch => {
    dispatch({type: 'SET_FROM_SEED', fromSeed: seed});
  };
}

export function setSeed(seed) {
  return dispatch => {
    dispatch({type: 'SET_SEED', seed: seed});
  };
}

export function receiveSeeds(seeds) {
  return dispatch => {
    dispatch({type: 'RECEIVE_SEEDS', seeds: seeds});
  };
}

export function fetchSeeds(user_id) {
  return dispatch => {
    const url = `${__API__}/${__ONE_MONEY_ID__}/user_seeds/${user_id}`;

    return _fetch(url)
      .then(json => {
        const {seeds} = json;
        dispatch(receiveSeeds(seeds));
      });
  };
}

export function fetchCurrentSeeds() {
  return dispatch => {
    return dispatch(fetchCurrentUser())
      .then(currentUser => {
        dispatch(fetchSeeds(currentUser.id));
      });
  };
}

export function fetchFromSeed(seed_id) {
  return dispatch => {
    const url = `${__API__}/${__ONE_MONEY_ID__}/seeds/${seed_id}`;
    return _fetch(url)
      .then(json => {
        const {seed} = json;
        dispatch(setFromSeed(seed));
      });
  };
}

export function fetchSeed(seed_id) {
  return dispatch => {
    const url = `${__API__}/${__ONE_MONEY_ID__}/seeds/${seed_id}`;
    return _fetch(url)
      .then(json => {
        const {seed} = json;
        dispatch(setSeed(seed));
      });
  };
}
