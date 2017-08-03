import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';

import { ROOT } from '../constants/Config';

import SideNav from '../components/SideNav';
import List from '../components/List';
import Notification from '../components/Notification';

import { loadArtistTypes, loadLangs, fetchMenuInfo } from '../actions/songslist';
import { loadListFromFavorite } from '../actions/favorite';

function loadData(props) {
  props.fetchMenuInfo();
  props.loadListFromFavorite();
}

class SongbookPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    loadData(this.props);
  }

  render() {
    const {
      children,
      listsInFavorite,
      footerState,
      toggleNotification,
      toggleView,
      mouse,
      mouseActions,
      i18n,
      sidenav,
      socket,
      fetchPlaylistInfo } = this.props;
    const ClassName = classnames({
      'Page': true,
      'Page--songbook': true,
      'is-footer-hidden': !footerState.visible
    });
    return (
      <div className={ClassName}>
        <SideNav
          toggleNotification={toggleNotification}
          i18n={i18n}
          sidenav={sidenav} />
        {this.renderTabs()}
        {React.cloneElement(children, { notifyFunc: toggleNotification.bind(this), toggleView, mouse, mouseActions, socket, fetchPlaylistInfo })}
      </div>
    );
  }

  renderTabs() {
    return (
      <div className={`SideTab`}>
        {this.renderSongsByFolders(this.props)}
        {this.renderArtistTypes(this.props)}
        {this.renderLangs(this.props)}
      </div>
    )
  }

  renderArtistTypes(props) {
    const { i18n, sidetabInfo } = props;
    const artistsListClass = !this.showArtists ? 'ic_submenu_close' : 'ic_submenu_open';
    return (
      <div className={`SideTab-block`}>
        <div className={`SideTab-title`}>
          <div>
            <span className={`ic ic_submenu_requestbook`} />
            {i18n[i18n.myLang]['sidetab.menu.artists']}
          </div>
          <span className={`SideTab-menu ic ${artistsListClass}`} onClick={ () => this._toggleArtistsMenu() } />
        </div>
        <div className={`SideTab-list`}>
          {!this.showArtists ? sidetabInfo.artist.map(this.renderArtistType.bind(this)) : ''}
        </div>
      </div>
    );
  }

  renderArtistType(item, index) {
    return (
      <Link key={index} className={`SideTab-link SideTab-link--songbook`} to={{ pathname: `${ROOT}/app/songbook/artists`, query: { artistType: item.name } }} activeClassName={`is-current`}>
        {mapToI18n(item.name, this.props.i18n)}
        <span className={`SideTab-total-normal`}>{ `(${item.count})`}</span>
      </Link>
    )
  }

  renderLangs(props) {
    const { i18n, sidetabInfo } = props;
    const languagesListClass = !this.showLanguages ? 'ic_submenu_close' : 'ic_submenu_open';
    return (
      <div className={`SideTab-block`}>
        <div className={`SideTab-title`}>
          <div>
            <span className={`ic ic_submenu_requestbook`} />
            {i18n[i18n.myLang]['sidetab.menu.langs']}
          </div>
          <span className={`SideTab-menu ic ${languagesListClass}`} onClick={ () => this._toggleLanguageMenu() } />
        </div>
        <div className={`SideTab-list`}>
          {!this.showLanguages ? sidetabInfo.lang.map(this.renderLang.bind(this)) : ''}
        </div>
      </div>
    );
  }

  renderLang(item, index) {
    return (
      <Link key={index} className={`SideTab-link SideTab-link--songbook`} to={{ pathname: `${ROOT}/app/songbook/songs`, query: { lang: item.name } }} activeClassName={`is-current`}>
        {mapToI18n(item.name, this.props.i18n)}
        <span className={`SideTab-total-normal`}>{ `(${item.count})`}</span>
      </Link>
    );
  }

  renderSongsByFolders(props){
    const allSongsListClass = !this.showAllSongs ? 'ic_submenu_close' : 'ic_submenu_open';
    const { i18n, sidetabInfo } = this.props;
    return (
      <div className={`SideTab-block`}>
        <div className={`SideTab-title`}>
          <div>
            <span className={`ic ic_submenu_requestbook`} />
            {i18n[i18n.myLang]['sidetab.menu.allsongs']}
          </div>
          <span className={`SideTab-menu ic ${allSongsListClass}`} onClick={ () => this._toggleAllsongsMenu() } />
        </div>
        <div className={`SideTab-list`}>
          {!this.showAllSongs ? sidetabInfo.folder.map(this.renderSongsByFolder.bind(this)) : ''}
        </div>
      </div>
    );
  }

  renderSongsByFolder(item, index) {
    return (
      <Link key={index} className={`SideTab-link SideTab-link--songbook`} to={{ pathname: `${ROOT}/app/songbook/folders`, query: { rt: item.name } }} activeClassName={`is-current`}>
        {item.name}
        <span className={`SideTab-total-normal`}>{ `(${item.count})`}</span>
      </Link>
    );
  }

  _toggleArtistsMenu() {
    this.showArtists = !this.showArtists;
  }

  _toggleLanguageMenu() {
    this.showLanguages = !this.showLanguages;
  }
  _toggleAllsongsMenu(){
    this.showAllSongs = !this.showAllSongs;
  }
}

function mapStateToProps(state, ownProps) {
  const {
    pagination: { listsElse },
    entities: { lists },
    views
  } = state;

  const favoriteInfo = listsElse['favorite'] || { ids: [] };
  const listsInFavorite = favoriteInfo.ids.map(id => lists[id]);
  const footerState = views['footer'];

  return {
    listsInFavorite,
    footerState,
    i18n: state.i18n,
    sidetabInfo: state.sidetab
  };
}

function mapToI18n(name, i18n) {
  return i18n[i18n.myLang]['sidetab.submenu.' + name.toLowerCase()]
}

SongbookPage.contextTypes = {
  router: React.PropTypes.object
};

export default connect(mapStateToProps, { loadArtistTypes, loadLangs, loadListFromFavorite, fetchMenuInfo })(SongbookPage);
