import {_fetch} from '../helper';

export function fetchList() {
  return (dispatch, getState) => {
    if (getState().list.listFetched) return;

    setTimeout(() => {
      _fetch(`${__API__}/${__ONE_MONEY_ID__}/items?u=${Date.now()}`)
      .then(json => {
        dispatch({
          type: 'FETCH_LIST_DONE',
          items: json.items,
          td: json.td || 0,
        });
      });
    }, 300);
  };
}

export function updateItemStatus(id, status) {
  return dispatch => {
    dispatch({type: 'UPDATE_ITEM_DONE', item: {status}, id, tag: 'updateItemStatus'});
  };
}

export function fetchWinners(id) {
  return dispatch => {
    _fetch(`${__API__}/${__ONE_MONEY_ID__}/status/${id}?winners=${__WINNERS_NUM__}`)
    .then(json => {
      delete json.status;
      dispatch({type: 'UPDATE_ITEM_DONE', item: json, id, tag: 'fetchWinners'});
    });
  };
}

export function fetchCallback(id) {
  return dispatch => {
    _fetch(`${__API__}/${__ONE_MONEY_ID__}/callback/${id}_&${Date.now()}`)
    .then(json => {
      dispatch({type: 'FETCH_CALLBACK_DONE', item: json, id, tag: 'fetchCallback'});
    }).catch(err => {
      console.log('callback error:', err);
      if (err.message == 401) return dispatch({type: 'NOT_SIGN_UP'});
    });
  };
}

export function fetchDetail(id) {
  return dispatch => {
    _fetch(`${__API__}/${__ONE_MONEY_ID__}/items/${id}?u=${Date.now()}`)
    .then(json => {
      dispatch({type: 'UPDATE_ITEM_DONE', item: json, id, tag: 'fetchDetail'});
    });
    dispatch(fetchWinners(id));
    dispatch(fetchCallback(id));
  };
}

export function fetchGrab(id) {
  return dispatch => {
    _fetch(`${__API__}/${__ONE_MONEY_ID__}/grab/${id}`, 'put')
    .then(json => {
      if (json.status == 'success') {
        json.status = 'pending';
        dispatch({type: 'FETCH_GRAB_SUCCESS', id, grab: json, url: json.callback_url});
      } else {
        dispatch({type: 'FETCH_GRAB_FAILED', status: json.status});
        dispatch(fetchCallback(id));
      }
    })
    .catch(err => {
      console.log('callback error:', err);
      if (err.message == 401) {
        return dispatch({type: 'NOT_SIGN_UP'});
      }
    });
  };
}
