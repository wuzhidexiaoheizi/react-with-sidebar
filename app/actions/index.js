import fetch from 'isomorphic-fetch';

import {API, ONE_MONEY_ID} from '../config.json';

export function signIn() {
  fetch(`${API}/${ONE_MONEY_ID}/signup`, {method: 'put'})
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(json => {
      console.log(json);
    }).catch(e => {
      console.log(e);
    });
}

export function fetchList() {
  return (dispatch, getState) => {
    if (getState().list.items.length) return;

    fetch(`${API}/${ONE_MONEY_ID}/items?u=${Date.now()}`)
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
    dispatch({
      type: 'UPDATE_ITEM_STATUS',
      status,
      id,
    });
  };
}

export function fetchDetail(id) {
  return (dispatch, getState) => {
    if (getState().detail[id]) return;

    fetch(`${API}/${ONE_MONEY_ID}/items/${id}?u=${Date.now()}`)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        dispatch({
          type: 'FETCH_DETAIL_DONE',
          item: json,
          id,
        });
      });
  };
}
