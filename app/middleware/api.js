import { Schema, arrayOf } from 'normalizr';

import { callApi } from '../utils/api'
import { API_ROOT } from '../constants/Config';

export const CALL_API = Symbol('Call API');

const listSchema = new Schema('lists', {
  idAttribute: 'id'
});

const songSchema = new Schema('songs', {
  idAttribute: 'id'
});

const songByFolder = new Schema('songs', {
  idAttribute: 'fullname'
});

const songByCurrentSchema = new Schema('songsByCurrent', {
  idAttribute: 'index'
});

const songByFinishedSchema = new Schema('songsByFinished', {
  idAttribute: 'index'
});

const songByHistoryIdSchema = new Schema('songsByHistoryId', {
  idAttribute: 'historyId'
});

const songSchemaS = new Schema('songs', {
  idAttribute: 'songid'
});

const artistSchema = new Schema('artists', {
  idAttribute: 'id'
});

const youtubeCateSchema = new Schema('items', {
  idAttribute: 'id'
});

const youtubeSongsSchema = new Schema('songs', {
  idAttribute: 'id'
});

const youtubePlaylistsSchema = new Schema('playlists', {
  idAttribute: 'id'
});

const collectionCateSchema = new Schema('collectionItems', {
  idAttribute: 'id'
});

export const Schemas = {
  LIST: listSchema,
  LIST_ARRAY: arrayOf(listSchema),
  SONG: songSchema,
  SONG_ARRAY: arrayOf(songSchema),
  SONG_S: songSchemaS,
  SONG_ARRAY_S: arrayOf(songSchemaS),
  SONG_BY_CURRENT: songByCurrentSchema,
  SONG_ARRAY_BY_CURRENT: arrayOf(songByCurrentSchema),
  SONG_BY_FINISHED: songByFinishedSchema,
  SONG_ARRAY_BY_FINISHED: arrayOf(songByFinishedSchema),
  SONG_BY_HISTORY_ID: songByHistoryIdSchema,
  SONG_ARRAY_BY_HISTORY_ID: arrayOf(songByHistoryIdSchema),
  ARTIST: artistSchema,
  ARTIST_ARRAY: arrayOf(artistSchema),
  SONG_BY_FOLDER_ARRAY: arrayOf(songByFolder),
  YOUTUBE_CATEGORY_ARRAY: arrayOf(youtubeCateSchema),
  YOUTUBE_SONGS_ARRAY: arrayOf(youtubeSongsSchema),
  YOUTUBE_PLAYLISTS_ARRAY: arrayOf(youtubePlaylistsSchema),
  YOUTUBE_COLLECTION_CATEGORY_ARRAY: arrayOf(collectionCateSchema),
};

export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint, method } = callAPI;
  const { schema, types, body, version } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint != 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (typeof method != 'string') {
    throw new Error('Specify a string method.');
  }

  // if (method === 'GET' && !schema) {
  //   throw new Error('Specify one of the exported Schemas.');
  // }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }

  if (!types.every( type => typeof type === 'string' )) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [ requestType, successType, failureType ] = types;
  next( actionWith({ type: requestType }) );
  return callApi({ endpoint, schema, method, body, version })
  .then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error || { msg: `Something bad happend.` }
    }))
  );
};
