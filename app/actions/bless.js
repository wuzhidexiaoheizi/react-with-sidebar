import { _fetch, serializeParams } from '../helper';
import Constants from '../constants';

export function setBlessPageData(partyId, json) {
  return dispatch => {
    dispatch({ type: 'FETCH_BLESS_PAGE_DATA_DONE', partyId, result: json });
  };
}

export function insertBless(bless) {
  return dispatch => {
    dispatch({ type: 'INSERT_BLESS', bless });
  };
}

export function fetchBlessList(partyId, latest_id, limit = 10) {
  return (dispatch, getState) => {
    const state = getState();
    const { bless: { listFetching } } = state;

    if (listFetching) return false;

    dispatch({ type: 'FETCH_BLESS_PAGE_DATA_START' });

    const { DOMAIN, API_PROMOTION_PREFIX, PARTY_URL, BLESS_URL} = Constants;
    const query = serializeParams({latest_id, limit});
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${PARTY_URL}/${partyId}${BLESS_URL}?${query}`;

    return _fetch(url, 'get')
      .then(json => {
        dispatch(setBlessPageData(partyId, json));
      });
  };
}

export function sendBless(partyId, params = {}, sucCallback, errCallback) {
  return dispatch => {
    const { DOMAIN, API_PROMOTION_PREFIX, PARTY_URL, BLESS_URL} = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${PARTY_URL}/${partyId}${BLESS_URL}`;
    const body = JSON.stringify(params);

    return _fetch(url, 'post', body)
      .then(json => {
        const { errors, wx_pay_url, paid } = json;

        if ( errors ) {
          if (typeof errCallback == 'function') errCallback(errors);
        } else {
          if (paid) dispatch(insertBless(json));
          if (typeof sucCallback == 'function') sucCallback(wx_pay_url);
        }
      });
  };
}
