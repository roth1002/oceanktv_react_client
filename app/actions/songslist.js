import { CALL_API, Schemas } from '../middleware/api';
import {
  SONGS_BY_ARTIST_REQUEST, SONGS_BY_ARTIST_SUCCESS, SONGS_BY_ARTIST_FAILURE,
  SONGS_BY_LANG_REQUEST, SONGS_BY_LANG_SUCCESS, SONGS_BY_LANG_FAILURE,
  SONGS_BY_KEYWORD_REQUEST, SONGS_BY_KEYWORD_SUCCESS, SONGS_BY_KEYWORD_FAILURE,
  LISTS_ELSE_REQUEST, LISTS_ELSE_SUCCESS, LISTS_ELSE_FAILURE,
  ARTISTS_BY_ARTISTTYPE_REQUEST, ARTISTS_BY_ARTISTTYPE_SUCCESS, ARTISTS_BY_ARTISTTYPE_FAILURE,
  ARTISTS_BY_KEYWORD_REQUEST, ARTISTS_BY_KEYWORD_SUCCESS, ARTISTS_BY_KEYWORD_FAILURE,
  SONGS_BY_ALL_REQUEST,SONGS_BY_ALL_SUCCESS,SONGS_BY_ALL_FAILURE,
  FILE_EDIT_INFO_REQUEST, FILE_EDIT_INFO_SUCCESS, FILE_EDIT_INFO_FAILURE,
  POST_REQUEST, POST_SUCCESS, POST_FAILURE,
  FETCH_MENUINFO_REQUEST, FETCH_MENUINFO_SUCCESS, FETCH_MENUINFO_FAILURE,
  FETCH_AUDIOTRACK_REQUEST, FETCH_AUDIOTRACK_SUCCESS, FETCH_AUDIOTRACK_FAILURE
} from '../constants/ActionTypes';

function fetchSongsByArtist({ page = 1, count = 15, artistId, artistName, append = false }) {
  return {
    artistName,
    artistId,
    page,
    append,
    [CALL_API]: {
      types: [SONGS_BY_ARTIST_REQUEST, SONGS_BY_ARTIST_SUCCESS, SONGS_BY_ARTIST_FAILURE],
      endpoint: `/songlist?query_who=songs&page=${page}&count=${count}&artist_id=${artistId}&t=${Date.now()}`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    }
  };
}

export function loadSongsByArtist(args) {
  return dispatch => {
    return dispatch(fetchSongsByArtist({ ...args }));
  };
};

function fetchSongsByLang({ page = 1, count = 15, lang, nsongs }) {
  const nSongs = nsongs ? `&nsongs=${nsongs}` : ''
  return {
    lang,
    page,
    [CALL_API]: {
      types: [SONGS_BY_LANG_REQUEST, SONGS_BY_LANG_SUCCESS, SONGS_BY_LANG_FAILURE],
      endpoint: `/songlist?query_who=songs&page=${page}&count=${count}&lang=${lang}${nSongs}&t=${Date.now()}`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    }
  };
}

export function loadSongsByLang(args) {
  return dispatch => {
    return dispatch(fetchSongsByLang({ ...args }));
  };
};

function fetchSongsByKeyword({ page = 1, count = 15, keyword, append = false }) {
  return {
    keyword,
    page,
    append,
    [CALL_API]: {
      types: [SONGS_BY_KEYWORD_REQUEST, SONGS_BY_KEYWORD_SUCCESS, SONGS_BY_KEYWORD_FAILURE],
      endpoint: `/songlist?query_who=songs&page=${page}&count=${count}&keywords=${keyword}&t=${Date.now()}`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    }
  };
}

export function loadSongsByKeyword(args) {
  return dispatch => {
    return dispatch(fetchSongsByKeyword({ ...args }));
  };
};

function fetchArtistsByArtistType({ page = 1, count = 60, artistType }) {
  return {
    artistType,
    page,
    [CALL_API]: {
      types: [ARTISTS_BY_ARTISTTYPE_REQUEST, ARTISTS_BY_ARTISTTYPE_SUCCESS, ARTISTS_BY_ARTISTTYPE_FAILURE],
      endpoint: `/songlist/artists/${artistType}?page=${page}&count=${count}&t=${Date.now()}`,
      schema: Schemas.ARTIST_ARRAY,
      method: 'GET'
    }
  };
}

export function loadArtistsByArtistType(args) {
  return dispatch => {
    return dispatch(fetchArtistsByArtistType({ ...args }));
  };
};

function fetchArtistsByKeyword({ page = 1, count = 60, keyword, append = false }) {
  return {
    keyword,
    page,
    append,
    [CALL_API]: {
      types: [ARTISTS_BY_KEYWORD_REQUEST, ARTISTS_BY_KEYWORD_SUCCESS, ARTISTS_BY_KEYWORD_FAILURE],
      endpoint: `/songlist?query_who=artists&page=${page}&count=${count}&keywords=${keyword}&t=${Date.now()}`,
      schema: Schemas.ARTIST_ARRAY,
      method: 'GET'
    }
  };
}

export function loadArtistsByKeyword(args) {
  return dispatch => {
    return dispatch(fetchArtistsByKeyword({ ...args }));
  };
};

function fetchArtistTypes() {
  return {
    name: 'artistTypes',
    [CALL_API]: {
      types: [LISTS_ELSE_REQUEST, LISTS_ELSE_SUCCESS, LISTS_ELSE_FAILURE],
      endpoint: `/songlist/artists?t=${Date.now()}`,
      schema: Schemas.LIST_ARRAY,
      method: 'GET'
    }
  };
}

export function loadArtistTypes() {
  return dispatch => {
    return dispatch(fetchArtistTypes());
  };
};

function fetchLangs() {
  return {
    name: 'langs',
    [CALL_API]: {
      types: [LISTS_ELSE_REQUEST, LISTS_ELSE_SUCCESS, LISTS_ELSE_FAILURE],
      endpoint: `/songlist/languages?t=${Date.now()}`,
      schema: Schemas.LIST_ARRAY,
      method: 'GET'
    }
  };
}

export function loadLangs() {
  return dispatch => {
    return dispatch(fetchLangs());
  };
};

function fetchSongsByFolder({ page = 1, count = 15, path = 'OceanKTV'}) {
  return {
    path,
    page,
    [CALL_API]: {
      types: [SONGS_BY_ALL_REQUEST, SONGS_BY_ALL_SUCCESS, SONGS_BY_ALL_FAILURE],
      endpoint: `/songlist/folder?page=${page}&count=${count}&path=${path}&t=${Date.now()}`,
      schema: Schemas.SONG_BY_FOLDER_ARRAY,
      method: 'GET'
    }
  };
}

export function loadSongsByFolder(args) {
  return dispatch => {
    return dispatch(fetchSongsByFolder({...args}));
  };
};

export function postFileEdit({ songId, songName, artist, gender, lang, track }) {
  return {
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/songlist/song/${songId}`,
      body: { songname: songName, artist, gender, lang, track },
      method: 'POST'
    }
  };
}

export function getFileEdit(songId) {
  return {
    [CALL_API]: {
      types: [FILE_EDIT_INFO_REQUEST, FILE_EDIT_INFO_SUCCESS, FILE_EDIT_INFO_FAILURE],
      endpoint: `/songlist/song/${songId}?t=${Date.now()}`,
      method: 'GET'
    }
  };
}

export function fetchMenuInfo() {
  return {
    [CALL_API]: {
      types: [FETCH_MENUINFO_REQUEST, FETCH_MENUINFO_SUCCESS, FETCH_MENUINFO_FAILURE],
      endpoint: `/songlist/info?t=${Date.now()}`,
      method: 'GET'
    }
  };
}

export function fetchAudioTrack(songId) {
  return {
    [CALL_API]: {
      types: [FETCH_AUDIOTRACK_REQUEST, FETCH_AUDIOTRACK_SUCCESS, FETCH_AUDIOTRACK_FAILURE],
      endpoint: `/songlist/songtrackinfo?sonid=${songId}&t=${Date.now()}`,
      method: 'GET'
    }
  };
}
