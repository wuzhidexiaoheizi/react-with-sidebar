const initialState = {
  fetching: true,
  index: -1,
};

export default function(state = initialState, action) {
  switch (action.type) {
  case 'CHANGE_DETAIL_DATA':
    return {
      fetching: false,
      index: action.index,
    };

  case 'CLEAN_DETAIL_DATA':
    return initialState;

  default: return state;
  }
}
