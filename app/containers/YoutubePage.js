import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import classnames from 'classnames';

import { ROOT } from '../constants/Config';

import SideNav from '../components/SideNav';
import List from '../components/List';
import Notification from '../components/Notification';

import { loadYoutubeCategory } from '../actions/youtube';
import { loadCollection } from '../actions/favorite';
import { stopPropagation, getYoutubeLangName } from '../utils/functions';

function loadData(props) {
  const lang = getYoutubeLangName(props.i18n.myLang)
  props.loadYoutubeCategory({ lang });
  props.loadCollection();
}

class YoutubePageRefactor extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    loadData(this.props);
    const { socket } = this.props;
    socket.removeAllListeners('collection.change');
    socket.on('collection.change', this.handleSocketIoEvent.bind(this));
  }

  handleSocketIoEvent(msg) {
    loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.i18n.myLang !== this.props.i18n.myLang ) {
      loadData(nextProps);
    }
  }

  render() {
    const {
      children,
      errorMessage,
      mouseActions,
      toggleNotification,
      toggleView,
      i18n,
      sidenav,
      mouse,
      socket,
      fetchPlaylistInfo,
      footerState,
      } = this.props;
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
        {
          React.cloneElement(children, {
            notifyFunc: toggleNotification.bind(this),
            toggleView,
            mouse,
            toggleNotification,
            mouseActions,
            socket,
            fetchPlaylistInfo,
            errorMessage,
          })
        }
      </div>
    );
  }

  renderTabs() {
    const { cloudType } = this.props;
    if ( cloudType === 'search') {
      return this.renderSearchTabs();
    } else {
      return (
        <div className={`SideTab`}>
          {this.renderDefaultLists(this.props)}
          {this.renderUserDefinedLists(this.props)}
        </div>
      );
    }
  }

  renderSearchTabs() {
    const { location : { query }, i18n } = this.props;
    return (
      <div className={`SideTab`}>
        <Link className={`SideTab-link`} to={{ pathname: `${ROOT}/app/youtube/search`, query: { cloudType: `search`, keyword: query.keyword, searchType: 'video' } }} activeClassName={`is-current`}>
          {i18n[i18n.myLang]['youtube.select.songs']}
        </Link>
        <Link className={`SideTab-link`} to={{ pathname: `${ROOT}/app/youtube/search`, query: { cloudType: `search`, keyword: query.keyword, searchType: 'playlist' }}} activeClassName={`is-current`}>
          {i18n[i18n.myLang]['youtube.select.playlists']}
        </Link>
      </div>
    );
  }

  renderDefaultLists(props) {
    const { i18n, listsInCategory } = props;
    const defaultListClass = !this.showDefaultList ? 'ic_submenu_close' : 'ic_submenu_open';
    return (
      <div className={`SideTab-block`}>
        <div className={`SideTab-title`}>
          <div>
            <span className={`ic ic_submenu_requestbook`} />
            {i18n[i18n.myLang]['youtube.category.hot']}
          </div>
          <span className={`SideTab-menu ic ${defaultListClass}`} onClick={ () => this._toggleDefaultListsMenu() } />
        </div>
        <div className={`SideTab-list`}>
          {!this.showDefaultList ? listsInCategory.map(this.renderDefaultTabItem.bind(this)) : ''}
        </div>
      </div>
    );
  }

  renderUserDefinedLists(props) {
    const { i18n, listsInCollection, toggleView } = props;
    const userDefinedListClass = !this.showUserDefinedLists ? 'ic_submenu_close' : 'ic_submenu_open';
    const addCollectionButtonStyle = { fontSize: '14px', margin: i18n.myLang === 'en' ? '0 36px' : '0 54px' }
    return (
      <div className={`SideTab-block`}>
        <div className={`SideTab-title`}>
          <div>
            <span className={`ic ic_submenu_requestbook`} />
            {i18n[i18n.myLang]['youtube.category.cloudlink']}
          </div>
          <span className={`SideTab-menu ic ${userDefinedListClass}`} onClick={ () => this._toggleUserDefinedListsMenu() } />
        </div>
        <button
          className={`Filter-btn ic ic_controlbar_plus`}
          style={addCollectionButtonStyle}
          onClick={ (evt) => this._openAddNewFavorModal(evt) }>
          {i18n[i18n.myLang]['youtube.button.addcollection']}
        </button>
        <div className={`SideTab-list`}>
          {!this.showUserDefinedLists ? listsInCollection.map(this.renderUserDefinedTabItem.bind(this)) : ''}
        </div>
      </div>
    );
  }

  _toggleDefaultListsMenu() {
    this.showDefaultList = !this.showDefaultList;
  }

  _toggleUserDefinedListsMenu() {
    this.showUserDefinedLists = !this.showUserDefinedLists;
  }

  renderDefaultTabItem(item, index) {
    const { categoryId } = this.props;
    return (
      <Link key={index} className={`SideTab-link SideTab-link--favorite`} to={{ pathname: `${ROOT}/app/youtube/default`, query: { defaultId: item.id, name: item.name } }} activeClassName={`is-current`}>
        {item.name}
        <span className={`SideTab-total-normal`}>{ `(${item.count})`}</span>
      </Link>
    );
  }

  renderUserDefinedTabItem(item, index) {
    const { categoryId } = this.props;
    return (
      <Link key={index} className={`SideTab-link SideTab-link--favorite`} to={{ pathname: `${ROOT}/app/youtube/cloudlink`, query: { cloudlinkId: item.id, name: item.name } }} activeClassName={`is-current`}>
        {item.name}
        <span className={`SideTab-total`}>{ `(${item.count})`}</span>
        <span className="ic ic_action_remove SideTab-delete" onClick={ (evt) => this._openDeleteModal(evt, item.id, item.name) } />
      </Link>
    );
  }

  _openAddNewFavorModal(evt) {
    const { toggleView, toggleHeader } = this.props;
    stopPropagation(evt)
    toggleView('moreSettingPanel', { visible: false, view: 'more' })
    toggleHeader({ pressed: 'more', forceHidden: true });
    toggleView('slidePanel', { visible: false, view: 'search' });
    toggleView('modal', { visible: true, type: 'youtubeAddCollection'});
  }

  _openDeleteModal(evt, pvid, pvname) {
    const { toggleView, toggleHeader } = this.props;
    stopPropagation(evt);
    evt.preventDefault();
    toggleView('moreSettingPanel', { visible: false, view: 'more' })
    toggleHeader({ pressed: 'more', forceHidden: true });
    toggleView('slidePanel', { visible: false, view: 'search' });
    toggleView('modal', { visible: true, type: 'youtubeDeleteCollection', data: { pvid, pvname }})
  }
}

function mapStateToProps(state, ownProps) {
  const { cloudType } = ownProps.params;
  const {
    i18n,
    pagination: {
      youtubeCategory,
      collectionFromYoutube,
    },
    entities: {
      items,
      collectionItems,
    },
    views
  } = state;

  const categoryInfo = youtubeCategory['category'] || { ids: [] };
  const listsInCategory = categoryInfo.ids.map(id => items[id]);
  const collectionInfo = collectionFromYoutube['collection'] || { ids: [] };
  const listsInCollection = collectionInfo.ids.map( id => collectionItems[id] );

  const footerState = views['footer'];

  return {
    i18n,
    listsInCategory,
    listsInCollection,
    cloudType,
    footerState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadYoutubeCategory: bindActionCreators(loadYoutubeCategory, dispatch),
    loadCollection: bindActionCreators(loadCollection, dispatch),
  }
}

YoutubePageRefactor.contextTypes = {
  router: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(YoutubePageRefactor);
