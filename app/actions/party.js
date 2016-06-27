import { _fetch } from '../helper';
import Constants from '../constants';
import { fethcCakeItem } from './cakeList';

export function setParty(id, party) {
  return dispatch => {
    dispatch({ type: 'FETCH_PARTY_DONE', id, party });
  };
}

export function updateMessage(message) {
  return dispatch => {
    dispatch({ type: 'UPDATE_PARTY_MESSAGE', message });
  };
}

export function fetchParty(partyId, loadCake) {
  return (dispatch, getState) => {
    const { DOMAIN, API_PROMOTION_PREFIX, PARTY_URL } = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${PARTY_URL}/${partyId}`;

    return _fetch(url)
      .then(json => {
        const state = getState();

        if (loadCake) {
          const { cakeList: { cakeItems } } = state;
          const { cake_id } = json;
          const cakeItem = cakeItems.find(item => item.id == cake_id);

          if (!cakeItem) dispatch(fethcCakeItem(cake_id));
        }

        return dispatch(setParty(partyId, json));
      });
  };
}

export function updatePartyMessage(partyId, message, sucCallback) {
  return dispatch => {
    const { DOMAIN, API_PROMOTION_PREFIX, PARTY_URL } = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${PARTY_URL}/${partyId}`;
    const params = {
      'birthday_party': {
        message: message
      }
    };
    const body = JSON.stringify(params);

    return _fetch(url, 'PATCH', body)
      .then(() => {
        if (typeof sucCallback == 'function') sucCallback();

        return dispatch(updateMessage(message));
      });
  };
}
