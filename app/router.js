import React from 'react';
import { Router, Route, IndexRoute, Redirect } from 'react-router';
import Cookies from 'js-cookie';

import { ROOT, HOSTURL } from './constants/Config';

import App from './containers/App';
import Landing from './containers/Landing'
import HomePage from './containers/HomePage';
import SongbookPage from './containers/SongbookPage';
import FavoritePage from './containers/FavoritePage';
import PlaylistPage from './containers/PlaylistPage';
import HistoryPage from './containers/HistoryPage';
import SongbookContent from './containers/SongbookContent';
import YoutubePage from './containers/YoutubePage';
import YoutubeContent from './containers/YoutubeContent';

function redirectToQtsLogin() {
  const NAS_SID = Cookies.get('NAS_SID');
  if ( process.env.NODE_ENV === 'production' && !NAS_SID ) {
    window.location.href = HOSTURL;
  }
}

export default (
  <Route onEnter={redirectToQtsLogin} onChange={redirectToQtsLogin}>
    <Route path={`${ROOT}/`} component={Landing} />
    <Route path={`${ROOT}/app`} component={App}>
      <IndexRoute component={HomePage}></IndexRoute>
      <Redirect from={`songbook`} to={`songbook/folders`} query={{ rt: 'OceanKTV', path: 'OceanKTV' }} />
      <Redirect from={`youtube`} to={`youtube/default`} />
      <Route path={`songbook`} component={SongbookPage}>
        <Route path={`:songbookType`} component={SongbookContent} />
      </Route>
      <Route path={`favorite`} component={FavoritePage} />
      <Route path={`playlist`} component={PlaylistPage} />
      <Route path={`history`} component={HistoryPage} />
      <Route path={`youtube`} component={YoutubePage}>
        <Route path={`:cloudType`} component={YoutubeContent} />
      </Route>
    </Route>
  </Route>
);
