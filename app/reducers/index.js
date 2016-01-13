import { combineReducers } from 'redux'

function list (state={}, action) {
  switch (action.type) {
    case 'test' : return [{name:'test-item'}];
    default: return state;
  }
}

function home (state={}, action) {
  switch (action.type) {
    case 'test' : return [{name:'test-item'}];
    default: return state;
  }
}

const rootReducer = combineReducers({
  home,
  list,
})

export default rootReducer