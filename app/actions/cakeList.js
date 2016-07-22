import { _fetch } from '../helper';
import Constants from '../constants';

export function setCakeItems(json) {
  return dispatch => {
    dispatch({ type: 'FETCH_PAGE_DATA_DONE', result: json });
  };
}

export function setCakeItemSaleCount(id, saleCount) {
  return dispatch => {
    dispatch({ type: 'FETCH_CAKE_ITEM_SALED_COUNT_DONE', id, saleCount });
  };
}

export function setCakeItem(id, cakeItem) {
  return dispatch => {
    dispatch({ type: 'FETCH_CAKE_ITEM_DONE', id, cakeItem });
  };
}

export function setShop(shop) {
  return dispatch => {
    const { id } = shop;
    dispatch({ type: 'FETCH_SHOP_DONE', id, shop });
  };
}

export function fetchCakeList(page = 1, per = 10) {
  return (dispatch, getState) => {
    const state = getState();
    const { cakeList: { loadedPage, listFetching } } = state;

    if (listFetching || page < loadedPage) return false;

    dispatch({ type: 'FETCH_CAKE_PAGE_DATA_START' });

    const { DOMAIN, API_PROMOTION_PREFIX, CAKE_URL } = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${CAKE_URL}?page=${page}&per=${per}`;

    return _fetch(url, 'get')
      .then(json => {
        dispatch(setCakeItems(json));
      });
  };
}

export function fetchCakeItemSaledCount(id) {
  return dispatch => {
    const { DOMAIN, CAKE_ITEM_URL, SALE_COUNT_URL } = Constants;
    const path = CAKE_ITEM_URL.replace(/%id%/, id);
    const url = `${DOMAIN}${path}${SALE_COUNT_URL}`;

    return _fetch(url)
      .then(json => {
        dispatch(setCakeItemSaleCount(id, json));
      });
  };
}

export function fetchShop(id) {
  return dispatch => {
    const { DOMAIN, SHOP_URL } = Constants;
    const url = `${DOMAIN}${SHOP_URL}/${id}`;

    return _fetch(url)
      .then(json => {
        dispatch(setShop(json));
      });
  };
}

export function fetchCakeItem(id, callback) {
  return dispatch => {
    const { DOMAIN, API_PROMOTION_PREFIX, CAKE_URL } = Constants;
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${CAKE_URL}/${id}`;

    return _fetch(url)
      .then(json => {
        const { title } = json;
        if (typeof callback == 'function') callback(title);

        dispatch(setCakeItem(id, json));

        const { item_id, shop_id } = json;

        dispatch(fetchCakeItemSaledCount(item_id));
        dispatch(fetchShop(shop_id));
      });
  };
}
