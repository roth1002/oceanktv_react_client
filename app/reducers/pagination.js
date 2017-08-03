import { combineReducers } from 'redux';
import paginate from './paginate';
import * as ActionTypes from '../constants/ActionTypes';

const pagination = combineReducers({
  songsByKeyword: paginate({
    mapActionToKey: action => 'search',
    types: [ActionTypes.SONGS_BY_KEYWORD_REQUEST, ActionTypes.SONGS_BY_KEYWORD_SUCCESS, ActionTypes.SONGS_BY_KEYWORD_FAILURE]
  }),
  songsByArtist: paginate({
    mapActionToKey: action => action.artistId,
    types: [ActionTypes.SONGS_BY_ARTIST_REQUEST, ActionTypes.SONGS_BY_ARTIST_SUCCESS, ActionTypes.SONGS_BY_ARTIST_FAILURE]
  }),
  songsByLang: paginate({
    mapActionToKey: action => action.lang,
    types: [ActionTypes.SONGS_BY_LANG_REQUEST, ActionTypes.SONGS_BY_LANG_SUCCESS, ActionTypes.SONGS_BY_LANG_FAILURE]
  }),
  songsByFolder: paginate({
    mapActionToKey: action => action.path,
    types: [ActionTypes.SONGS_BY_ALL_REQUEST, ActionTypes.SONGS_BY_ALL_SUCCESS, ActionTypes.SONGS_BY_ALL_FAILURE]
  }),
  songsFromFavorite: paginate({
    mapActionToKey: action => action.favorId,
    types: [ActionTypes.SONGS_FROM_FAVORITE_REQUEST, ActionTypes.SONGS_FROM_FAVORITE_SUCCESS, ActionTypes.SONGS_FROM_FAVORITE_FAILURE]
  }),
  songsFromPlaylist: paginate({
    mapActionToKey: action => action.name,
    types: [ActionTypes.LOAD_PLAYLIST_REQUEST, ActionTypes.LOAD_PLAYLIST_SUCCESS, ActionTypes.LOAD_PLAYLIST_FAILURE]
  }),
  artistsByKeyword: paginate({
    mapActionToKey: action => 'search',
    types: [ActionTypes.ARTISTS_BY_KEYWORD_REQUEST, ActionTypes.ARTISTS_BY_KEYWORD_SUCCESS, ActionTypes.ARTISTS_BY_KEYWORD_FAILURE]
  }),
  artistsByType: paginate({
    mapActionToKey: action => action.artistType,
    types: [ActionTypes.ARTISTS_BY_ARTISTTYPE_REQUEST, ActionTypes.ARTISTS_BY_ARTISTTYPE_SUCCESS, ActionTypes.ARTISTS_BY_ARTISTTYPE_FAILURE]
  }),
  listsElse: paginate({
    mapActionToKey: action => action.name,
    types: [ActionTypes.LISTS_ELSE_REQUEST, ActionTypes.LISTS_ELSE_SUCCESS, ActionTypes.LISTS_ELSE_FAILURE]
  }),
  youtubeCategory: paginate({
    mapActionToKey: action => 'category',
    types: [ActionTypes.GET_YOUTUBE_CATEGORY_REQUEST, ActionTypes.GET_YOUTUBE_CATEGORY_SUCCESS, ActionTypes.GET_YOUTUBE_CATEGORY_FAILURE]
  }),
  songsFromYoutube: paginate({
    mapActionToKey: action => 'songs',
    types: [ActionTypes.GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST, ActionTypes.GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS, ActionTypes.GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE]
  }),
  playlistsFromYoutube: paginate({
    mapActionToKey: action => action.searchType,
    types: [ActionTypes.GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_REQUEST, ActionTypes.GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_SUCCESS, ActionTypes.GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_FAILURE]
  }),
  songsFromPlaylistOfYoutube: paginate({
    mapActionToKey: action => 'songsofpvid',
    types: [ActionTypes.GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_REQUEST, ActionTypes.GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_SUCCESS, ActionTypes.GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_FAILURE]
  }),
  videosFromYoutube: paginate({
    mapActionToKey: action => action.searchType,
    types: [ActionTypes.GET_SONGS_FROM_YOUTUBE_DATAAPI_REQUEST, ActionTypes.GET_SONGS_FROM_YOUTUBE_DATAAPI_SUCCESS, ActionTypes.GET_SONGS_FROM_YOUTUBE_DATAAPI_FAILURE]
  }),
  collectionFromYoutube: paginate({
    mapActionToKey: action => 'collection',
    types: [ActionTypes.COLLECTION_FROM_YOUTUBE_REQUEST, ActionTypes.COLLECTION_FROM_YOUTUBE_SUCCESS, ActionTypes.COLLECTION_FROM_YOUTUBE_FAILURE]
  }),
});

export default pagination;
