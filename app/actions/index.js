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

// 'always': '您已经抢过了',
// 'no-executies': '没有抢购机会了',
// 'lack-multi-item': '您已经抢过其他的',
// 'insufficient': '商品库存不足',
// 'suspend': '商品已经抢光了',
// 'waiting': '活动未开始',
// 'end': '活动已结束',
// 'state-invalid': '活动未开始/已结束',
// 'total_amount_zero': '本期活动中此商品总库存为0',
// 'quantity_zero': '本期活动中此商品的每次抢购个数为0'

export function interval(id) {
  return (dispatch, getState) => {
    const {end_at, start_at, status} = getState.detail[id];
    const now = Date.now();

    switch (status) {
    case 'timing': return console.log(status);
    case 'no-executies': return console.log(status);
    case 'suspend': return console.log(status);
    default: return console.log(status);
    }

    if (now >= start_at) {
      dispatch({
        type: 'UPDATE_ITEM_STATUS',
        status: 'started',
        id,
      });
    }

    if (now >= end_at) {
      dispatch({
        type: 'UPDATE_ITEM_STATUS',
        status: 'end',
        id,
      });
    }
  };
}
