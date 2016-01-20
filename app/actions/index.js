import fetch from 'isomorphic-fetch';
import {API, ONE_MONEY_ID} from '../config.json';

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
        delete json.status;
        dispatch({type: 'UPDATE_ITEM_DONE', item: json, id, min: 'winners'});
      });
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

// "winner":1,
// "grab_id":"1",
// "user_id":"2",
// "user_user_id":100160,
// "item":"1",
// "one_money":"1",
// "callback_url":"http://m.wanliu.biz/orders/yiyuan_confirm?i=ai9pWTJlZk4yTUVkRzhMK2lhVTc4enhqbmF4OGZIK0xuSUo5NlVkVVVZN2lqVks2OWt5SEY2bDNyL01zYkFUNkF3ZWo3K3ZOR3p0UXJHNGRsVTVpQlR3R2ZNWUgxN1pUUndVaUxEVEFaVlprU2p4eDRFV0pyUmtiTTlSdnVFMDJjeFI4K2g5TkhhRzE0QzhJUU1BK2RPZTgxS0d2UWVIYTIvd1ltRXZOMHBFb3FYcmp6Z1UvUEZnT0toMWRvME1MWXBEWnVmYjdpdmNsaTNrcVdBQzVZazZha09GM29Ra1htelE5N0xIeWh5MDA2akNLMUpESEplRnBnRWt2SlF5NmJmWUZma25mRDIyamVCZis4M2QxOVo0eWp3cHU4aFRCYnZNNmF4NnVGa0xmbWFqZVFYQWxySlRUUmV1WUJZelN4ZzE5QktLVXNxemltMlRSMVNQVDR1MGJBY20vQWdJY1FuR290UFNwNlFXT1hBV1RsdHBpajdWbVVpV1Y0NFV5dFlQZmxmYkNUbEErTGVIOWJScmFYT3hhSktyZFJoVGp0L1kyS1RuVVZzb2xJV01FbGxLMWxzS2Evc3B1bDEzamltck5JQlRSQVgvVHQvZkhGdmJZSWJuUlR2dGRsVllEdUlBa1VXQXBmcEVTOWhidzF3eFc1ZW1aTzVnM29xQldKS041aG9udlp1aDF3SjkrTEl6Wjd1a284d2pHRzkyVVd2aXoxVUJRa29vVWNNQjVRd0FwbDZBRXFYR3lVaDlxZTkxd0gxMC9YZXZtWlAzZGhBRE5FQT09LS1EUmh5UXlNUXlTaWl5UkdsbDVWYUdBPT0%3D--8ece5ff9c4c5fb65ff8cb23431fc3ea7b479fe7e",
// "time_out":54000,
// "status":"success"

export function fetchGrab(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/grab/${id}`, {credentials: 'same-origin'})
    .then(res => res.json())
    .then(json => {
      if (json.status == 'success') {
        dispatch({
          type: 'FETCH_GRAB_DONE',
          grab: json,
          btn: '领取奖励',
          title: '抢购成功',
          url: json.callback_url,
          message: '请前往订单页面领取奖励, 有效时间15分钟!',
        });
      } else {
        dispatch({
          type: 'FETCH_GRAB_DONE',
          title: '抢购失败',
          message: '抢购失败, 请稍后再试',
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
  };
}
