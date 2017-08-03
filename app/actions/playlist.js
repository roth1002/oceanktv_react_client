import { CALL_API, Schemas } from '../middleware/api';
import {
  LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE,
  POST_REQUEST, POST_SUCCESS, POST_FAILURE,
  PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE,
  DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE,
  DELETE_QUEUE_REQUEST, DELETE_QUEUE_SUCCESS, DELETE_QUEUE_FAILURE,
  PLAYLIST_INFO_REQUEST, PLAYLIST_INFO_SUCCESS, PLAYLIST_INFO_FAILURE
} from '../constants/ActionTypes';

function fetchPlaylist(name, page = 1, count = 15, schema) {
  return {
    name,
    page,
    [CALL_API]: {
      types: [LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE],
      endpoint: `/playlist?state=${name}&page=${page}&count=${count}&t=${Date.now()}`,
      schema: schema,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function loadPlaylist(name, page, count) {
  return (dispatch, getState) => {
    if ( name === 'current' ) {
      return dispatch(fetchPlaylist(name, page, count, Schemas.SONG_ARRAY_BY_CURRENT));
    }
    return dispatch(fetchPlaylist(name, page, count, Schemas.SONG_ARRAY_BY_FINISHED));
  };
};

function fetchHistory(page = 1, count = 15, order= 'desc') {
  return {
    name: 'history',
    page,
    [CALL_API]: {
      types: [LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE],
      endpoint: `/playlist/history?page=${page}&count=${count}&order=${order}&t=${Date.now()}`,
      schema: Schemas.SONG_ARRAY_BY_HISTORY_ID,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function loadHistory(page, count, order) {
  return dispatch => {
    return dispatch(fetchHistory(page, count, order));
  };
};

export function postSongToQueue(songid, songName, flow = 0) {
  return {
    songName,
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist`,
      body: { songid, flow },
      method: 'POST',
      version: 'v2'
    }
  };
};

export function postSongArrayToQueue(songArray) {
  return {
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist/multimode`,
      body: { list: JSON.stringify({ list: songArray }) },
      method: 'POST'
    }
  };
};

export function putSongToQueue(songid, songName, flow = 0) {
  return {
    songName,
    [CALL_API]: {
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/playlist`,
      body: { songid, flow },
      method: 'PUT',
      version: 'v2'
    }
  };
};

export function putSongArrayToQueue(songArray) {
  return {
    next: 'next',
    [CALL_API]: {
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/playlist/multimode`,
      body: { list: JSON.stringify({ list: songArray }) },
      method: 'PUT'
    }
  };
};

export function deleteSongFromQueue(songid, index, songName) {
  return {
    songName,
    [CALL_API]: {
      types: [DELETE_QUEUE_REQUEST, DELETE_QUEUE_SUCCESS, DELETE_QUEUE_FAILURE],
      endpoint: `/playlist?songid=${songid}&index=${index}`,
      method: 'DELETE',
      version: 'v2'
    }
  };
};

export function deleteSongArrayFromQueue(songArray) {
  return {
    [CALL_API]: {
      types: [DELETE_QUEUE_REQUEST, DELETE_QUEUE_SUCCESS, DELETE_QUEUE_FAILURE],
      endpoint: `/playlist/multimode/delete`,
      method: 'POST',
      body: {
        list: JSON.stringify({list: songArray})
      }
    }
  };
};

export function postFavoriteToQueue(favorId, mode, random) {
  return {
    mode,
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist/favorite/${favorId}`,
      method: 'POST',
      body: { mode, random }
    }
  };
};

export function fetchPlaylistInfo() {
  return {
    [CALL_API]: {
      types: [PLAYLIST_INFO_REQUEST, PLAYLIST_INFO_SUCCESS, PLAYLIST_INFO_FAILURE],
      endpoint: `/playlist/info?t=${Date.now()}`,
      method: 'GET'
    }
  };
};

export function postYoutubeSongToQueue(songid, songName, source_type = 1) {
  return {
    songName,
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist`,
      body: { songid, source_type },
      method: 'POST',
      version: 'v2'
    }
  };
};

export function putYoutubeSongToQueue(songid, songName, source_type = 1) {
  return {
    songName,
    [CALL_API]: {
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/playlist`,
      body: { songid, source_type },
      method: 'PUT',
      version: 'v2'
    }
  };
};

export function postYoutubePlaylistToQueue({ id = 0, mode = 'add'}) {
  return {
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist/ktvcloud/list/${id}`,
      body: { mode },
      method: 'POST',
      version: 'v2'
    }
  }
}

export function postCollectionlistToQueue({ id = 0, mode = 'add', random = 'False'}) {
  return {
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist/collection/list/${id}`,
      body: { mode, random },
      method: 'POST',
      version: 'v2'
    }
  }
}

export function postRecommandlistToQueue({ id = 0, mode = 'add', random = 'False'}) {
  return {
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist/recommand/list/${id}`,
      body: { mode, random },
      method: 'POST',
      version: 'v2'
    }
  }
}

