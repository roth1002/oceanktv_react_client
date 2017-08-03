import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import Cookies from 'js-cookie';
import 'isomorphic-fetch';
import io from 'socket.io-client';

import SPINNER_IMG from '../assets/images/spinner.svg'

import { toggleView, toggleHeader } from '../actions/views';
import { postFileEdit, getFileEdit, fetchAudioTrack, fetchMenuInfo } from '../actions/songslist'
import * as systemActions from '../actions/system';
import * as favorActions from '../actions/favorite';
import * as playerActions from '../actions/player';
import { SOCKETIO_ROOT, SOCKETIO_NAMESPACE } from '../constants/Config';
import { loadPlaylist, loadHistory, fetchPlaylistInfo } from '../actions/playlist';
import * as mouseActions from '../actions/mouse';
import * as youtubeActions from '../actions/youtube';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SlidePanel from './SlidePanel';
import MoreSettingPanel from './MoreSettings';
import Notification from '../components/Notification';
import ModalContent from '../components/ModalContent';

import { stopPropagation } from '../utils/functions'

class App extends Component {
  constructor(props) {
    super(props);
    this.handlePanelHide = this.handlePanelViisibility.bind(this, '');
    this.state = {
      footerVisiblePanel: ''
    }
    this.socket = io.connect(SOCKETIO_ROOT, { path: SOCKETIO_NAMESPACE});
  }

  componentWillMount() {
    const { systemActions, playerActions, toggleView, fetchPlaylistInfo } = this.props;
    systemActions.loadAppInfo()
    .then( (res) => Cookies.set('revision', res.response.build.revision, { expires: 365 }) );
    systemActions.loadMyTheme()
    playerActions.loadPlayState();
    fetchPlaylistInfo();
    fetch(window.location.protocol + '//130.211.5.236/version');

    if ( Cookies.get('playNeverTip') === undefined ) {
      Cookies.set('playNeverTip', 1, { expires: 365 }) // 0: 永不提示,  1: 每次提示
    }

    if ( Cookies.get('youtubeNeverTip') === undefined ) {
      Cookies.set('youtubeNeverTip', 1, { expires: 365 }) // 0: 永不提示,  1: 每次提示
    }

    if ( Cookies.get('favoriteNeverTip') === undefined ) {
      Cookies.set('favoriteNeverTip', 1, { expires: 365 }) // 0: 永不提示,  1: 每次提示
    }
  }

  handleMouseoverEvent(evt) {
    const { mouse, views, mouseActions } = this.props;
    if (mouse.move && ( views && views.modal && !views.modal.visible) ) {
      mouseActions.editMouse(evt.pageY)
    }
  }

  componentDidMount() {
    const { headerState, toggleView, location: { pathname } } = this.props;
    const myBundleHash = document.querySelectorAll('script')[2].src.split('.').slice(-2)[0];
    if ( pathname === '/app/youtube' && Cookies.get('youtubeNeverTip') === '1' ) {
      toggleView('modal', { visible: true, type: 'youtubeTip' });
    } else if ( myBundleHash.indexOf('bundle') !== -1 ) { // 開發模式
      Cookies.set('first', 0, { expires: 365 });
      toggleView('modal', { visible: true, type: 'termOfServive' });
    } else if ( Cookies.get('first') !== myBundleHash ) {
      toggleView('modal', { visible: true, type: 'termOfServive' });
    }
    this._handleSocketIO(this.props, this.socket);
    document.addEventListener('mousemove', this.handleMouseoverEvent.bind(this));
    document.addEventListener('click', this.handlePanelHide);
  }

  componentWillReceiveProps(preProps) {
    const { revision } = this.props.system.info;
    const isReversionChange = revision !== undefined && revision !== preProps.system.info.revision;
    if ( isReversionChange && revision !== Cookies.get('revision')) {
      Cookies.set('revision', revision, { expires: 365 });
      window.location.reload(true);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseoverEvent);
    document.removeEventListener('click', this.handlePanelHide);
  }

  render() {
    const {
      children,
      i18n,
      errorMessage,
      appState,
      footerState,
      slidePanelState,
      modalState,
      player,
      moreSettingPanelState,
      toggleView,
      system,
      themeState,
      toggleHeader,
      headerState,
      listInFavorites,
      songLangs,
      getFileEdit,
      postFileEdit,
      favorActions,
      systemActions,
      fetchAudioTrack,
      mouse,
      mouseActions,
      fetchMenuInfo,
      playerActions,
      sidenav,
      fetchPlaylistInfo,
      views,
      location,
      history,
      notifications
    } = this.props;

    const ClassName = themeState.preview ? classnames(`App`, `u-theme--${themeState.preview}`) : classnames(`App`, `u-theme--${system.theme}`);
    const slidePanelClassName = classnames({
      'SlidePanel': true,
      'is-visible': slidePanelState.visible,
      'is-footer-hidden': !footerState.visible
    });
    const moreSettingPanelClassName = classnames({
      'MoreSettingPanel': true,
      'is-visible': moreSettingPanelState.visible
    });

    const isInYoutubePage = [ '/app/youtube/default', '/app/youtube/cloudlink', '/app/youtube/search' ].indexOf(this.props.location.pathname) !== -1;

    return (
      <div className={ClassName}>
        <Header
          i18n={i18n}
          systemActions={systemActions}
          onShow={this.handleToggle.bind(this)}
          toggleView={toggleView}
          toggleHeader={toggleHeader}
          headerState={headerState}
          footerState={footerState}
          toggleNotification={this._toggleNotification.bind(this)}
          playerOnOff={this.props.system.playerOnOff}
          isInYoutubePage={isInYoutubePage}
          location={location}
          handleFooterPanelHide={this.handlePanelHide} />
        {
          React.cloneElement(children, {
            toggleNotification: this._toggleNotification.bind(this),
            toggleView,
            toggleHeader,
            socket: this.socket,
            mouse,
            mouseActions,
            player,
            sidenav,
            fetchPlaylistInfo,
            errorMessage,
          })
        }
        <Footer
          viewState={footerState}
          toggleNotification={this._toggleNotification.bind(this)}
          i18n={i18n}
          player={player}
          playerActions={playerActions}
          handlePanelViisibility={this.handlePanelViisibility.bind(this)}
          visiblePanel={this.state.footerVisiblePanel} />
        <MoreSettingPanel
          className={moreSettingPanelClassName}
          toggleView={toggleView}
          toggleHeader={toggleHeader}
          headerState={headerState}
          mouseActions={mouseActions} />
        <SlidePanel
          className={slidePanelClassName}
          toggleView={toggleView}
          toggleHeader={toggleHeader}
          toggleNotification={this._toggleNotification.bind(this)} />
        <ModalContent
          state={modalState}
          playerState={player}
          slidePanelState={slidePanelState}
          systemConfig={system}
          toggleView={toggleView}
          toggleHeader={toggleHeader}
          loadPlayState={playerActions.loadPlayState}
          postFileEdit={postFileEdit}
          getFileEdit={getFileEdit}
          favorites={listInFavorites}
          favorActions={favorActions}
          songLangs={songLangs}
          systemActions={systemActions}
          toggleNotification={this._toggleNotification.bind(this)}
          fetchAudioTrack={fetchAudioTrack}
          i18n={this.props.i18n}
          fetchMenuInfo={fetchMenuInfo}
          playerOnOff={this.props.system.playerOnOff}
          mouse={mouse}
          location={location}
          history={history} />
        <Notification
          i18n={i18n}
          notifications={notifications}
          notificationState={views.notification} />
        {
          appState.disabled ?
          <div className={`App-blocking`}>
            <img className={`App-spinner`} src={SPINNER_IMG} alt="Spinner" />
            <span className={`App-warning`}>系統重新啟動中...</span>
          </div> : null
        }
      </div>
    );
  }

  handleToggle(evt,value){
    const { slidePanelState,moreSettingPanelState, toggleView, mouseActions } = this.props;
    switch(value){
      case 'search':
        if (slidePanelState.view !== value) {
          toggleView('slidePanel', { visible: true, view: value });
        } else {
          toggleView('slidePanel', { visible: !slidePanelState.visible, view: value });
        }
        toggleView('moreSettingPanel', { visible: false, view: 'more' });
        toggleView('langSettingPanel', { visible: false });
        mouseActions.removeMove();
        break;
      case 'audio':
        toggleView('modal', { visible: true, type: 'setting' });
        toggleView('slidePanel', { visible: false, view: 'search' });
        toggleView('moreSettingPanel', { visible: false, view: 'more' });
        toggleView('langSettingPanel', { visible: false });
        mouseActions.removeMove();
        break;
      case 'refresh':
        window.location.reload(true);
        break;
      case 'more':
        toggleView('slidePanel', { visible: false, view: 'search' });
        toggleView('moreSettingPanel', { visible: !moreSettingPanelState.visible, view: value });
        toggleView('langSettingPanel', { visible: false });
        evt.stopPropagation();
        evt.nativeEvent.stopImmediatePropagation();
        break;
      case 'help':
        mouseActions.removeMove();
        if (slidePanelState.view !== value) {
          toggleView('slidePanel', { visible: true, view: 'help', isTriggeredByModal: false });
        } else {
          toggleView('slidePanel', { visible: !slidePanelState.visible, view: value, isTriggeredByModal: false });
        }
        toggleView('moreSettingPanel', { visible: false, view: 'more' });
        toggleView('langSettingPanel', { visible: false });
        break;
    }
  }

  renderError(errorMessage) {
    return (
      <div className={`App`}>
        <span>{errorMessage}</span>
      </div>
    );
  }

  _toggleNotification(value, timeout) {
    const { toggleView } = this.props;
    const delay = timeout ? timeout : 3000
    toggleView('notification', { visible: true, view: value, closeTime: Date.now() + 3000 });
    setTimeout(this._handleHiddenNotification.bind(this), delay);
  }

  _handleHiddenNotification() {
    const { toggleView, views } = this.props;
    if ( views.notification.closeTime <= Date.now()) {
      toggleView('notification', { visible: false });
    }
  }

  _handleSocketIO(props, socket) {

    socket.on('connect', msg => {
        socket.emit("login", {'data': {'username': 'Browser', 'by': 'connect'}});
    });

    socket.on('server.info.build', msg => {
      if ( msg && msg.data && Cookies.get('revision') !== msg.data.revision ) {
        Cookies.set('revision', msg.data.revision, { expires: 365 });
        window.location.reload(true);
      }
    });

    socket.on('player.state.state', msg => {
      props.playerActions.editPlayerState(msg.data);
    });

    socket.on('player.state.pitch', msg => {
      props.playerActions.editPitchState(msg.data);
    });

    socket.on('player.state.mute', msg => {
      props.playerActions.editMuteState(msg.data);
    });

    socket.on('player.state.echo_mode', msg => {
      props.playerActions.editEchoModeState(msg.data);
    });

    socket.on('player.state.mic', msg => {
      props.playerActions.editMicState(msg.data);
    });

    socket.on('player.state.music', msg => {
      props.playerActions.editMusicState(msg.data);
    });

    socket.on('player.state.is_singing', msg => {
      props.playerActions.editIsSingingState(msg.data);
    });

    socket.on('player.state.audiompx', msg => {
      props.playerActions.editAudioMpxState(msg.data);
    });

    socket.on('system.info.tv_launch', msg => {
      props.systemActions.editSystemTvLaunchState(msg.data);
    });

    socket.on('playlist.change', msg => {
      props.fetchPlaylistInfo();
    });

    socket.on('system.device.change', msg => {
      if ( msg.data && msg.data.action && msg.data.desc ) {
        props.systemActions.editSystemDeviceHotPlugState(msg.data);
        this._toggleNotification('multi', 5000);
      }
    });

    socket.on('system.internet.change', msg => {
      props.systemActions.editNetworkAccessState(msg.data);
    })
  }

  handlePanelViisibility(evt, value) {
    const { footerVisiblePanel } = this.state;
    if (footerVisiblePanel === value) {
      return this.setState({
        footerVisiblePanel: ''
      })
    }
    this.setState({
      footerVisiblePanel: value
    })
    if (evt) stopPropagation(evt)
  }
}

function mapStateToProps(state, ownProps) {
  const {
    pagination: { listsElse },
    entities: { lists },
    errorMessage, views, toggleHeader,
    player, system, sidetab,
    i18n, mouse, sidenav,
    notifications
  } = state;

  const appState = views['app'];
  const footerState = views['footer'];
  const slidePanelState = views['slidePanel'];
  const moreSettingPanelState = views['moreSettingPanel'];
  const modalState = views['modal'];
  const themeState = views['theme'];
  const headerState = toggleHeader;
  const favoritesInfo = listsElse['favorite'] || { ids: [] };
  const songLangs = sidetab['lang'] || []
  const listInFavorites = favoritesInfo.ids.map(id => lists[id]);

  return {
    errorMessage,
    appState,
    footerState,
    slidePanelState,
    moreSettingPanelState,
    headerState,
    modalState,
    system,
    themeState,
    listInFavorites,
    songLangs,
    i18n,
    mouse,
    player,
    sidenav,
    views,
    notifications
  };
}

function mapDispatchToProps(dispatch) {
  return {
    systemActions: bindActionCreators(systemActions, dispatch),
    favorActions: bindActionCreators(favorActions, dispatch),
    toggleView: bindActionCreators(toggleView, dispatch),
    toggleHeader: bindActionCreators(toggleHeader, dispatch),
    postFileEdit: bindActionCreators(postFileEdit, dispatch),
    getFileEdit: bindActionCreators(getFileEdit, dispatch),
    playerActions: bindActionCreators(playerActions, dispatch),
    fetchAudioTrack: bindActionCreators(fetchAudioTrack, dispatch),
    loadPlaylist: bindActionCreators(loadPlaylist, dispatch),
    loadHistory: bindActionCreators(loadHistory, dispatch),
    mouseActions: bindActionCreators(mouseActions, dispatch),
    fetchMenuInfo: bindActionCreators(fetchMenuInfo, dispatch),
    fetchPlaylistInfo: bindActionCreators(fetchPlaylistInfo, dispatch),
    youtubeActions: bindActionCreators(youtubeActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
