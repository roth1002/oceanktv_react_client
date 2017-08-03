import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/lib/createHashHistory';
import configureStore from './store/configureStore';
import { useRouterHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './router';
import './styles/styles.styl';

const appHistory = useRouterHistory(createHistory)({
  queryKey: '_key'
});
const store = configureStore(appHistory, window.__initialState__);
const history = syncHistoryWithStore(appHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
