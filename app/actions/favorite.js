import { CALL_API, Schemas } from '../middleware/api';
import {
  SONGS_FROM_FAVORITE_REQUEST, SONGS_FROM_FAVORITE_SUCCESS, SONGS_FROM_FAVORITE_FAILURE,
  LISTS_ELSE_REQUEST, LISTS_ELSE_SUCCESS, LISTS_ELSE_FAILURE,
  POST_REQUEST, POST_SUCCESS, POST_FAILURE,
  PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE,
  DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE,
  EDIT_FAVORITE_NAME_REQUEST, EDIT_FAVORITE_NAME_SUCCESS, EDIT_FAVORITE_NAME_FAILURE,
  COLLECTION_FROM_YOUTUBE_REQUEST, COLLECTION_FROM_YOUTUBE_SUCCESS, COLLECTION_FROM_YOUTUBE_FAILURE,
  GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST,
  GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS,
  GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE,
} from '../constants/ActionTypes';

function fetchSongsFromFavorite(favorId, page = 1, count = 15) {
  return {
    favorId,
    page,
    [CALL_API]: {
      types: [SONGS_FROM_FAVORITE_REQUEST, SONGS_FROM_FAVORITE_SUCCESS, SONGS_FROM_FAVORITE_FAILURE],
      endpoint: `/favorite/${favorId}?page=${page}&count=${count}&t=${Date.now()}`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    }
  };
}

export function loadSongsFromFavorite(favorId, page, count) {
  return dispatch => {
    return dispatch(fetchSongsFromFavorite(favorId, page, count));
  };
};

function fetchListFromFavorite() {
  return {
    name: 'favorite',
    [CALL_API]: {
      types: [LISTS_ELSE_REQUEST, LISTS_ELSE_SUCCESS, LISTS_ELSE_FAILURE],
      endpoint: `/favorite?t=${Date.now()}`,
      schema: Schemas.LIST_ARRAY,
      method: 'GET'
    }
  };
}

export function loadListFromFavorite() {
  return dispatch => {
    return dispatch(fetchListFromFavorite());
  };
};

export function putSongToFavorite(favorId, songId, name, favorName, flow = 0) {
  return {
    name,
    favorName,
    [CALL_API]: {
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/favorite/${favorId}?songid=${songId}&flow=${flow}`,
      method: 'PUT'
    }
  };
};

export function putSongArrayToFavorite(favorId, songArray) {
  return {
    isArray: true,
    [CALL_API]: {
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/favorite/list/${favorId}`,
      method: 'PUT',
      body: { list: JSON.stringify({ list: songArray }) }
    }
  };
};

export function postNameToFavorite(favorId, name) {
  return {
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/favorite/${favorId}`,
      body: { name },
      method: 'POST'
    }
  };
};

export function postNewFavoriteName(name) {
  return {
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/favorite`,
      body: { name },
      method: 'POST'
    }
  };
};

export function deleteFavoriteName(favorId) {
  return {
    [CALL_API]: {
      types: [DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE],
      endpoint: `/favorite?favor_id=${favorId}`,
      method: 'DELETE'
    }
  };
};


export function deleteSongFromFavorite(favorId, songId, songName) {
  return {
    songName,
    [CALL_API]: {
      types: [DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE],
      endpoint: `/favorite/${favorId}?songid=${songId}`,
      method: 'DELETE'
    }
  };
};

export function deleteSongArrayFromFavorite(favorId, songArray) {
  return {
    [CALL_API]: {
      types: [DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE],
      endpoint: `/favorite/list/${favorId}?list=${JSON.stringify(songArray)}`,
      method: 'DELETE'
    }
  };
};

function fetchCollection({ id = '1', count = 1000, page = 1 }) {
  return {
    page,
    [CALL_API]: {
      types: [COLLECTION_FROM_YOUTUBE_REQUEST, COLLECTION_FROM_YOUTUBE_SUCCESS, COLLECTION_FROM_YOUTUBE_FAILURE],
      endpoint: `/favorite/collection?page=${page}&count=${count}`,
      schema: Schemas.YOUTUBE_COLLECTION_CATEGORY_ARRAY,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function loadCollection(args) {
  return dispatch => {
    return dispatch(fetchCollection( { ...args }));
  };
};

export function postNewCollection({ sharelink = '', link_type = 'listId'}) {
  return {
    sharelink: 'sharelink',
    [CALL_API]: {
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/favorite/collection`,
      body: { sharelink, link_type },
      method: 'POST',
      version: 'v2'
    }
  };
}

export function deleteFromCollection({ id = '0' }) {
  return {
    sharelink: 'sharelink',
    [CALL_API]: {
      types: [DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE],
      endpoint: `/favorite/collection/${id}`,
      method: 'DELETE',
      version: 'v2'
    }
  };
}

function fetchSongsFromCollection({ id = '', count = 15, endpoint = '', page = 1 }) {
  return {
    page,
    endpoint,
    collectionId: id,
    [CALL_API]: {
      types: [GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST, GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS, GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE],
      endpoint: endpoint || `/favorite/collection/${id}?count=${count}`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET',
      version: 'v2'
    }
  };
}

export function loadSongsFromCollection(args) {
  return dispatch => {
    return dispatch(fetchSongsFromCollection( { ...args }));
  };
}
