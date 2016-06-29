import { _fetch } from '../helper';
import Constants from '../constants';

export function fetchCurrentUser() {
  return dispatch => {
    const { DOMAIN, API_USER_URL } = Constants;
    const url = `${DOMAIN}${API_USER_URL}`;

    return _fetch(url)
      .then((user) => {
        return dispatch({ type: 'SET_CURRENT_USER', user });
      });
  };
}
