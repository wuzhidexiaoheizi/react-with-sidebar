import { _fetch, serializeParams } from '../helper';
import Constants from '../constants';
import { fetchCakeItem } from './cakeList';

export function fetchRankPageData(page = 1, per = 10, loadCake) {
  return (dispatch, getState) => {
    const state = getState();
    const { bless: { listFetching } } = state;

    if (listFetching) return false;

    dispatch({ type: 'FETCH_RANK_DATA_START' });

    const { DOMAIN, API_PROMOTION_PREFIX, PARTY_URL, PARTY_RANK_URL} = Constants;
    const query = serializeParams({page, per});
    const url = `${DOMAIN}${API_PROMOTION_PREFIX}${PARTY_URL}${PARTY_RANK_URL}?${query}`;

    return _fetch(url)
      .then(json => {
        const { parties } = json;

        if (loadCake) {
          parties.forEach((party) => {
            const { cake_id } = party;
            const { cakeList: { cakeItems } } = state;
            const cakeItem = cakeItems.find(item => item.id == cake_id);

            if (!cakeItem) {
              dispatch(fetchCakeItem(cake_id));
            }
          });
        }

        return dispatch({ type: 'FETCH_RANK_PAGE_DATA_DONE', parties, page });
      });
  };
}
