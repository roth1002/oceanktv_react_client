import { CALL_API, Schemas } from '../middleware/api';
import { SELECT_BOTTON,
  PLAY_PAUSE_REQUEST, PLAY_PAUSE_SUCCESS, PLAY_PAUSE_FAILURE,
  REPLAY_REQUEST, REPLAY_SUCCESS, REPLAY_FAILURE,
  GUIDE_REQUEST, GUIDE_SUCCESS, GUIDE_FAILURE,
  NEXT_REQUEST, NEXT_SUCCESS, NEXT_FAILURE,
  EDIT_MIC_ECHO_REQUEST, EDIT_MIC_ECHO_SUCCESS, EDIT_MIC_ECHO_FAILURE,
  EDIT_MIC_VOLUME_REQUEST, EDIT_MIC_VOLUME_SUCCESS, EDIT_MIC_VOLUME_FAILURE,
  EDIT_MUSIC_VOLUME_REQUEST, EDIT_MUSIC_VOLUME_SUCCESS, EDIT_MUSIC_VOLUME_FAILURE,
  EDIT_PITCH_REQUEST, EDIT_PITCH_SUCCESS, EDIT_PITCH_FAILURE,
  EDIT_EFFECT_REQUEST, EDIT_EFFECT_SUCCESS, EDIT_EFFECT_FAILURE,
  FETCH_PLAYSTATE_REQUEST, FETCH_PLAYSTATE_SUCCESS, FETCH_PLAYSTATE_FAILURE,
  STOP_PLAYER_REQUEST, STOP_PLAYER_SUCCESS, STOP_PLAYER_FAILURE,
  EDIT_PLAY_STATE, EDIT_PITCH_STATE, EDIT_MUTE_STATE,
  EDIT_ECHOMODE_STATE, EDIT_MIC_STATE,
  EDIT_MUSIC_STATE, EDIT_ISSINGING_STATE, EDIT_AUDIOMPX_STATE
} from '../constants/ActionTypes';

function actionPlayPause(playerState) {
  return {
    playerState,
    [CALL_API]: {
      types: [ PLAY_PAUSE_REQUEST, PLAY_PAUSE_SUCCESS, PLAY_PAUSE_FAILURE ],
      endpoint: '/player/playpause',
      method: 'POST'
    }
  };
}

export function playpause(playerState) {
  return ( dispatch ) => {
    return dispatch(actionPlayPause(playerState));
  };
}

function actionRepeat() {
  return {
    [CALL_API]: {
      types: [ REPLAY_REQUEST, REPLAY_SUCCESS, REPLAY_FAILURE ],
      endpoint: '/player/replay',
      method: 'POST'
    }
  };
}

export function repeat() {
  return ( dispatch ) => {
    return dispatch(actionRepeat());
  };
}

function actionGuide(state) {
  return {
    state,
    [CALL_API]: {
      types: [ GUIDE_REQUEST, GUIDE_SUCCESS, GUIDE_FAILURE ],
      endpoint: '/player/guide',
      method: 'POST'
    }
  };
}

export function guide(state) {
  return ( dispatch ) => {
    return dispatch(actionGuide(state));
  };
}

function actionNext() {
  return {
    [CALL_API]: {
      types: [ NEXT_REQUEST, NEXT_SUCCESS, NEXT_FAILURE ],
      endpoint: '/player/next',
      method: 'POST'
    }
  };
}

export function next() {
  return ( dispatch ) => {
    return dispatch(actionNext());
  };
}

function actionMicEcho(mode) {
  return {
    name: mode,
    [CALL_API]: {
      types: [ EDIT_MIC_ECHO_REQUEST, EDIT_MIC_ECHO_SUCCESS, EDIT_MIC_ECHO_FAILURE ],
      endpoint: `/effects/mic/echo/${mode}`,
      method: 'POST'
    }
  };
}

export function echo(mode) {
  return ( dispatch ) => {
    return dispatch(actionMicEcho(mode));
  };
}

function actionMicVolumeUp() {
  return {
    name: 'up',
    [CALL_API]: {
      types: [ EDIT_MIC_VOLUME_REQUEST, EDIT_MIC_VOLUME_SUCCESS, EDIT_MIC_VOLUME_FAILURE ],
      endpoint: '/effects/mic/volume/up',
      method: 'POST'
    }
  };
}

export function micVolumeUp() {
  return ( dispatch ) => {
    return dispatch(actionMicVolumeUp());
  };
}

function actionMicVolumeDown() {
  return {
    name: 'down',
    [CALL_API]: {
      types: [ EDIT_MIC_VOLUME_REQUEST, EDIT_MIC_VOLUME_SUCCESS, EDIT_MIC_VOLUME_FAILURE ],
      endpoint: '/effects/mic/volume/down',
      method: 'POST'
    }
  };
}

export function micVolumeDown() {
  return ( dispatch ) => {
    return dispatch(actionMicVolumeDown());
  };
}

export function micMute() {
  return {
    name: 'mute',
    [CALL_API]: {
      types: [ EDIT_MIC_VOLUME_REQUEST, EDIT_MIC_VOLUME_SUCCESS, EDIT_MIC_VOLUME_FAILURE ],
      endpoint: '/effects/mic/mute',
      method: 'POST'
    }
  };
}

function actionMusicVolumeUp() {
  return {
    name: 'up',
    [CALL_API]: {
      types: [ EDIT_MUSIC_VOLUME_REQUEST, EDIT_MUSIC_VOLUME_SUCCESS, EDIT_MUSIC_VOLUME_FAILURE ],
      endpoint: '/player/volume/up',
      method: 'POST'
    }
  };
}

export function musicVolumeUp() {
  return ( dispatch ) => {
    return dispatch(actionMusicVolumeUp());
  };
}

function actionMusicVolumeDown() {
  return {
    name: 'down',
    [CALL_API]: {
      types: [ EDIT_MUSIC_VOLUME_REQUEST, EDIT_MUSIC_VOLUME_SUCCESS, EDIT_MUSIC_VOLUME_FAILURE ],
      endpoint: '/player/volume/down',
      method: 'POST'
    }
  };
}

export function musicVolumeDown() {
  return ( dispatch ) => {
    return dispatch(actionMusicVolumeDown());
  };
}

export function musicMute(state) {
  return {
    name: 'mute',
    state,
    [CALL_API]: {
      types: [ EDIT_MUSIC_VOLUME_REQUEST, EDIT_MUSIC_VOLUME_SUCCESS, EDIT_MUSIC_VOLUME_FAILURE ],
      endpoint: '/player/mute',
      method: 'POST'
    }
  }
}

function actionPitchUp() {
  return {
    name: 'up',
    [CALL_API]: {
      types: [ EDIT_PITCH_REQUEST, EDIT_PITCH_SUCCESS, EDIT_PITCH_FAILURE ],
      endpoint: '/effects/pitch/up',
      method: 'POST'
    }
  };
}

export function pitchUp() {
  return ( dispatch ) => {
    return dispatch(actionPitchUp());
  };
}

function actionPitchDown() {
  return {
    name: 'down',
    [CALL_API]: {
      types: [ EDIT_PITCH_REQUEST, EDIT_PITCH_SUCCESS, EDIT_PITCH_FAILURE ],
      endpoint: '/effects/pitch/down',
      method: 'POST'
    }
  };
}

export function pitchDown() {
  return ( dispatch ) => {
    return dispatch(actionPitchDown());
  };
}

function actionEffect(mode) {
  return {
    name: mode,
    [CALL_API]: {
      types: [ EDIT_EFFECT_REQUEST, EDIT_EFFECT_SUCCESS, EDIT_EFFECT_FAILURE ],
      endpoint: `/effects/sfx/${mode}`,
      method: 'POST'
    }
  };
}

export function effect(mode) {
  return ( dispatch ) => {
    return dispatch(actionEffect(mode));
  };
}

export function stopPlayer() {
  return {
    [CALL_API]: {
      types: [ STOP_PLAYER_REQUEST, STOP_PLAYER_SUCCESS, STOP_PLAYER_FAILURE ],
      endpoint: `/player/stop`,
      method: 'POST'
    }
  }
}

export function loadPlayState() {
  return {
    [CALL_API]: {
      types: [ FETCH_PLAYSTATE_REQUEST, FETCH_PLAYSTATE_SUCCESS, FETCH_PLAYSTATE_FAILURE ],
      endpoint: `/player/state?t=${Date.now()}`,
      method: 'GET'
    }
  };
}

export function editPlayerState(data) {
  return {
    type: EDIT_PLAY_STATE,
    data
  }
}

export function editPitchState(data) {
  return {
    type: EDIT_PITCH_STATE,
    data
  }
}

export function editMuteState(data) {
  return {
    type: EDIT_MUTE_STATE,
    data
  }
}

export function editEchoModeState(data) {
  return {
    type: EDIT_ECHOMODE_STATE,
    data
  }
}

export function editMicState(data) {
  return {
    type: EDIT_MIC_STATE,
    data
  }
}

export function editMusicState(data) {
  return {
    type: EDIT_MUSIC_STATE,
    data
  }
}

export function editIsSingingState(data) {
  return {
    type: EDIT_ISSINGING_STATE,
    data
  }
}

export function editAudioMpxState(data) {
  return {
    type: EDIT_AUDIOMPX_STATE,
    data
  }
}
