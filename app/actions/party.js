import fetch from 'isomorphic-fetch';
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

export function updateAvatar(url) {
  return dispatch => {
    dispatch({ type: 'UPDATE_PARTY_AVATAR', url });
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
      birthday_party: {
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

export function uploadPartyAvatar(partyId, body, sucCallback, errCallback) {
  return dispatch => {
    const { DOMAIN, API_PROMOTION_PREFIX, PARTY_URL, PARTY_AVATAR_UPLOAD_URL} = Constants;
    const path = `${DOMAIN}${API_PROMOTION_PREFIX}${PARTY_URL}/${partyId}${PARTY_AVATAR_UPLOAD_URL}`;

    return fetch(path, {
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: 'POST',
      body,
    })
    .then(res => {
      if (res.status == 401 || res.status == 404) throw new Error(401);

      return res;
    })
    .then(res => res.json())
    .then((json) => {
      const { errors, url } = json;

      if (errors) {
        if (typeof errCallback == 'function') errCallback(errors);
      } else {
        if (typeof sucCallback == 'function') sucCallback();

        return dispatch(updateAvatar(url));
      }
    });

    // return _fetch(path, 'POST', body)
    //   .then((json) => {
    //     const { errors, url } = json;

    //     if (errors) {
    //       if (typeof errCallback == 'function') errCallback(errors);
    //     } else {
    //       if (typeof sucCallback == 'function') sucCallback();

    //       return dispatch(updateAvatar(url));
    //     }
    //   });
  };
}
