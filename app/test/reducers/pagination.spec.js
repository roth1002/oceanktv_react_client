import { expect } from 'chai';
import union from 'lodash/union';
import paginationReducers from '../../reducers/pagination';
import {
       SONGS_BY_KEYWORD_REQUEST,       SONGS_BY_KEYWORD_SUCCESS,       SONGS_BY_KEYWORD_FAILURE,
        SONGS_BY_ARTIST_REQUEST,        SONGS_BY_ARTIST_SUCCESS,        SONGS_BY_ARTIST_FAILURE,
          SONGS_BY_LANG_REQUEST,          SONGS_BY_LANG_SUCCESS,          SONGS_BY_LANG_FAILURE,
           SONGS_BY_ALL_REQUEST,           SONGS_BY_ALL_SUCCESS,           SONGS_BY_ALL_FAILURE,
    SONGS_FROM_FAVORITE_REQUEST,    SONGS_FROM_FAVORITE_SUCCESS,    SONGS_FROM_FAVORITE_FAILURE,
          LOAD_PLAYLIST_REQUEST,          LOAD_PLAYLIST_SUCCESS,          LOAD_PLAYLIST_FAILURE,
     ARTISTS_BY_KEYWORD_REQUEST,     ARTISTS_BY_KEYWORD_SUCCESS,     ARTISTS_BY_KEYWORD_FAILURE,
  ARTISTS_BY_ARTISTTYPE_REQUEST,  ARTISTS_BY_ARTISTTYPE_SUCCESS,  ARTISTS_BY_ARTISTTYPE_FAILURE,
             LISTS_ELSE_REQUEST,             LISTS_ELSE_SUCCESS,             LISTS_ELSE_FAILURE,
   GET_YOUTUBE_CATEGORY_REQUEST,   GET_YOUTUBE_CATEGORY_SUCCESS,   GET_YOUTUBE_CATEGORY_FAILURE,
   GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST, GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS, GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE,
   GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_REQUEST, GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_SUCCESS, GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_FAILURE,
   GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_REQUEST, GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_SUCCESS, GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_FAILURE,
   GET_SONGS_FROM_YOUTUBE_DATAAPI_REQUEST, GET_SONGS_FROM_YOUTUBE_DATAAPI_SUCCESS, GET_SONGS_FROM_YOUTUBE_DATAAPI_FAILURE,
   COLLECTION_FROM_YOUTUBE_REQUEST, COLLECTION_FROM_YOUTUBE_SUCCESS, COLLECTION_FROM_YOUTUBE_FAILURE
} from '../../constants/ActionTypes';

const initialState = {
  songsByKeyword: {},
  songsByArtist: {},
  songsByLang: {},
  songsByFolder: {},
  songsFromFavorite: {},
  songsFromPlaylist: {},
  artistsByKeyword: {},
  artistsByType: {},
  listsElse: {},
  songsFromYoutube: {},
  youtubeCategory: {},
  playlistsFromYoutube: {},
  songsFromPlaylistOfYoutube: {},
  videosFromYoutube: {},
  collectionFromYoutube: {}
};

const requestState = { isFetching: true, ids: [] };
const failState = { isFetching: false, ids: [] };
const fakeSuccessResponse = { result: ['id-1','id-2','id-3','id-4','id-5'], total: 5 };


describe('pagination reducers', () => {
  it('should handle initial state', () => {
    expect( paginationReducers(undefined, {}) ).to.deep.equal(initialState);
  });


  describe('songsByKeyword reducer', () => {
    it('should handle SONGS_BY_KEYWORD_REQUEST', () => {
      expect(
        paginationReducers(initialState, { type: SONGS_BY_KEYWORD_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByKeyword: { search: requestState }})
      );
    });

    it('should handle SONGS_BY_KEYWORD_SUCCESS', () => {
      const action = {
        type: SONGS_BY_KEYWORD_SUCCESS,
        page: 2,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByKeyword: { search: successState }})
      );
    });

    it('should handle append SONGS_BY_KEYWORD_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { songsByKeyword: { search: { ids:['test','id-1'] }}});
      const action = {
        append: true,
        type: SONGS_BY_KEYWORD_SUCCESS,
        page: 2,
        response: fakeSuccessResponse
      };
      const orignalIds = modifiedState.songsByKeyword.search.ids;
      const successState = {
        isFetching: false,
        ids: union(orignalIds, action.response.result),
        page: action.page,
        total: action.response.total
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByKeyword: { search: successState }})
      );
    });

    it('should handle SONGS_BY_KEYWORD_FAILURE', () => {
      expect(
        paginationReducers(initialState, { type: SONGS_BY_KEYWORD_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByKeyword: { search: failState }})
      );
    });
  });


  describe('songsByArtist reducer', () => {
    it('should throw error if type of action.artistId is not a string', () => {
      try {
        paginationReducers(initialState, { artistId: 1, type: SONGS_BY_ARTIST_REQUEST })
      } catch (e) {
        expect(e.message).to.equal('Expected key to be a string.');
      }
    });

    it('should handle SONGS_BY_ARTIST_REQUEST', () => {
      expect(
        paginationReducers(initialState, { artistId: 'Amei', type: SONGS_BY_ARTIST_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByArtist: { Amei: requestState }})
      );
    });

    it('should handle SONGS_BY_ARTIST_SUCCESS', () => {
      const action = {
        artistId: 'Amei',
        type: SONGS_BY_ARTIST_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByArtist: { Amei: successState }})
      );
    });

    it('should handle append SONGS_BY_ARTIST_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { songsByArtist: { Amei: { ids:['test','id-1'] }}});
      const action = {
        append: true,
        artistId: 'Amei',
        type: SONGS_BY_ARTIST_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const orignalIds = modifiedState.songsByArtist[action.artistId].ids;
      const successState = {
        isFetching: false,
        ids: union(orignalIds, action.response.result),
        page: action.page,
        total: action.response.total
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByArtist: { Amei: successState }})
      );
    });

    it('should handle SONGS_BY_ARTIST_FAILURE', () => {
      expect(
        paginationReducers(initialState, { artistId: 'Amei', type: SONGS_BY_ARTIST_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByArtist: { Amei: failState }})
      );
    });
  });


  describe('songsByLang reducer', () => {
    it('should throw error if type of action.lang is not a string', () => {
      try {
        paginationReducers(initialState, { lang: 1, type: SONGS_BY_LANG_REQUEST })
      } catch (e) {
        expect(e.message).to.equal('Expected key to be a string.');
      }
    });

    it('should handle SONGS_BY_LANG_REQUEST', () => {
      expect(
        paginationReducers(initialState, { lang: 'zh-TW', type: SONGS_BY_LANG_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByLang: { 'zh-TW': requestState }})
      );
    });

    it('should handle SONGS_BY_LANG_SUCCESS', () => {
      const action = {
        lang: 'zh-TW',
        type: SONGS_BY_LANG_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByLang: { 'zh-TW': successState }})
      );
    });

    it('should handle append SONGS_BY_LANG_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { songsByLang: { 'zh-TW': { ids:['test','id-1'] }}});
      const action = {
        append: true,
        lang: 'zh-TW',
        type: SONGS_BY_LANG_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const orignalIds = modifiedState.songsByLang[action.lang].ids;
      const successState = {
        isFetching: false,
        ids: union(orignalIds, action.response.result),
        page: action.page,
        total: action.response.total
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByLang: { 'zh-TW': successState }})
      );
    });

    it('should handle SONGS_BY_LANG_FAILURE', () => {
      expect(
        paginationReducers(initialState, { lang: 'zh-TW', type: SONGS_BY_LANG_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByLang: { 'zh-TW': failState }})
      );
    });
  });


  describe('songsByFolder reducer', () => {
    it('should throw error if type of action.path is not a string', () => {
      try {
        paginationReducers(initialState, { path: 1, type: SONGS_BY_ALL_REQUEST })
      } catch (e) {
        expect(e.message).to.equal('Expected key to be a string.');
      }
    });

    it('should handle SONGS_BY_ALL_REQUEST', () => {
      expect(
        paginationReducers(initialState, { path: 'nas/hd/folder', type: SONGS_BY_ALL_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByFolder: { 'nas/hd/folder': requestState }})
      );
    });

    it('should handle SONGS_BY_ALL_SUCCESS', () => {
      const action = {
        path: 'nas/hd/folder',
        type: SONGS_BY_ALL_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByFolder: { 'nas/hd/folder': successState }})
      );
    });

    it('should handle append SONGS_BY_ALL_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { songsByFolder: { 'nas/hd/folder': { ids:['test','id-1'] }}});
      const action = {
        append: true,
        path: 'nas/hd/folder',
        type: SONGS_BY_ALL_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const orignalIds = modifiedState.songsByFolder[action.path].ids;
      const successState = {
        isFetching: false,
        ids: union(orignalIds, action.response.result),
        page: action.page,
        total: action.response.total
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByFolder: { 'nas/hd/folder': successState }})
      );
    });

    it('should handle SONGS_BY_ALL_FAILURE', () => {
      expect(
        paginationReducers(initialState, { path: 'nas/hd/folder', type: SONGS_BY_ALL_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsByFolder: { 'nas/hd/folder': failState }})
      );
    });
  });


  describe('songsFromFavorite reducer', () => {
    it('should throw error if type of action.favorId is not a string', () => {
      try {
        paginationReducers(initialState, { favorId: 1, type: SONGS_FROM_FAVORITE_REQUEST })
      } catch (e) {
        expect(e.message).to.equal('Expected key to be a string.');
      }
    });

    it('should handle SONGS_FROM_FAVORITE_REQUEST', () => {
      expect(
        paginationReducers(initialState, { favorId: 'iPod', type: SONGS_FROM_FAVORITE_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromFavorite: { 'iPod': requestState }})
      );
    });

    it('should handle SONGS_FROM_FAVORITE_SUCCESS', () => {
      const action = {
        favorId: 'iPod',
        type: SONGS_FROM_FAVORITE_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromFavorite: { 'iPod': successState }})
      );
    });

    it('should handle append SONGS_FROM_FAVORITE_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { songsFromFavorite: { 'iPod': { ids:['test','id-1'] }}});
      const action = {
        append: true,
        favorId: 'iPod',
        type: SONGS_FROM_FAVORITE_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const orignalIds = modifiedState.songsFromFavorite[action.favorId].ids;
      const successState = {
        isFetching: false,
        ids: union(orignalIds, action.response.result),
        page: action.page,
        total: action.response.total
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromFavorite: { 'iPod': successState }})
      );
    });

    it('should handle SONGS_FROM_FAVORITE_FAILURE', () => {
      expect(
        paginationReducers(initialState, { favorId: 'iPod', type: SONGS_FROM_FAVORITE_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromFavorite: { 'iPod': failState }})
      );
    });
  });


  describe('songsFromPlaylist reducer', () => {
    it('should throw error if type of action.name is not a string', () => {
      try {
        paginationReducers(initialState, { name: 1, type: LOAD_PLAYLIST_REQUEST })
      } catch (e) {
        expect(e.message).to.equal('Expected key to be a string.');
      }
    });

    it('should handle LOAD_PLAYLIST_REQUEST', () => {
      expect(
        paginationReducers(initialState, { name: 'iPlaylist', type: LOAD_PLAYLIST_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromPlaylist: { 'iPlaylist': requestState }})
      );
    });

    it('should handle LOAD_PLAYLIST_SUCCESS', () => {
      const action = {
        name: 'iPlaylist',
        type: LOAD_PLAYLIST_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromPlaylist: { 'iPlaylist': successState }})
      );
    });

    it('should handle append LOAD_PLAYLIST_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { songsFromPlaylist: { 'iPlaylist': { ids:['test','id-1'] }}});
      const action = {
        append: true,
        name: 'iPlaylist',
        type: LOAD_PLAYLIST_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const orignalIds = modifiedState.songsFromPlaylist[action.name].ids;
      const successState = {
        isFetching: false,
        ids: union(orignalIds, action.response.result),
        page: action.page,
        total: action.response.total
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromPlaylist: { 'iPlaylist': successState }})
      );
    });

    it('should handle LOAD_PLAYLIST_FAILURE', () => {
      expect(
        paginationReducers(initialState, { name: 'iPlaylist', type: LOAD_PLAYLIST_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromPlaylist: { 'iPlaylist': failState }})
      );
    });
  });


  describe('artistsByKeyword reducer', () => {
    it('should handle ARTISTS_BY_KEYWORD_REQUEST', () => {
      expect(
        paginationReducers(initialState, { type: ARTISTS_BY_KEYWORD_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { artistsByKeyword: { search: requestState }})
      );
    });

    it('should handle ARTISTS_BY_KEYWORD_SUCCESS', () => {
      const action = {
        type: ARTISTS_BY_KEYWORD_SUCCESS,
        page: 2,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { artistsByKeyword: { search: successState }})
      );
    });

    it('should handle append ARTISTS_BY_KEYWORD_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { artistsByKeyword: { search: { ids:['test','id-1'] }}});
      const action = {
        append: true,
        type: ARTISTS_BY_KEYWORD_SUCCESS,
        page: 2,
        response: fakeSuccessResponse
      };
      const orignalIds = modifiedState.artistsByKeyword.search.ids;
      const successState = {
        isFetching: false,
        ids: union(orignalIds, action.response.result),
        page: action.page,
        total: action.response.total
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { artistsByKeyword: { search: successState }})
      );
    });

    it('should handle ARTISTS_BY_KEYWORD_FAILURE', () => {
      expect(
        paginationReducers(initialState, { type: ARTISTS_BY_KEYWORD_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { artistsByKeyword: { search: failState }})
      );
    });
  });


  describe('artistsByType reducer', () => {
    it('should throw error if type of action.artistType is not a string', () => {
      try {
        paginationReducers(initialState, { artistType: 1, type: ARTISTS_BY_ARTISTTYPE_REQUEST })
      } catch (e) {
        expect(e.message).to.equal('Expected key to be a string.');
      }
    });

    it('should handle ARTISTS_BY_ARTISTTYPE_REQUEST', () => {
      expect(
        paginationReducers(initialState, { artistType: 'group', type: ARTISTS_BY_ARTISTTYPE_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { artistsByType: { 'group': requestState }})
      );
    });

    it('should handle ARTISTS_BY_ARTISTTYPE_SUCCESS', () => {
      const action = {
        artistType: 'group',
        type: ARTISTS_BY_ARTISTTYPE_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { artistsByType: { 'group': successState }})
      );
    });

    it('should handle append ARTISTS_BY_ARTISTTYPE_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { artistsByType: { 'group': { ids:['test','id-1'] }}});
      const action = {
        append: true,
        artistType: 'group',
        type: ARTISTS_BY_ARTISTTYPE_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const orignalIds = modifiedState.artistsByType[action.artistType].ids;
      const successState = {
        isFetching: false,
        ids: union(orignalIds, action.response.result),
        page: action.page,
        total: action.response.total
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { artistsByType: { 'group': successState }})
      );
    });

    it('should handle ARTISTS_BY_ARTISTTYPE_FAILURE', () => {
      expect(
        paginationReducers(initialState, { artistType: 'group', type: ARTISTS_BY_ARTISTTYPE_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { artistsByType: { 'group': failState }})
      );
    });
  });


  describe('listsElse reducer', () => {
    it('should throw error if type of action.name is not a string', () => {
      try {
        paginationReducers(initialState, { name: 1, type: LISTS_ELSE_REQUEST })
      } catch (e) {
        expect(e.message).to.equal('Expected key to be a string.');
      }
    });

    it('should handle LISTS_ELSE_REQUEST', () => {
      expect(
        paginationReducers(initialState, { name: 'MAROON 5', type: LISTS_ELSE_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { listsElse: { 'MAROON 5': requestState }})
      );
    });

    it('should handle LISTS_ELSE_SUCCESS', () => {
      const action = {
        name: 'MAROON 5',
        type: LISTS_ELSE_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { listsElse: { 'MAROON 5': successState }})
      );
    });

    it('should handle append LISTS_ELSE_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { listsElse: { 'MAROON 5': { ids:['test','id-1'] }}});
      const action = {
        append: true,
        name: 'MAROON 5',
        type: LISTS_ELSE_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const orignalIds = modifiedState.listsElse[action.name].ids;
      const successState = {
        isFetching: false,
        ids: union(orignalIds, action.response.result),
        page: action.page,
        total: action.response.total
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { listsElse: { 'MAROON 5': successState }})
      );
    });

    it('should handle LISTS_ELSE_FAILURE', () => {
      expect(
        paginationReducers(initialState, { name: 'MAROON 5', type: LISTS_ELSE_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { listsElse: { 'MAROON 5': failState }})
      );
    });
  });

  describe('youtubeCategory reducer', () => {

    it('should handle GET_YOUTUBE_CATEGORY_REQUEST', () => {
      expect(
        paginationReducers(initialState, { type: GET_YOUTUBE_CATEGORY_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { youtubeCategory: { 'category': requestState }})
      );
    });

    it('should handle GET_YOUTUBE_CATEGORY_SUCCESS', () => {
      const action = {
        type: GET_YOUTUBE_CATEGORY_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { youtubeCategory: { 'category': successState }})
      );
    });

    it('should handle append GET_YOUTUBE_CATEGORY_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { youtubeCategory: { 'category': { ids:['test','id-1'] }}});
      const action = {
        type: GET_YOUTUBE_CATEGORY_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { youtubeCategory: { 'category': successState }})
      );
    });

    it('should handle GET_YOUTUBE_CATEGORY_FAILURE', () => {
      expect(
        paginationReducers(initialState, { type: GET_YOUTUBE_CATEGORY_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { youtubeCategory: { 'category': failState }})
      );
    });
  });

  describe('songsFromYoutube reducer', () => {

    it('should handle GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST', () => {
      expect(
        paginationReducers(initialState, { type: GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromYoutube: { 'songs': requestState }})
      );
    });

    it('should handle GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS', () => {
      const action = {
        type: GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromYoutube: { 'songs': successState }})
      );
    });

    it('should handle append GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { songsFromYoutube: { 'songs': { ids:['test','id-1'] }}});
      const action = {
        type: GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromYoutube: { 'songs': successState }})
      );
    });

    it('should handle GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE', () => {
      expect(
        paginationReducers(initialState, { type: GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromYoutube: { 'songs': failState }})
      );
    });
  });

  describe('playlistsFromYoutube reducer', () => {

    it('should handle GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_REQUEST', () => {
      expect(
        paginationReducers(initialState, { type: GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_REQUEST, searchType: 'ABC' })
      ).to.deep.equal(
        Object.assign({}, initialState, { playlistsFromYoutube: { 'ABC': requestState }})
      );
    });

    it('should handle GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_SUCCESS', () => {
      const action = {
        type: GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_SUCCESS,
        page: 1,
        response: fakeSuccessResponse,
        searchType: 'ABC'
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { playlistsFromYoutube: { 'ABC': successState }})
      );
    });

    it('should handle append GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { playlistsFromYoutube: { 'ABC': { ids:['test','id-1'] }}});
      const action = {
        type: GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_SUCCESS,
        page: 1,
        response: fakeSuccessResponse,
        searchType: 'ABC'
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { playlistsFromYoutube: { 'ABC': successState }})
      );
    });

    it('should handle GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_FAILURE', () => {
      expect(
        paginationReducers(initialState, { type: GET_PLAYLISTS_FROM_YOUTUBE_DATAAPI_FAILURE, searchType: 'ABC' })
      ).to.deep.equal(
        Object.assign({}, initialState, { playlistsFromYoutube: { 'ABC': failState }})
      );
    });
  });

  describe('songsFromPlaylistOfYoutube reducer', () => {

    it('should handle GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_REQUEST', () => {
      expect(
        paginationReducers(initialState, { type: GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_REQUEST, searchType: 'ABC' })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromPlaylistOfYoutube: { 'songsofpvid': requestState }})
      );
    });

    it('should handle GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_SUCCESS', () => {
      const action = {
        type: GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_SUCCESS,
        page: 1,
        response: fakeSuccessResponse,
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromPlaylistOfYoutube: { 'songsofpvid': successState }})
      );
    });

    it('should handle append GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { songsFromPlaylistOfYoutube: { 'songsofpvid': { ids:['test','id-1'] }}});
      const action = {
        type: GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromPlaylistOfYoutube: { 'songsofpvid': successState }})
      );
    });

    it('should handle GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_FAILURE', () => {
      expect(
        paginationReducers(initialState, { type: GET_SONGS_FROM_PLAYLISTS_OF_YOUTUBE_DATAAPI_FAILURE, searchType: 'ABC' })
      ).to.deep.equal(
        Object.assign({}, initialState, { songsFromPlaylistOfYoutube: { 'songsofpvid': failState }})
      );
    });
  });

  describe('videosFromYoutube reducer', () => {

    it('should handle GET_SONGS_FROM_YOUTUBE_DATAAPI_REQUEST', () => {
      expect(
        paginationReducers(initialState, { type: GET_SONGS_FROM_YOUTUBE_DATAAPI_REQUEST, searchType: 'ABC' })
      ).to.deep.equal(
        Object.assign({}, initialState, { videosFromYoutube: { 'ABC': requestState }})
      );
    });

    it('should handle GET_SONGS_FROM_YOUTUBE_DATAAPI_SUCCESS', () => {
      const action = {
        type: GET_SONGS_FROM_YOUTUBE_DATAAPI_SUCCESS,
        page: 1,
        response: fakeSuccessResponse,
        searchType: 'ABC'
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { videosFromYoutube: { 'ABC': successState }})
      );
    });

    it('should handle append GET_SONGS_FROM_YOUTUBE_DATAAPI_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { videosFromYoutube: { 'ABC': { ids:['test','id-1'] }}});
      const action = {
        type: GET_SONGS_FROM_YOUTUBE_DATAAPI_SUCCESS,
        page: 1,
        response: fakeSuccessResponse,
        searchType: 'ABC'
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { videosFromYoutube: { 'ABC': successState }})
      );
    });

    it('should handle GET_SONGS_FROM_YOUTUBE_DATAAPI_FAILURE', () => {
      expect(
        paginationReducers(initialState, { type: GET_SONGS_FROM_YOUTUBE_DATAAPI_FAILURE, searchType: 'ABC' })
      ).to.deep.equal(
        Object.assign({}, initialState, { videosFromYoutube: { 'ABC': failState }})
      );
    });
  });

  describe('collectionFromYoutube reducer', () => {

    it('should handle COLLECTION_FROM_YOUTUBE_REQUEST', () => {
      expect(
        paginationReducers(initialState, { type: COLLECTION_FROM_YOUTUBE_REQUEST, searchType: 'ABC' })
      ).to.deep.equal(
        Object.assign({}, initialState, { collectionFromYoutube: { 'collection': requestState }})
      );
    });

    it('should handle COLLECTION_FROM_YOUTUBE_SUCCESS', () => {
      const action = {
        type: COLLECTION_FROM_YOUTUBE_SUCCESS,
        page: 1,
        response: fakeSuccessResponse,
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(initialState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { collectionFromYoutube: { 'collection': successState }})
      );
    });

    it('should handle append COLLECTION_FROM_YOUTUBE_SUCCESS', () => {
      const modifiedState = Object.assign({}, initialState, { collectionFromYoutube: { 'collection': { ids:['test','id-1'] }}});
      const action = {
        type: COLLECTION_FROM_YOUTUBE_SUCCESS,
        page: 1,
        response: fakeSuccessResponse
      };
      const successState = {
        isFetching: false,
        ids: action.response.result,
        page: action.page,
        total: action.response.total,
        paging: { nextPage: null, prevPage: null },
        endpoint: ''
      };
      expect(
        paginationReducers(modifiedState, action)
      ).to.deep.equal(
        Object.assign({}, initialState, { collectionFromYoutube: { 'collection': successState }})
      );
    });

    it('should handle COLLECTION_FROM_YOUTUBE_FAILURE', () => {
      expect(
        paginationReducers(initialState, { type: COLLECTION_FROM_YOUTUBE_FAILURE, searchType: 'ABC' })
      ).to.deep.equal(
        Object.assign({}, initialState, { collectionFromYoutube: { 'collection': failState }})
      );
    });
  });

});