import { CALL_API, Schemas } from '../middleware/api';
import {
	GET_YOUTUBE_CATEGORY_REQUEST,
	GET_YOUTUBE_CATEGORY_SUCCESS,
	GET_YOUTUBE_CATEGORY_FAILURE,
	GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST,
	GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS,
	GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE,
  GET_SONGS_FROM_YOUTUBE_DATAAPI_REQUEST,
  GET_SONGS_FROM_YOUTUBE_DATAAPI_SUCCESS,
  GET_SONGS_FROM_YOUTUBE_DATAAPI_FAILURE,
  GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_REQUEST,
  GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_SUCCESS,
  GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_FAILURE,
  GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_REQUEST,
  GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_SUCCESS,
  GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_FAILURE,
} from '../constants/ActionTypes';

function fetchYoutubeCategory({ lang = 'cht', }) {
  return {
    [CALL_API]: {
      types: [GET_YOUTUBE_CATEGORY_REQUEST, GET_YOUTUBE_CATEGORY_SUCCESS, GET_YOUTUBE_CATEGORY_FAILURE],
      endpoint: `/youtube/songlist?page=1&count=1000&language=${lang}`,
      schema: Schemas.YOUTUBE_CATEGORY_ARRAY,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function loadYoutubeCategory(args) {
  return dispatch => {
    return dispatch(fetchYoutubeCategory({ ...args }));
  };
};

function fetchSongsByYoutubeCategory({ id = 0, page = 1, count = 15 }) {
	return {
		page,
    [CALL_API]: {
      types: [GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST, GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS, GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE],
      endpoint: `/youtube/songlist/${id}?page=${page}&count=${count}`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function loadSongsFromYoutubeCategory(args) {
  return dispatch => {
    return dispatch(fetchSongsByYoutubeCategory( { ...args }));
  };
};

function fetchSongsByYoutubeDataAPI({ keywords = '' }) {
  return {
    searchType: 'video',
    [CALL_API]: {
      types: [GET_SONGS_FROM_YOUTUBE_DATAAPI_REQUEST, GET_SONGS_FROM_YOUTUBE_DATAAPI_SUCCESS, GET_SONGS_FROM_YOUTUBE_DATAAPI_FAILURE],
      endpoint: `/cloud/search/video?keywords=${keywords}`,
      schema: Schemas.YOUTUBE_SONGS_ARRAY,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function loadSongsFromYoutubeDataAPI(args) {
  return dispatch => {
    return dispatch(fetchSongsByYoutubeDataAPI( { ...args }));
  };
};

function fetchPlaylistsByYoutubeDataAPI({ keywords = '' }) {
  return {
    searchType: 'playlist',
    [CALL_API]: {
      types: [GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_REQUEST, GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_SUCCESS, GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_FAILURE],
      endpoint: `/cloud/search/playlist?keywords=${keywords}`,
      schema: Schemas.YOUTUBE_PLAYLISTS_ARRAY,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function loadPlaylistsFromYoutubeDataAPI(args) {
  return dispatch => {
    return dispatch(fetchPlaylistsByYoutubeDataAPI( { ...args }));
  };
};

function fetchSongsFromPlaylistsOfDataAPI({ id = '', count = 15, endpoint = '', page = 1 }) {
  return {
    page,
    endpoint,
    [CALL_API]: {
      types: [GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_REQUEST, GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_SUCCESS, GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_FAILURE],
      endpoint: endpoint || `/cloud/search/playlist/${id}?count=${count}`,
      schema: Schemas.YOUTUBE_SONGS_ARRAY,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function loadSongsFromPlaylistsOfDataAPI(args) {
  return dispatch => {
    return dispatch(fetchSongsFromPlaylistsOfDataAPI( { ...args }));
  };
};