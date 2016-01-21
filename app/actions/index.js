import fetch from 'isomorphic-fetch';
import config from '../config.js';

const {API, ONE_MONEY_ID, WINNERS_NUM} = config[__ENV__];

const _fetch = url => {
  return fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'}
  );
};

const handleHTTPError = res => {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }
  console.log(res);
  window.yinz = res;
  throw new Error(res.status);
};

export function fetchList() {
  return (dispatch, getState) => {
    if (getState().list.listFetched) return;

    _fetch(`${API}/${ONE_MONEY_ID}/items?u=${Date.now()}`)
      .then(handleHTTPError)
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: 'FETCH_LIST_DONE',
          items: json.items,
          td: json.td || 0,
        });
      });
  };
}

export function updateItemStatus(id, status) {
  return dispatch => {
    dispatch({type: 'UPDATE_ITEM_DONE', item: {status}, id, tag: 'updateItemStatus'});
  };
}

export function fetchWinners(id) {
  return dispatch => {
    _fetch(`${API}/${ONE_MONEY_ID}/status/${id}?winners=${WINNERS_NUM}`)
      .then(handleHTTPError)
      .then(res => res.json())
      .then(json => {
        delete json.status;
        dispatch({type: 'UPDATE_ITEM_DONE', item: json, id, tag: 'fetchWinners'});
      });
  };
}

export function fetchCallback(id) {
  return dispatch => {
    _fetch(`${API}/${ONE_MONEY_ID}/callback/${id}`)
      .then(handleHTTPError)
      .then(res => res.json())
      .then(json => {
        if (json.grabs && json.grabs.length) json.status = json.grabs[0].status;
        if (json.status == 'success') {
          delete json.status;
        } else {
          json.item_status = json.status;
        }
        dispatch({type: 'FETCH_CALLBACK_DONE', item: json, id, tag: 'fetchCallback'});
      }).catch(err => {
        console.log('callback error:', err);
        if (err.message == 401) return dispatch({type: 'NOT_SIGN_UP'});
      });
  };
}

export function fetchDetail(id) {
  return dispatch => {
    _fetch(`${API}/${ONE_MONEY_ID}/items/${id}?u=${Date.now()}`)
      .then(handleHTTPError)
      .then(res => res.json())
      .then(json => {
        dispatch({type: 'UPDATE_ITEM_DONE', item: json, id, tag: 'fetchDetail'});
      });
    dispatch(fetchWinners(id));
    dispatch(fetchCallback(id));
  };
}

export function fetchGrab(id) {
  return dispatch => {
    _fetch(`${API}/${ONE_MONEY_ID}/grab/${id}`)
    .then(handleHTTPError)
    .then(res => res.json())
    .then(json => {
      if (json.status == 'success') {
        json.status = 'pending';
        dispatch({type: 'FETCH_GRAB_SUCCESS', id, grab: json, url: json.callback_url});
      } else if (json.status == 'insufficient') {
        dispatch({type: 'FETCH_GRAB_INSUFFICIENT', id});
      } else {
        dispatch({type: 'FETCH_GRAB_FAILED', id});
        dispatch(fetchCallback(id));
      }
    })
    .catch(err => {
      console.log('grab error:', err);

      if (err.message == 401) {
        dispatch({type: 'NOT_SIGN_UP'});
      } else if (err.message == 500) {
        dispatch({type: 'FETCH_GRAB_INSUFFICIENT'});
      } else {
        dispatch({type: 'FETCH_GRAB_FAILED', id});
      }
      dispatch(fetchCallback(id));
    });
  };
}
