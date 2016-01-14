import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from '../reducers';
import DevTools from '../pages/DevTools';

const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunk, createLogger()),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
