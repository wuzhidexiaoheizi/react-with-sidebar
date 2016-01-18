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

export function updateItemStatus(id, status) {
  return dispatch => {
    dispatch({type: 'UPDATE_ITEM_DONE', item: {status}, id});
  };
}

export function fetchWinners(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/status/${id}?winners=10`)
      .then(res => res.json())
      .then(json => {
        dispatch({type: 'UPDATE_ITEM_DONE', item: json, id, min: 'winners'});
      });
  };
}

export function fetchCallback(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/callback/${id}`, {credentials: 'same-origin'})
      .then(res => res.json())
      .then(json => {
        if (json.grabs && json.grabs.length) json.status = json.grabs[0].status;
        dispatch({type: 'UPDATE_ITEM_DONE', item: json, id, min: 'callback'});
      });
  };
}

export function fetchDetail(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/items/${id}?u=${Date.now()}`)
      .then(res => res.json())
      .then(json => {
        dispatch({type: 'UPDATE_ITEM_DONE', item: json, id});
      });

    dispatch(fetchWinners(id));

    dispatch(fetchCallback(id));
  };
}

// callback_url: "http://localhost:3000/orders/yiyuan_confirm?i=TnRyT3J3OEVjL1B3UXg1QlpSL1UveHh0Q29xZjRlZHR6cHFaQlVVMURZVUErS2Jqc0ljaW1XazBLZ09MQStkRVBKUmkrZWVZY0FJaEhINk1DVW5IcWR1dHhQcUZlR3FqUmdEMkovMXk3ZmZwMUgwSVVhRXY0YVJBQlRLSTY0Vm05OUNHRkVRRWt1c1Rhd3BDMGRTYy9ndVpjSG9JUVdaaU8wekx0K0E5eXpqM1NsRmhQMGZISVZTN1pCWjRSUzBMOG1rMi9tcVpidFVyMTNVanBUU09TVmR3OG1lZmpXeitSKzVlS255Sk5NeGpUK2M2czFHNGtxMGx6cmlwaEpZYUFCaUhxdGx6YXB5OTJWbWVmUnZyZDBtcWNDRVlVY2ZaNVlsd2tSaldjamUxbXRoTmNiTkZ1MDZtbFFpVHZtYzdxdk5SZnZ5WW4reG1JKzBlZzNESGROOGNFeWRaY3orRnJ2U2JQTVhnT3ROa0pLRFVXYy9SMWxWSzQ2d1ZRbWZwWkdyajBoNG4yb3pQckhLWkNzZmU4bWtKQTZhamwrVDJZNlA4M25pKytPcnhsNjhaNDgrVkF1UXptdUJ3U0xPeklqd1ZlMkVPWFpGeTU0OWNTVUg5MXBaeDNaa1dFT3ZhRFVMOCtOQm1FcUR4R0ZCZHl5V0pqTWsrK3NjUURKcGFLcldYdDlTaUZGc3pNbURwWGZobDNnSngrbXMycldlUG1WVXhGUmVNcWE1bC92MGV0UDFsQWpWdlBGcXhMVUE5Y1F0b2RsK1FBd3lyN2FoVnp0UE1kZz09LS01SEp0WHJ0Q0ZySWVFVlcyS2RMT0xBPT0%3D--da50e4f0dc47a440e251490946d78a612f064443"
// grab_id: "14"
// item: "8"
// one_money: "1"
// status: "success"
// time_out: 54000
// user_id: "2"
// user_user_id: 100160
// winner: 1

export function grab(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/grab/${id}`, {credentials: 'same-origin'})
    .then(res => res.json())
    .then(json => {
      console.log('抢购成功!');
      dispatch({
        type: 'SHOW_ALERT',
        status: json.status,
        url: json.callback_url,
      });
    })
    .catch(err => {
      console.log(err);
    });
  };
}
