import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import apiMiddleware from '../middleware/api';
import * as reducers from '../reducers';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { combineReducers } from 'redux';

export default function configureStore(history, initialState) {
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
        routerMiddleware(history)
      )
    )
  );
  return store;
}
