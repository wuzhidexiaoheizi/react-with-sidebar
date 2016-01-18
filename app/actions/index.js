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
    dispatch({
      type: 'UPDATE_ITEM_STATUS',
      status,
      id,
    });
  };
}

export function fetchDetail(id) {
  return dispatch => {
    fetch(`${API}/${ONE_MONEY_ID}/items/${id}?u=${Date.now()}`)
      .then(res => res.json())
      .then(json => {
        dispatch({type: 'FETCH_DETAIL_DONE', item: json, id});
      });

    fetch(`${API}/${ONE_MONEY_ID}/status/${id}?winners=10`)
      .then(res => res.json())
      .then(json => {
        dispatch({type: 'FETCH_DETAIL_DONE', item: json, id});
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
