import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
// import DevTools from '../containers/DevTools';
import apiMiddleware from '../middleware/api';
import * as reducers from '../reducers';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { combineReducers } from 'redux';

export default function configureStore(history, initialState) {
  const loggerMiddleware = createLogger({
    level: 'info',
    duration: true,
    collapsed: true
  });
  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        apiMiddleware,
        loggerMiddleware,
        routerMiddleware(history)
      )
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    })
  }

  return store;
}
