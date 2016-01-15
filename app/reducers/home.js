
export default function(state = {}, action) {
  switch (action.type) {
  case 'FETCH_DETAIL_DONE':
    return {
      fetched: true,
      name: 'test',
    };
  default: return state;
  }
}
