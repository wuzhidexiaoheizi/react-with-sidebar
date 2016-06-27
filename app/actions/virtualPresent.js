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
    const { virtualPresent: { loadedPage, listFetching } } = state;

    if (listFetching || page <= loadedPage) return false;

    dispatch({ type: 'FETCH_PRESENT_PAGE_DATA_START' });

    const { DOMAIN, API_PROMOTION_PREFIX, VIRTUAL_PRESENT_URL} = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${VIRTUAL_PRESENT_URL}?page=${page}&per=${per}`;

    return _fetch(url, 'get')
      .then(json => {
        return dispatch(setVirtualPresentPageData(json));
      });
  };
}
