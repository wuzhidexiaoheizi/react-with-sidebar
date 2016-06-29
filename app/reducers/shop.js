import update from 'react-addons-update';

const initialState = {
  shops: [],
};

export default function(state = initialState, action) {
  switch (action.type) {

  case 'FETCH_SHOP_DONE': {
    const { shop } = action;
    const index = state.shops.findIndex(s => s.id == action.id);

    if (index > -1) {
      return update(state, {
        shops: {
          [index]: { $merge: shop }
        }
      });
    }

    return update(state, {
      shops: { $push: [ shop ]}
    });
  }

  default: return state;
  }
}
