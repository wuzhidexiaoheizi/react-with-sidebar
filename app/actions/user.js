import { _fetch } from '../helper';
import Constants from '../constants';

export function fetchCurrentUser(callback) {
  return dispatch => {
    const { DOMAIN, API_USER_URL } = Constants;
    const url = `${DOMAIN}${API_USER_URL}`;

    return _fetch(url)
      .then((user) => {
        if (typeof callback == 'function') callback(user.id);
        return dispatch({ type: 'SET_CURRENT_USER', user });
      });
  };
}
