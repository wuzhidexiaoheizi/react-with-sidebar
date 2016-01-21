import fetch from 'isomorphic-fetch';
import config from '../config.js';

const {API, ONE_MONEY_ID} = config[__ENV__];

// 获取 list
export function fetchList() {
  return (dispatch, getState) => {
    if (getState().list.listFetched) return;

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

// 根据 id 更新 item status
export function updateItemStatus(id, status) {
  return dispatch => {
    dispatch({type: 'UPDATE_ITEM_DONE', item: {status}, id});
  };
}

// 获取 winners
export function fetchWinners(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/status/${id}?winners=10`)
      .then(res => res.json())
      .then(json => {
        delete json.status;
        dispatch({type: 'UPDATE_ITEM_DONE', item: json, id, min: 'winners'});
      });
  };
}

// 获取 callback 确认信息
export function fetchCallback(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/callback/${id}`, {credentials: 'same-origin'})
      .then(res => res.json())
      .then(json => {
        if (json.grabs && json.grabs.length) json.status = json.grabs[0].status;
        if (json.status == 'success') delete json.status;
        dispatch({type: 'UPDATE_ITEM_DONE', item: json, id, min: 'callback'});
      });
  };
}

// 获取 detail 信息
export function fetchDetail(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/items/${id}?u=${Date.now()}`)
      .then(res => res.json())
      .then(json => {
        dispatch({type: 'UPDATE_ITEM_DONE', item: json, id});
      });

    dispatch(fetchWinners(id)); // 获取 winners
    dispatch(fetchCallback(id)); // 获取 callback
  };
}

// 抢购按钮
export function fetchGrab(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/grab/${id}`, {credentials: 'same-origin'})
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
      console.log(err);
      dispatch({type: 'FETCH_GRAB_FAILED', id});
      dispatch(fetchCallback(id));
    });
  };
}
