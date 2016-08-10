import { _fetch } from '../helper';
import Constants from '../constants';

export function setVirtualPresentPageData(json) {
  return dispatch => {
    dispatch({ type: 'FETCH_PRESENT_PAGE_DATA_DONE', result: json });
  };
}

export function fetchVirtualPresent(page = 1, per = 10) {
  return (dispatch, getState) => {
    const state = getState();
    const { virtualPresent: { listFetching } } = state;

    if (listFetching) return false;

    dispatch({ type: 'FETCH_PRESENT_PAGE_DATA_START' });

    const { DOMAIN, API_PROMOTION_PREFIX, VIRTUAL_PRESENT_URL} = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${VIRTUAL_PRESENT_URL}?page=${page}&per=${per}`;

    return _fetch(url)
      .then(json => {
        return dispatch(setVirtualPresentPageData(json));
      });
  };
}

export function checkPresentIsForbidden(name, callback) {
  return dispatch => {
    const { DOMAIN, API_PROMOTION_PREFIX, VIRTUAL_PRESENT_URL, CHECK_PRESENT_EXIST } = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${VIRTUAL_PRESENT_URL}${CHECK_PRESENT_EXIST}?name=${name}`;

    return _fetch(url)
      .then(json => {
        const { isExist } = json;

        if (typeof callback == 'function') callback(isExist);

        if (!isExist) {
          return dispatch({ type: 'ADD_FORBIDDEN_PRESENT', name });
        }
      });
  };
}
