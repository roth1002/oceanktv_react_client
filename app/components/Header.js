import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import screenfull from 'screenfull';

import SearchForm from '../components/SearchForm';

import LOGO_QTS from '../assets/images/ic_qts_smallicon.png';
import PLAYER_ON from '../assets/images/switch_on.png';
import PLAYER_OFF from '../assets/images/switch_off.png';
import PLAYER_LOADING from '../assets/images/switch_loading.gif'

import * as systemActions from '../actions/system';
import { stopPropagation } from '../utils/functions';
import { ROOT } from '../constants/Config';

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleBodyClick = ::this.handleBodyClick
    this.handleFullscreenChanged = ::this.handleFullscreenChanged
    this.state = {
      isFullscreen: false
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleBodyClick)
    if (screenfull.raw) {
      document.addEventListener(screenfull.raw.fullscreenchange, this.handleFullscreenChanged);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick)
    if (screenfull.raw) {
      document.removeEventListener(screenfull.raw.fullscreenchange, this.handleFullscreenChanged);
    }
  }

  render() {
    const { isFullscreen } = this.state;
    const { footerState, headerState, i18n, playerOnOff, isInYoutubePage } = this.props;
    const fullscreenClassName = classnames({
      'Header-btn': true,
      'ic': true,
      'enlarge': !isFullscreen,
      'shrink': isFullscreen
    });

    const footerControlClassName = classnames({
      'Header-btn Header-btn--control': true,
      'is-on': footerState.visible
    });

    const goToLandingClassName = classnames('Header-btn--golanding');
    const chineseCharsets = [ 'zh-cn' ];
    const i18nHeaderLogoImageClass = chineseCharsets.indexOf(i18n.myLang) > -1 ? 'zh-tw' : 'en';
    let tvPlayerIconImageSrc;
    if ( playerOnOff === 0 ) {
      tvPlayerIconImageSrc = PLAYER_OFF;
    } else if ( playerOnOff === 1 ) {
      tvPlayerIconImageSrc = PLAYER_ON;
    } else if ( playerOnOff === 2 ) {
      tvPlayerIconImageSrc = PLAYER_LOADING;
    } else if ( playerOnOff === -1 ) {
      tvPlayerIconImageSrc = PLAYER_OFF;
    }
    return (
      <header className={`Header`} onClick={ (e) => { stopPropagation(e); this.props.handleFooterPanelHide() } }>
        <div className={`Header-left`}>
          <Link className={`Header-logo ${i18nHeaderLogoImageClass}`} to={{ pathname: `/` }} onClick={this._handleGoLanding.bind(this)} />
          { isInYoutubePage ?
            <div className={`Header-logo Header-logo--youtube`}></div>
            : null
          }
          { isInYoutubePage ? (
            <SearchForm
              formClass={`Header-left--youtube-search-form`}
              options={[
                {
                  label: i18n[i18n.myLang]['slidepanel.select.songs'],
                  value: 'video'
                },
                {
                  label: i18n[i18n.myLang]['youtube.select.lists'],
                  value: 'playlist'
                },
              ]}
              onSubmit={this.handleSearch.bind(this)}
              i18n={i18n}
              searchButtonClassName={`SearchForm-submit SearchForm-submit--header`}
              noTip={true}
              inputPlaceHolder={i18n[i18n.myLang]['youtube.search.input.placeholder']}
              selectClass={`Select-control--header`} >
            </SearchForm>)
            : null
          }
        </div>
        <div className={`Header-right`}>
          { isInYoutubePage ? null : this.renderSearch()}
          <div className={`Header-group`}>
            {this.renderAudioSetting()}
            {this.renderRefresh()}
            {this.renderHelp()}
            <button className={fullscreenClassName} onClick={this.handleFullscrenn.bind(this)} />
          </div>
          <div className={`Header-divider`} />
          {this.renderMore()}
          <div className={`Header-divider`} />
          <div to={`/`} className={goToLandingClassName}>
            <img src={tvPlayerIconImageSrc} onClick={this._handlePlayerOnOff.bind(this)} />
          </div>
          <div className={`Header-divider`} />
          <button className={footerControlClassName} onClick={this.handleHideFooter.bind(this)} />
        </div>
      </header>
    );
  }
  renderSearch(){
    const { headerState } = this.props;
    const isBtnActive = headerState.pressed === 'search' && headerState.visible ? 'is-active' : '';
    return (
      <button className={`Header-btn ic ic_topbar_Search_normal ${isBtnActive}`}
              onClick={this.handleToggle.bind(this,'search')} />
    );
  }
  renderAudioSetting() {
    const { headerState } = this.props
    const isBtnActive = headerState.pressed === 'audio' && headerState.visible ? 'is-active' : ''
    return (
      <button
        className={`Header-btn ic ic_settings_multizone ${isBtnActive}`}
        onClick={this.handleToggle.bind(this, 'audio')} />
    )
  }
  renderRefresh(){
    const { headerState } = this.props;
    const isBtnActive = headerState.pressed === 'refresh' && headerState.visible ? 'is-active' : '';
    return (
      <button
        className={`Header-btn ic ic_topbar_refresh ${isBtnActive}`}
        onClick={this.handleToggle.bind(this,'refresh')} />
    );
  }
  renderMore(){
    const { headerState } = this.props;
    const isBtnActive = headerState.pressed === 'more' && headerState.visible ? 'is-active' : '';
    return (
      <button
        className={`Header-btn Header-btn--more ic ic_topbar_More ${isBtnActive}`}
        onClick={this.handleToggle.bind(this,'more')} />
    );
  }
  renderHelp() {
    const { headerState } = this.props;
    const isBtnActive = headerState.pressed === 'help' && headerState.visible ? 'is-active' : '';
    return (
      <button
        className={`Header-btn Header-btn--help ic ic_topbar_help ${isBtnActive}`}
        onClick={this.handleToggle.bind(this,'help')} />
    );
  }

  handleBodyClick(e) {
    const { toggleView, toggleHeader } = this.props;
    toggleView('moreSettingPanel', { visible: false, view: 'more' });
    toggleView('langSettingPanel', { visible: false });
    toggleHeader({ pressed: 'more', forceHidden: true });
  }

  handleToggle(value, evt) {
    const { toggleHeader, onShow } = this.props;
    toggleHeader({pressed:value});
    // stopPropagation(evt)
    return this.props.onShow(evt,value);
  }

  handleHideFooter(evt) {
    const { toggleView, footerState } = this.props;
    const { visible } = footerState;
    toggleView('footer', { visible: !visible });
  }

  handleFullscrenn(evt) {
    const fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
    const { isFullscreen } = this.state;
    const { systemActions, toggleNotification } = this.props;

    if ( !screenfull.raw || !screenfull.enabled) {
      return systemActions.fullscreenFailue() && toggleNotification();
    }

    if (isFullscreen) {
      screenfull.exit();
      this.setState({
        isFullscreen: false
      });
    } else {
      screenfull.request();
      this.setState({
        isFullscreen: true
      });
    }
  }

  _handlePlayerOnOff() {
    const { toggleView, toggleHeader, playerOnOff } = this.props;
    if ( playerOnOff === 1 || playerOnOff === -1 || playerOnOff === 0 ) {
      toggleView('modal', { visible: true, type: 'tvplayerConfirm' });
      toggleView('moreSettingPanel', { visible: false, view: 'more' })
      toggleHeader({ pressed: 'more', forceHidden: true });
      toggleView('slidePanel', { visible: false, view: 'search' });
    }
  }

  handleFullscreenChanged() {
    this.setState({
      isFullscreen: screenfull.isFullscreen
    });
  }

  _handleGoLanding(evt) {
    const { toggleView, toggleHeader } = this.props;
    toggleView('slidePanel', { visible: false, view: 'search' });
    toggleView('moreSettingPanel', { visible: false, view: 'more' });
    toggleHeader({ pressed: 'more', forceHidden: true });
  }

  handleSearch(evt, input) {
    const { text, select } = input;
    if (text.length === 0) {
      return ;
    }
    this.context.router.push(encodeURI(`${ROOT}/app/youtube/search?cloudType=search&keyword=${text}&searchType=${select}`));
  }
}

Header.contextTypes = {
  router: React.PropTypes.object
}

export default Header;
