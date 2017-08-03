import { CALL_API, Schemas } from '../middleware/api';
import {
  GET_THEMES_REQUEST, GET_THEMES_SUCCESS, GET_THEMES_FAILURE,
  POST_THEMES_REQUEST, POST_THEMES_SUCCESS, POST_THEMES_FAILURE,
  GET_AUDIO_REQUEST, GET_AUDIO_SUCCESS, GET_AUDIO_FAILURE,
  POST_AUDIO_REQUEST, POST_AUDIO_SUCCESS, POST_AUDIO_FAILURE,
  GET_MIC_REQUEST, GET_MIC_SUCCESS, GET_MIC_FAILURE,
  POST_MIC_REQUEST, POST_MIC_SUCCESS, POST_MIC_FAILURE,
  GET_INFO_REQUEST, GET_INFO_SUCCESS, GET_INFO_FAILURE,
  POST_PLAYER_REQUEST, POST_PLAYER_SUCCESS, POST_PLAYER_FAILURE,
  GET_SHARED_REQUEST, GET_SHARED_SUCCESS, GET_SHARED_FAILURE,
  GET_SHARE_REQUEST, GET_SHARE_SUCCESS, GET_SHARE_FAILURE,
  POST_SHARED_REQUEST, POST_SHARED_SUCCESS, POST_SHARED_FAILURE,
  DELETE_SHARED_REQUEST, DELETE_SHARED_SUCCESS, DELETE_SHARED_FAILURE,
  EDIT_TVLAUNCH_STATE,
  EDIT_DEVICE_HOT_PLUG_STATE,
  EDIT_NETWORK_ACCESS_STATE
} from '../constants/ActionTypes';

export function loadMyTheme() {
  return {
    [CALL_API]: {
      types: [GET_THEMES_REQUEST, GET_THEMES_SUCCESS, GET_THEMES_FAILURE],
      endpoint: `/system/config/web?t=${Date.now()}`,
      method: 'GET'
    }
  };
}

export function loadMyAudioOutput() {
  return {
    [CALL_API]: {
      types: [GET_AUDIO_REQUEST, GET_AUDIO_SUCCESS, GET_AUDIO_FAILURE],
      endpoint: `/system/audio/output?t=${Date.now()}`,
      method: 'GET'
    }
  };
}

export function loadMyAudioInput() {
  return {
    [CALL_API]: {
      types: [GET_MIC_REQUEST, GET_MIC_SUCCESS, GET_MIC_FAILURE],
      endpoint: `/system/audio/input?t=${Date.now()}`,
      method: 'GET'
    }
  };
}


export function setMyTheme(theme) {
  return {
    [CALL_API]: {
      types: [POST_THEMES_REQUEST, POST_THEMES_SUCCESS, POST_THEMES_FAILURE],
      endpoint: `/system/config/web`,
      method: 'POST',
      body: { data: JSON.stringify({ current_theme: theme })}
    }
  };
}

export function setMyAudioOutput(dev) {
  return {
    [CALL_API]: {
      types: [POST_AUDIO_REQUEST, POST_AUDIO_SUCCESS, POST_AUDIO_FAILURE],
      endpoint: `/system/audio/output`,
      method: 'POST',
      body: { dev }
    }
  };
}

export function setMyAudioInput(dev) {
  return {
    [CALL_API]: {
      types: [POST_MIC_REQUEST, POST_MIC_SUCCESS, POST_MIC_FAILURE],
      endpoint: `/system/audio/input`,
      method: 'POST',
      body: { dev }
    }
  };
}

export function loadAppInfo() {
  return {
    [CALL_API]: {
      types: [GET_INFO_REQUEST, GET_INFO_SUCCESS, GET_INFO_FAILURE],
      endpoint: `/system/info?t=${Date.now()}`,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function fullscreenFailue(state) {
  return {
    type: 'FULLSCREEN_FAILUE',
    state
  };
}

export function playerStart() {
  return {
    [CALL_API]: {
      types: [POST_PLAYER_REQUEST, POST_PLAYER_SUCCESS, POST_PLAYER_FAILURE],
      endpoint: `/system/poweron`,
      method: 'POST'
    }
  };
}

export function playerShutDown() {
  return {
    [CALL_API]: {
      types: [POST_PLAYER_REQUEST, POST_PLAYER_SUCCESS, POST_PLAYER_FAILURE],
      endpoint: `/system/shutdown`,
      method: 'POST'
    }
  };
}

export function fetchSharedFolder() {
  return {
    [CALL_API]: {
      types: [GET_SHARED_REQUEST, GET_SHARED_SUCCESS, GET_SHARED_FAILURE],
      endpoint: `/system/share/oceanktv?t=${Date.now()}`,
      method: 'GET'
    }
  };
}

export function fetchShareFolderDynamic(dir = '') {
  const endpoint = dir ? `/system/share?dir=${dir}&t=${Date.now()}` : `/system/share?t=${Date.now()}`;
  return {
    [CALL_API]: {
      types: [GET_SHARE_REQUEST, GET_SHARE_SUCCESS, GET_SHARE_FAILURE],
      endpoint,
      method: 'GET'
    }
  };
}

export function postSharedFolder(path) {
  return {
    [CALL_API]: {
      types: [POST_SHARED_REQUEST, POST_SHARED_SUCCESS, POST_SHARED_FAILURE],
      endpoint: `/system/share/oceanktv?dir=${path}`,
      method: 'POST'
    }
  };
}

export function deleteSharedFolder(path) {
  return {
    [CALL_API]: {
      types: [DELETE_SHARED_REQUEST, DELETE_SHARED_SUCCESS, DELETE_SHARED_FAILURE],
      endpoint: `/system/share/oceanktv?dir=${path}`,
      method: 'DELETE'
    }
  };
}

export function editSystemTvLaunchState(data) {
  return {
    type: EDIT_TVLAUNCH_STATE,
    data
  }
}

export function editSystemDeviceHotPlugState(data) {
  return {
    type: EDIT_DEVICE_HOT_PLUG_STATE,
    data
  }
}

export function editNetworkAccessState(data) {
  return {
    type: EDIT_NETWORK_ACCESS_STATE,
    data
  }
}
