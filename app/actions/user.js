import {_fetch} from '../helper';

export function setCurrentUser(user) {
  return dispatch => {
    dispatch({type: 'SET_CURRENT_USER', currentUser: user});
  };
}

export function fetchCurrentUser() {
  return dispatch => {
    const url = `/api/user`;
    return _fetch(url)
      .then(json => {
        dispatch(setCurrentUser(json));
        return json;
      });
  };
}
