import { _fetch } from '../helper';
import Constants from '../constants';
import { fetchCakeItem } from './cakeList';

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

export function fetchParty(partyId, config = {}) {
  return (dispatch, getState) => {
    const { DOMAIN, API_PROMOTION_PREFIX, PARTY_URL } = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${PARTY_URL}/${partyId}`;

    return _fetch(url)
      .then(json => {
        const state = getState();
        const { loadCake, callback } = config;

        if (loadCake) {
          const { cakeList: { cakeItems } } = state;
          const { cake_id } = json;
          const cakeItem = cakeItems.find(item => item.id == cake_id);

          if (!cakeItem) dispatch(fetchCakeItem(cake_id));
        }

        if (typeof callback == 'function') callback(json);

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

    return _fetch(path, 'POST', body, true)
      .then((json) => {
        const { errors, url } = json;

        if (errors) {
          if (typeof errCallback == 'function') errCallback(errors);
        } else {
          if (typeof sucCallback == 'function') sucCallback();

          return dispatch(updateAvatar(url));
        }
      });
  };
}

export function updateAvatarMediaId(partyId, mediaId, sucCallback, errCallback) {
  return dispatch => {
    const { DOMAIN, API_PROMOTION_PREFIX, PARTY_URL, UPDATE_AVATAR_URL } = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${PARTY_URL}/${partyId}/${UPDATE_AVATAR_URL}`;
    const params = {
      birthday_party: {
        avatar_media_id: mediaId
      }
    };
    const body = JSON.stringify(params);

    return _fetch(url, 'post', body)
      .then((json) => {
        const { errors, person_avatar } = json;

        if (errors) {
          if (typeof errCallback == 'function') errCallback(errors);
        } else {
          if (typeof sucCallback == 'function') sucCallback(person_avatar);

          return dispatch(updateAvatar(person_avatar));
        }
      });
  };
}

export function fetchRecentlyParties() {
  return dispatch => {
    const { DOMAIN, API_PROMOTION_PREFIX, PARTY_URL, RECENTLY_PARTIES_URL } = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${PARTY_URL}${RECENTLY_PARTIES_URL}`;

    return _fetch(url)
      .then(json => {
        const { parties } = json;

        return dispatch({ type: 'FETCH_RECENTLY_PARTIES_DONE', parties });
      });
  };
}
