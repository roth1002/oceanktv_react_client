import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import classnames from 'classnames';

import { stopPropagation } from '../utils/functions'

export default class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { viewState } = this.props;
    const ClassName = classnames({
      'Footer': true,
      'is-visible': viewState.visible
    });

    return (
      <div>
        <footer className={ClassName}>
          {this.renderStop()}
          {this.renderPlayPause()}
          {this.renderNext()}
          {/*this.renderRoutineRepeat()*/}
          {this.renderRepeat()}
          {this.renderGuide()}
          {this.renderEffect()}
          {this.renderAllMute()}
          {this.renderMicEcho()}
          {this.renderPitch()}
          {this.renderMicVolume()}
          {this.renderMusicVolume()}
        </footer>
      </div>
    );
  }

  renderPlayPause() {
    const { i18n, player, playerActions, toggleNotification, handlePanelViisibility } = this.props;
    const iconClassName = classnames('ic',{
      'ic_controlbar_play': player.playState !== 'PLAYING',
      'ic_controlbar_pause': player.playState === 'PLAYING'
    });
    const context = player.playState === 'PLAYING' ? i18n[i18n.myLang]['footer.button.pause'] : i18n[i18n.myLang]['footer.button.play']
    return (
      <div className={`Footer-btn`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.playpause(player.playState).then( toggleNotification('control') ) }}>
        <span className={iconClassName} />
        <span>
          {context}
        </span>
      </div>
    );
  }

  renderStop() {
    const { i18n } = this.props
    return (
      <div className={`Footer-btn Footer-btn-withStop`} onClick={this.handleStopClick.bind(this)}>
        <span className={`ic ic_menu_back Footer-btn--stop `} />
        <span>
          {i18n[i18n.myLang]['footer.button.stop']}
        </span>
      </div>
    )
  }

  handleStopClick(evt) {
    const { playerActions, toggleNotification, handlePanelViisibility } = this.props;
    stopPropagation(evt);
    handlePanelViisibility(evt, '');
    playerActions.stopPlayer().then( toggleNotification('control') )
  }

  renderNext() {
    const { i18n, playerActions, toggleNotification, handlePanelViisibility } = this.props;
    return (
      <div className={`Footer-btn`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.next().then( toggleNotification('control') ) }}>
        <span className={`ic ic_controlbar_stop`} />
        <span>
          {i18n[i18n.myLang]['footer.button.next']}
        </span>
      </div>
    );
  }

  renderRepeat() {
    const { i18n, playerActions, toggleNotification, handlePanelViisibility } = this.props;
    return (
      <div className={`Footer-btn`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.repeat().then( toggleNotification('control') ) }}>
        <span className={`ic ic_controlbar_repeat`} />
        <span>
          {i18n[i18n.myLang]['footer.button.replay']}
        </span>
      </div>
    );
  }

  renderGuide() {
    const { i18n, player, playerActions, toggleNotification, handlePanelViisibility } = this.props;
    let ClassName = classnames('Footer-btn');
    return (
      <div className={ClassName} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); this.props.playerActions.guide(player.guideState && player.guideState.toLowerCase() === 'vocal_music').then( toggleNotification('control') ) }}>
        <span className={`ic ic_controlbar_guide`} />
        <span className={`btn-name`}>
          {i18n[i18n.myLang]['footer.button.guide']}
        </span>
      </div>
    );
  }

  renderEffect() {
    const { player, i18n, playerActions, toggleNotification, handlePanelViisibility, visiblePanel } = this.props;
    const isPanelVisible = visiblePanel === 'effect' ? 'is-visible' : '';
    const isBtnActive = visiblePanel === 'effect' ? 'is-active' : '';
    const btnClassName = classnames('Footer-btn', {
      'is-active': visiblePanel === 'effect'
    })
    return (
      <div className={btnClassName} onClick={(evt) => handlePanelViisibility(evt, 'effect')} >
        <span className={`ic ic_controlbar_effect`} />
        <span className={`btn-name`}>
          {i18n[i18n.myLang]['footer.button.effect']}
        </span>
        <div className={`Footer-panel Footer-panel--effect ${isPanelVisible}`}>
          <button className={`ic ic_control_applause`} onClick={ (evt) => { stopPropagation(evt); playerActions.effect('applause').then( toggleNotification('control') ) }}></button>
          <button className={`ic btn_control_boo`} onClick={ (evt) => { stopPropagation(evt); playerActions.effect('boo').then( toggleNotification('control') ) }}></button>
        </div>
      </div>
    );
  }

  renderPitch() {
    const { player, i18n, playerActions, toggleNotification, viewState, visiblePanel, handlePanelViisibility } = this.props;
    const isPanelVisible = visiblePanel === 'pitch' ? 'is-visible' : '';
    let pitchValueContent;
    if (player.pitchValue > 0) {
      pitchValueContent = '♯' + player.pitchValue;
    } else if ( player.pitchValue < 0 ) {
      pitchValueContent = '♭' + player.pitchValue * -1;
    } else {
      pitchValueContent = i18n[i18n.myLang]['footer.header.pitch.origin'];
    }

    const btnClassName = classnames('Footer-btn-withPanel', {
      'is-active': visiblePanel === 'pitch'
    })
    return (
      <div className={btnClassName} >
        <span className={`Footer-header-context`}>{pitchValueContent}</span>
        <div className={`Footer-icon`}>
          <span className={`Footer-icon--pitch ic ic_controlbar_decrease`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.pitchDown().then( toggleNotification('control') ) }} />
          <span className={`ic ic_controlbar_key`} />
          <span className={`Footer-icon--pitch ic ic_controlbar_plus`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.pitchUp().then( toggleNotification('control') ) }} />
        </div>
        <span>
          {i18n[i18n.myLang]['footer.button.key']}
        </span>
        {/*<div className={`Footer-panel ${isPanelVisible}`}>
          <button className={`ic ic_controlbar_decrease`} onClick={ (event) => this.props.playerActions.pitchDown(event).then( this.props.toggleNotification ) } />
          <button className={`ic ic_controlbar_plus`} onClick={ (event) => this.props.playerActions.pitchUp(event).then( this.props.toggleNotification ) } />
        </div>*/}
      </div>
    );
  }

  renderMicEcho() {
    const { player, i18n, playerActions, toggleNotification, visiblePanel, handlePanelViisibility } = this.props;
    const isPanelVisible = visiblePanel === 'echo' ? 'is-visible' : '';
    const isBtnActive = visiblePanel === 'echo' ? 'is-active' : '';
    const btnClassName = classnames('Footer-btn-withPanel', {
      'is-active': visiblePanel === 'echo'
    })
    return (
      <div className={btnClassName} >
        <span className={`Footer-header-context`}>{player.echoMode ? i18n[i18n.myLang]['footer.header.echo.' + player.echoMode.toLowerCase()] : ''}</span>
        <div className={`Footer-icon`}>
          <span className={`Footer-icon--echo ic ic_controlbar_echo_s ${ player.echoMode === 'SHORT' ? 'is-active' : '' }`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.echo('short').then( toggleNotification('control') ) }} />
          <span className={`Footer-icon--echo ic ic_controlbar_echo_m ${ player.echoMode === 'MIDDLE' ? 'is-active' : '' }`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.echo('middle').then( toggleNotification('control') ) }} />
          <span className={`Footer-icon--echo ic ic_controlbar_echo_l ${ player.echoMode === 'LONG' ? 'is-active' : '' }`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.echo('long').then( toggleNotification('control') ) }} />
        </div>
        <span>
          {i18n[i18n.myLang]['footer.button.echo']}
        </span>
        {/*<div className={`Footer-panel ${isPanelVisible}`}>
          <button className={`ic ic_controlbar_echo_s ${ player.echoMode === 'SHORT' ? 'is-active' : '' }`} onClick={ (event) => this.props.playerActions.echo(event, 'short').then( this.props.toggleNotification ) } />
          <button className={`ic ic_controlbar_echo_m ${ player.echoMode === 'MIDDLE' ? 'is-active' : '' }`} onClick={ (event) => this.props.playerActions.echo(event, 'middle').then( this.props.toggleNotification ) } />
          <button className={`ic ic_controlbar_echo_l ${ player.echoMode === 'LONG' ? 'is-active' : '' }`} onClick={ (event) => this.props.playerActions.echo(event, 'long').then( this.props.toggleNotification ) } />
        </div>*/}
      </div>
    );
  }

  renderMicVolume() {
    const { i18n, player, playerActions, toggleNotification, visiblePanel, handlePanelViisibility } = this.props;
    const isPanelVisible = visiblePanel === 'micv' ? 'is-visible' : '';
    const isBtnActive = visiblePanel === 'micv' ? 'is-active' : '';
    const btnClassName = classnames('Footer-btn-withPanel', {
      'is-active': visiblePanel === 'micv'
    })
    return (
      <div className={btnClassName} >
        <span className={`Footer-header-context`}>{`${player.micVolume}${isNaN(parseInt(player.micVolume)) ? '' : '%'}`}</span>
        <div className={`Footer-icon ${isPanelVisible}`}>
          <span className={`Footer-icon--mic ic ic_controlbar_decrease`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.micVolumeDown().then( toggleNotification('control') ) }} />
          <span className={`ic ic_controlbar_micvolume`} />
          <span className={`Footer-icon--mic ic ic_controlbar_plus`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.micVolumeUp().then( toggleNotification('control') ) }} />
        </div>
        <span>
          {i18n[i18n.myLang]['footer.button.micVolume']}
        </span>
        {/*<div className={`Footer-panel ${isPanelVisible}`}>
          <button className={`ic ic_controlbar_decrease`} onClick={ (event) => this.props.playerActions.micVolumeDown(event).then( this.props.toggleNotification ) } />
          <button className={`ic ic_controlbar_plus`} onClick={ (event) => this.props.playerActions.micVolumeUp(event).then( this.props.toggleNotification ) } />
        </div>*/}
      </div>
    );
  }

  renderMusicVolume() {
    const { i18n, player, playerActions, toggleNotification, visiblePanel, handlePanelViisibility } = this.props;
    const isPanelVisible = visiblePanel === 'music' ? 'is-visible' : '';
    const isBtnActive = visiblePanel === 'music' ? 'is-active' : '';
    const btnClassName = classnames('Footer-btn-withPanel Footer-btn-withPanel--music', {
      'is-active': visiblePanel === 'music'
    })
    return (
      <div className={btnClassName}>
         <span className={`Footer-header-context`}>{`${player.musicVolume}${isNaN(parseInt(player.musicVolume)) ? '' : '%'}`}</span>
        <div className={`Footer-icon ${isPanelVisible}`}>
          <span className={`Footer-icon--music ic ic_controlbar_decrease`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.musicVolumeDown().then( toggleNotification('control') ) }} />
          <span className={`ic ic_controlbar_musicvolume`} />
          <span className={`Footer-icon--music ic ic_controlbar_plus`} onClick={ (evt) => { stopPropagation(evt); handlePanelViisibility(evt, ''); playerActions.musicVolumeUp().then( toggleNotification('control') ) }} />
        </div>
        <span>
          {i18n[i18n.myLang]['footer.button.musicVolume']}
        </span>
        {/*<div className={`Footer-panel ${isPanelVisible}`}>
          <button className={`ic ic_controlbar_decrease`} onClick={ (event) => this.props.playerActions.musicVolumeDown(event).then( this.props.toggleNotification ) } />
          <button className={`ic ic_controlbar_plus`} onClick={ (event) => this.props.playerActions.musicVolumeUp(event).then( this.props.toggleNotification ) } />
        </div>*/}
      </div>
    );
  }

  renderAllMute() {
    const { player, i18n, playerActions, toggleNotification, handlePanelViisibility } = this.props
    let ClassName = classnames('Footer-btn', {
      'is-mute' : player.mute
    });

    return (
      <div className={ClassName} onClick={ e => { stopPropagation(e); handlePanelViisibility(e, ''); playerActions.musicMute(player.mute).then( toggleNotification('control') ) }}>
        <span className={`ic ic_controlbar_mutes`} />
        <span>
          {i18n[i18n.myLang]['footer.button.allMute']}
        </span>
      </div>
    )
  }
  /*
  renderRoutineRepeat() {
    const { player, i18n, playerActions, toggleNotification } = this.props
    let ClassName = classnames('Footer-btn');

    return (
      <div className={ClassName} onClick={ e => { stopPropagation(e) }}>
        <span className={`ic ic_controlbar_repeat1`} />
        <span>
          {i18n[i18n.myLang]['footer.button.routine']}
        </span>
      </div>
    )
  }
  */
}
