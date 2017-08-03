import React, { Component, PropTypes } from 'react';
import Cookies from 'js-cookie';

import Modal from './Modal'
import { ROOT, API_ROOT } from '../constants/Config';
import Player from './Player';
import Setting from './Setting';
import Tutorial from './Tutorial';
import FavoritesCollection from './FavoritesCollection';
import FileEdit from './FileEdit';
import InstallModal from './InstallModal';
import FavorEdit from './FavorEdit';
import Confirm from './Confirm';
import YoutubeTip from './YoutubeTip';
import FavoriteTip from './FavoriteTip';

import LOGO_IMG from '../assets/images/ktv_station_68.png';
import LOGO_QTS from '../assets/images/ic_qts_smallicon.png';
import HELP from '../assets/images/help.png';
import WARN from '../assets/images/warning.png';

function mapModalToView(state, context) {
  const { data, type, isNeedTip } = state;
  const {
    i18n,
    songLangs,
    postFileEdit,
    getFileEdit,
    toggleView,
    toggleHeader,
    fetchAudioTrack,
    fetchMenuInfo,
    playerOnOff,
    toggleNotification,
    mouse,
    notificationState,
    location,
    history
  } = this.props;

  switch (type) {
    case 'about':
      const chineseCharsets = [ 'zh-cn' ];
      return (
        <div className={`Modal-content Modal-content--about`}>
          <h2 className={`Modal-title Modal-title--about`}>
            <span className={`ic ic_info`} />
            {i18n[i18n.myLang]['modal.header.about']}
          </h2>
          <div className={`Modal-body Modal-body--about`}>
            <img src={LOGO_IMG} alt={`OceanKTV logo`} />
            <img src={require(chineseCharsets.indexOf(i18n.myLang) > -1 ? '../assets/images/logo_about_chs.png' : '../assets/images/logo_about_en.png')} alt={`OceanKTV text`} />
            <div className={`Modal-divider`} />
            <span className={`Modal-version`}>{`Version ${this.props.systemConfig ? this.props.systemConfig.info.version : ''} (${this.props.systemConfig ? this.props.systemConfig.info.date : ''})`}</span>
            <span className={`Modal-version`}>{`Revision ${this.props.systemConfig ? this.props.systemConfig.info.revision : ''}`}</span>
          </div>
          <div className={`Modal-footer Modal-footer--about`}>
            <div className={`Modal-text`}>
              <a className={`Modal-link`} href={`http://www.qnap.com/OceanKTV`} target="_blank">
                <span className={`ic ic_qnap`}></span>
                www.qnap.com/OceanKTV
              </a>
              <span className={`Modal-copyright`}>©2015-2016 QNAP Systems, Inc. All Rights Reserved.</span>
            </div>
            <img className={`Modal-img`} src={LOGO_QTS} alt={`QTS`} />
          </div>
        </div>
      );
    case 'tutorial':
      return (
        <Tutorial
          handleModalClose={this.handleModalClose}
          i18n={i18n}
          toggleView={toggleView}
          toggleHeader={toggleHeader} />
      );
    case 'setting':
      return (
        <Setting
          playerState={this.props.playerState}
          systemConfig={this.props.systemConfig}
          handleModalClose={this.handleModalClose}
          loadPlayState={this.props.loadPlayState}
          toggleView={this.props.toggleView}
          toggleHeader={toggleHeader}
          systemActions={this.props.systemActions}
          i18n={i18n}
          fetchMenuInfo={fetchMenuInfo} />
      );
    case 'player':
      return (
        <div className={`Modal-content Modal-content--player`}>
          <Player src={`${API_ROOT}/player/streaming_song/${data.songId}`} />
        </div>
      );
    case 'favorites':
      return (
        <FavoritesCollection
          data={data}
          favorActions={this.props.favorActions}
          toggleView={this.props.toggleView}
          listInFavorites={this.props.favorites}
          handleModalClose={this.handleModalClose}
          toggleNotification={toggleNotification}
          i18n={i18n}
          isNeedTip={isNeedTip} />
      );
    case 'favorEdit':
      return (
        <FavorEdit
          i18n={i18n}
          data={data}
          action={'put'}
          state={state}
          context={context}
          toggleView={toggleView}
          favorActions={this.props.favorActions}
          location={location}
          history={history} />
      );
    case 'favorAdd':
      return (
        <FavorEdit
          i18n={i18n}
          data={data}
          state={state}
          action={'post'}
          context={context}
          toggleView={toggleView}
          favorActions={this.props.favorActions}
          location={location}
          history={history} />
      );
    case 'favorDelete':
      return (
        <FavorEdit
          i18n={i18n}
          data={data}
          state={state}
          action={'delete'}
          context={context}
          toggleView={toggleView}
          favorActions={this.props.favorActions}
          location={location}
          history={history} />
      );
    case 'fileEdit':
      return (
        <FileEdit
          data={data}
          songLangs={songLangs}
          i18n={i18n}
          toggleHeader={toggleHeader}
          toggleView={toggleView}
          postFileEdit={postFileEdit}
          getFileEdit={getFileEdit}
          fetchAudioTrack={fetchAudioTrack}
          slidePanelState={this.props.slidePanelState} />
      );
    case 'appInstall':
      return <InstallModal i18n={i18n} handleModalClose={this.handleModalClose} />
    case 'tvplayerConfirm':
      return (
        <div className={`Modal-content--setting--addfolder`}>
          <h2 className={`Modal-title Modal-title--favor-edit`}>
            <img src={playerOnOff === 1 ? WARN : HELP} />
            <span>
              {playerOnOff === 1 ? i18n[i18n.myLang]['modal.tvclose.confirm.tip'] : i18n[i18n.myLang]['modal.tvopen.confirm.tip']}
            </span>
          </h2>
          <form className={`Modal-form`} onSubmit={this._handlePlayerOnOff.bind(this)}>
            <div className={`Modal-confirm`}>
              <button type="submit">
                {i18n[i18n.myLang]['modal.button.confirm']}
              </button>
              <button onClick={(evt) => this.handleModalClose(evt)}>
                {i18n[i18n.myLang]['modal.button.cancel']}
              </button>
            </div>
          </form>
        </div>
      );
    case 'playerNotOpenConfirm':
      const forceMulti = state.forceMulti;
      return (
        playerOnOff === 0 ? (
          <Confirm
            handlePlayerOnOff={this._handlePlayerOnOff.bind(this)}
            toggleNotification={toggleNotification}
            handleModalClose={this.handleModalClose}
            i18n={i18n}
            type={mouse.move || forceMulti ? 'multi' : 'single'} />
          ) : null
      );
    case 'youtubeTip':
      return (
        <YoutubeTip
          handlePlayerOnOff={this._handlePlayerOnOff.bind(this)}
          handleModalClose={this.handleModalClose}
          i18n={i18n} />
      );
    case 'favoriteTip':
      return (
        <FavoriteTip
          handlePlayerOnOff={this._handlePlayerOnOff.bind(this)}
          handleModalClose={this.handleModalClose}
          i18n={i18n} />
      );
    case 'youtubeAddCollection':
      return (
        <FavorEdit
          i18n={i18n}
          data={data}
          state={state}
          action={'postYoutube'}
          context={context}
          toggleView={toggleView}
          favorActions={this.props.favorActions}
          toggleNotification={toggleNotification}
          location={location}
          history={history} />
      );
    case 'youtubeDeleteCollection':
      return (
        <FavorEdit
          i18n={i18n}
          data={data}
          state={state}
          action={'deleteYoutube'}
          context={context}
          toggleView={toggleView}
          favorActions={this.props.favorActions}
          location={location}
          history={history} />
      );
    case 'termOfServive':
    return (
      <div className={`Modal-content`}>
        <h2 className={`Modal-title  Modal-title--term-of-service`}>
          {i18n[i18n.myLang]['more.button.terms']}
        </h2>
        <div className={`Modal-body Modal-body--term-of-service`}>
          <div className={`Modal-description Modal-description--term-of-service`}>
            <span>
              {i18n[i18n.myLang]['modal.termofservice.description01']}
            </span>
            <span>
              {i18n[i18n.myLang]['modal.termofservice.description02']}
            </span>
            <span>
              {i18n[i18n.myLang]['modal.termofservice.description03']}
            </span>
          </div>
        </div>
        <form className={`Modal-form`} onSubmit={this.handleModalClose.bind(this)}>
            <div className={`Modal-confirm`}>
              <button type="submit">
                {i18n[i18n.myLang]['modal.button.confirm']}
              </button>
            </div>
          </form>
      </div>
    );
    default:
      return null;
  }
}

export default class ModalContent extends Component {
  constructor(props) {
    super(props)

    this.handleModalClose = ::this.handleModalClose
    this.handleModalKeyUp = ::this.handleModalKeyUp
    this.state = {
      favorEditInput: ''
    }
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleModalKeyUp);
  }

  componentWillMount() {
    document.removeEventListener('keyup', this.handleModalKeyUp);
  }

  render() {
    const { state, toggleView } = this.props;
    return (
      <Modal isOpen={state.visible}>
        <button className={`Modal-close ic delete`} onClick={this.handleModalClose}></button>
        {mapModalToView.call(this, state, this.context)}
      </Modal>
    )
  }

  handleModalKeyUp(e) {
    if ( e.keyCode === 27 ) {
      this.handleModalClose(e)
    }
  }

  handleModalClose(evt, type) {
    const { state, toggleView, slidePanelState, toggleHeader } = this.props;
    toggleView('modal', { visible: false });
    if ( typeof toggleHeader === 'function') {
      toggleHeader({ pressed:false });
    }
    if (state.type === 'setting') {
      toggleView('theme', { preview: undefined });
    }
    if (slidePanelState && slidePanelState.isTriggeredByModal) {
      toggleView('slidePanel', { visible: false, view: 'help', isTriggeredByModal: false });
    }
    if (state.type === 'termOfServive') {
      const myBundleHash = document.querySelectorAll('script')[2].src.split('.').slice(-2)[0];
      if ( Cookies.get('first') !== myBundleHash) {
        Cookies.set('first', myBundleHash, { expires: 365 })
        toggleView('modal', { visible: true, type: 'tutorial' })
      }
    }
    evt.preventDefault();
  }

  _handlePlayerOnOff(evt) {
    const { playerOnOff, systemActions, toggleView } = this.props;
    evt.preventDefault();
    if ( playerOnOff === 0 ) {
      systemActions.editSystemTvLaunchState(2);
      systemActions.playerStart()
      .then( (res) => res.error ? this._handlePromiseReject(0) : null );
    } else if ( playerOnOff === 1 ) {
      systemActions.editSystemTvLaunchState(2);
      systemActions.playerShutDown()
      .then( (res) => res.error ? this._handlePromiseReject(1) : null );
    } else if ( playerOnOff === -1 ) {
      systemActions.editSystemTvLaunchState(2);
      systemActions.playerStart()
      .then( (res) => res.error ? this._handlePromiseReject(-1) : null );
    } else {
    }
    toggleView('modal', { visible: false, type: 'tvplayerConfirm' });
  }

  _handlePromiseReject(value) {
    const { systemActions, toggleNotification } = this.props;
    toggleNotification('multi');
    systemActions.editSystemTvLaunchState(value);
  }
}

ModalContent.propTypes = {
  state: PropTypes.object.isRequired,
  toggleView: PropTypes.func,
  toggleHeader: PropTypes.func,
  i18n: PropTypes.object.isRequired
}
