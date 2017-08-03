import React, { Component, PropTypes } from 'react'
import TagsInput from 'react-tagsinput'
import Select from 'react-select'
import Player from './Player';
import { ROOT, API_ROOT } from '../constants/Config';
import { stopPropagation } from '../utils/functions'

function checkInput(txt) {
  const regexChecker = /[\^|\&|\.|\*|\+|\?|\!|\:|\||\\|\/|\(|\)|\[|\]|\{|\}|\#|\!|\$|\~|\@|\%|\_|\=|\||\'|\"|\;|\,|\/|\＋|\！|\＠|\＃|\＄|\％|\＾|\＆|\＊|\（|\）|\＿|\＋|\、|\」|\「|\‘|\，|\．|\／|\；|\’|\｀|\～|\＝|\｜|\』|\『|\“|\：|\？|\。]/g
  return regexChecker.test(txt)
}

export default class FileEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gender: '',
      track: '',
      filename: '',
      artist: [],
      lang: '',
      myAudioTrackType: '',
      preListenAPI: ''
    }
  }

  componentDidMount() {
    const { i18n, songLangs, getFileEdit, data: { songId }, fetchAudioTrack } = this.props
    getFileEdit(songId).then( result => {
      const {
        response: {
          gender = '', track = '',
          name = '', artist,
          lang = ''
        }
      } = result

      const artists = artist ? artist.split(',') : []

      this.setState({
        gender,
        track,
        filename: name,
        artist: artists,
        lang: lang
      })
    });
    fetchAudioTrack(songId).then( result => {
      const {
        response: {
          audioTrack
        }
      } = result;
      const myAudioTrack = audioTrack.filter( item => item.streamData === 'track_0' || item.streamData === 'track_1');
      const myAudioTrackType = myAudioTrack.length === audioTrack.length ? 'track_' : 'chan_';
      this.setState({
        myAudioTrackType
      });
    });
    this.languages = songLangs.map( item => {
      return {
        value: item.name,
        label: i18n[i18n.myLang]['sidetab.submenu.' + item.name.toLowerCase()]
      }
    })
  }

  componentWillUnmount() {
    this.setState({
      gender: '',
      track: '',
      filename: '',
      artist: [],
      lang: ''
    })
  }

  render() {
  	const { data, i18n } = this.props;
    const { gender = '', track = '', filename = '', artist = [], lang = '' } = this.state
    let confirmDisable = false
    const isNull = gender === null || track === null || filename === null || artist === null || lang === null;

    if ( isNull || gender.length === 0 || track.length === 0 || filename.length === 0 || artist.length === 0 || lang.length === 0) {
      confirmDisable = true
    }

  	return (
      <div className={`Modal-content`}>
        <h2 className={`Modal-title`}>
          {i18n[i18n.myLang]['modal.fileEditor.title']}
          <span className={`Modal-title--edit-help ic ic_topbar_help`} onClick={this.handleToggleHelpCenter.bind(this)}></span>
        </h2>
        <form className={`Modal-form`} onSubmit={this.handleFileEditSubmit.bind(this)}>
          <h3 className={`FileEdit-originalName`}>{data.songName} ({i18n[i18n.myLang]['modal.fileEditor.originalName']})</h3>
          {this.renderFilenameInput(i18n)}
          {this.renderArtistsInput(i18n)}
          {this.renderLangsInput(i18n)}
          {this.renderGenderInput(i18n)}
          {this.renderTrackInput(i18n)}
          <div className={`Modal-confirm Modal-confirm--favor-edit`}>
            <button type="submit" disabled={confirmDisable}>
              {i18n[i18n.myLang]['modal.button.confirm']}
            </button>
            <button type="button" onClick={this.handleModalClose.bind(this)}>
              {i18n[i18n.myLang]['modal.button.cancel']}
            </button>
          </div>
        </form>
        {this.renderAudioTag()}
      </div>
    );
  }

  renderAudioTag() {
    const { myAudioTrackType } = this.state;
    const { data } = this.props;
    if ( myAudioTrackType === 'chan_' ) {
      return (
        <div>
          <audio id="myPrelistenChannelLeft">
            <source src={`${API_ROOT}/songlist/songlisten?sonid=${data.songId}&track=chan_l&ss=30&total_time=60`} />
          </audio>
          <audio id="myPrelistenChannelRight">
            <source src={`${API_ROOT}/songlist/songlisten?sonid=${data.songId}&track=chan_r&ss=30&total_time=60`} />
          </audio>
        </div>
      );
    } else if ( myAudioTrackType === 'track_' ) {
      return (
        <div>
          <audio id="myPrelistenTrackOne">
            <source src={`${API_ROOT}/songlist/songlisten?sonid=${data.songId}&track=track_0&ss=30&total_time=60`} />
          </audio>
          <audio id="myPrelistenTrackTwo">
            <source src={`${API_ROOT}/songlist/songlisten?sonid=${data.songId}&track=track_1&ss=30&total_time=60`} />
          </audio>
        </div>
      );
    } else {

    }
  }

  renderFilenameInput(i18n) {
    const { data } = this.props;
    const { filename } = this.state;
    const match = checkInput(filename);
    const displayFileName = match ? '' : filename;
    const displayPlaceHolder = match ? filename : i18n[i18n.myLang]['modal.fileEditor.filename.placeholder'];
    return (
      <div className={`FileEdit-row`}>
        <div className={`FileEdit-label`}>
          {i18n[i18n.myLang]['modal.fileEditor.filename']}
        </div>
        <div className={`FileEdit-input`}>
          <input type="text" value={displayFileName} placeholder={displayPlaceHolder} onChange={::this.handleFilenameChange} />
        </div>
      </div>
    )
  }

  handleFilenameChange(e) {
    const txt = e.currentTarget.value
    const match = checkInput(txt)

    if (match || ( txt.length === 1 && ( txt[0] === ' ' || txt[0] === '　')) ) {
      return;
    }

    const isFirstCharIsBlank = txt.length >= 1 && ( txt[0] === ' ' || txt[0] === '　');
    const filename = isFirstCharIsBlank ? txt.slice(1) : txt;
    this.setState({
      filename: filename
    })
  }

  renderArtistsInput(i18n) {
    const { artist } = this.state
    return (
      <div className={`FileEdit-row`}>
        <div className={`FileEdit-label`}>
          {i18n[i18n.myLang]['modal.fileEditor.artist']}
        </div>
        <div className={`FileEdit-input`}>
          <TagsInput value={artist} onChange={::this.handleArtistsChange} renderInput={::this.renderArtistTagsInput}
            tagProps={{ className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove ic delete' }} />
        </div>
      </div>
    )
  }

  renderArtistTagsInput(props) {
    const { i18n } = this.props;
    const { onChange, ...others } = props;
    return (
      <input type="text" {...others} placeholder={i18n[i18n.myLang]['modal.fileEditor.artistname.placeholder']} onChange={this.checkArtistTagsInput.bind(this, onChange)} />
    )
  }

  checkArtistTagsInput(onChange, e) {
    const txt = e.currentTarget.value
    const match = checkInput(txt)

    if (match) {
      return;
    }

    onChange(e)
  }

  handleArtistsChange(artist) {
    this.setState({
      artist
    })
  }

  renderLangsInput(i18n) {
    const { lang } = this.state
    return (
      <div className={`FileEdit-row`}>
        <div className={`FileEdit-label`}>
          {i18n[i18n.myLang]['modal.fileEditor.lang']}
        </div>
        <div className={`FileEdit-input`}>
          <Select
            name="lang"
            value={lang}
            placeholder={i18n[i18n.myLang]['modal.fileEditor.lang.placeholder']}
            options={this.languages}
            onChange={::this.handleLangChange}
            clearable={false}
            searchable={false} />
        </div>
      </div>
    )
  }

  handleLangChange(val) {
    this.setState({
      lang: val.value
    })
  }

  renderGenderInput(i18n) {
    const { gender } = this.state
    return (
      <div className={`FileEdit-row`}>
        <div className={`FileEdit-label`}>
          {i18n[i18n.myLang]['modal.fileEditor.gender']}
        </div>
        <div className={`FileEdit-input`}>
          <div className={`FileEdit-radio`}>
            <input id="FileEdit-male" name="gender" type="radio" value="male" checked={gender === 'male'} onChange={::this.handleGenderChange} />
            <label htmlFor="FileEdit-male">{i18n[i18n.myLang]['modal.fileEditor.gender.male']}</label>
          </div>
          <div className={`FileEdit-radio`}>
            <input id="FileEdit-female" name="gender" type="radio" value="female" checked={gender === 'female'} onChange={::this.handleGenderChange} />
            <label htmlFor="FileEdit-female">{i18n[i18n.myLang]['modal.fileEditor.gender.female']}</label>
          </div>
          <div className={`FileEdit-radio`}>
            <input id="FileEdit-group" name="gender" type="radio" value="group" checked={gender === 'group'} onChange={::this.handleGenderChange} />
            <label htmlFor="FileEdit-group">{i18n[i18n.myLang]['modal.fileEditor.gender.group']}</label>
          </div>
        </div>
      </div>
    )
  }

  handleGenderChange(e) {
    this.setState({
      gender: e.currentTarget.value
    })
  }

  renderTrackInput(i18n) {
    const { track, myAudioTrackType } = this.state;
    const { data } = this.props;
    return (
      <div className={`FileEdit-row`}>
        <div className={`FileEdit-label`}>
          {i18n[i18n.myLang]['modal.fileEditor.track']}
        </div>
        {
          myAudioTrackType === 'chan_' ?
          <div className={`FileEdit-input`}>
            <div className={`FileEdit-radio`}>
              <input id="FileEdit-ChannelLeft" name="track" type="radio" value="chan_l" checked={track === 'chan_l'} onChange={::this.handleTrackChange} />
              <label htmlFor="FileEdit-ChannelLeft">{i18n[i18n.myLang]['modal.fileEditor.track.chLeft']}</label>
              <span className="FileEdit-prelisten ic ic_prelisten" onClick={ evt => this.handlePreListenAPI(evt, 'myPrelistenChannelLeft', 'myPrelistenChannelRight')}></span>
            </div>
            <div className={`FileEdit-radio`}>
              <input id="FileEdit-channelRight" name="track" type="radio" value="chan_r" checked={track === 'chan_r'} onChange={::this.handleTrackChange} />
              <label htmlFor="FileEdit-channelRight">{i18n[i18n.myLang]['modal.fileEditor.track.chRight']}</label>
              <span className="FileEdit-prelisten ic ic_prelisten" onClick={ evt => this.handlePreListenAPI(evt, 'myPrelistenChannelRight', 'myPrelistenChannelLeft')}></span>
            </div>
            <div className={`FileEdit-radio`}>
              <input id="FileEdit-stereo" name="track" type="radio" value="stereo" checked={track === 'stereo'} onChange={::this.handleTrackChange} />
              <label htmlFor="FileEdit-stereo">{i18n[i18n.myLang]['modal.fileEditor.track.stereo']}</label>
            </div>
          </div> :
          <div className={`FileEdit-input`}>
            <div className={`FileEdit-radio`}>
              <input id="FileEdit-track1" name="track" type="radio" value="track_0" checked={track === 'track_0'} onChange={::this.handleTrackChange} />
              <label htmlFor="FileEdit-track1">{i18n[i18n.myLang]['modal.fileEditor.track.track01']}</label>
              <span className="FileEdit-prelisten ic ic_prelisten" onClick={ evt => this.handlePreListenAPI(evt, 'myPrelistenTrackOne', 'myPrelistenTrackTwo')}></span>
            </div>
            <div className={`FileEdit-radio`}>
              <input id="FileEdit-track2" name="track" type="radio" value="track_1" checked={track === 'track_1'} onChange={::this.handleTrackChange} />
              <label htmlFor="FileEdit-track2">{i18n[i18n.myLang]['modal.fileEditor.track.track02']}</label>
              <span className="FileEdit-prelisten ic ic_prelisten" onClick={ evt => this.handlePreListenAPI(evt, 'myPrelistenTrackTwo', 'myPrelistenTrackOne')}></span>
            </div>
          </div>
        }
      </div>
    )
  }

  handleTrackChange(e) {
    this.setState({
      track: e.currentTarget.value
    })
  }

  handleModalClose(evt, type) {
    const { toggleView } = this.props;
    toggleView('modal', { visible: false });
    toggleView('slidePanel', { visible: false, view: 'help', isTriggeredByModal: false });
    evt.preventDefault();
  }

  handleFileEditSubmit(evt) {
    const { data, postFileEdit, toggleView } = this.props
    const dataWillSubmit = {
      ...this.state,
      songId: data.songId,
      artist: this.state.artist.join(','),
      songName: this.state.filename
    }
    evt.preventDefault();
    delete dataWillSubmit.filename
    if ( dataWillSubmit.songName.trim().length === 0 ) {
      dataWillSubmit.songName = ''
    }
    postFileEdit(dataWillSubmit);
    toggleView('modal', { visible: false });
  }

  handlePreListenAPI(evt, elementId, stopElementId) {
    stopPropagation(evt);
    const playId = document.getElementById(elementId);
    const stopId = document.getElementById(stopElementId);
    if ( playId.paused) {
      playId.play();
      stopId.pause();
    } else if ( playId.played ) {
      playId.pause();
    }
  }

  handleToggleHelpCenter() {
    const slidePanelState = this.props.slidePanelState;
    const isTriggeredByModal = slidePanelState.isTriggeredByModal;

    this.props.toggleView('slidePanel', {
      visible: isTriggeredByModal ? !slidePanelState.visible : true,
      view: 'help',
      isTriggeredByModal: true
    });
  }
}
