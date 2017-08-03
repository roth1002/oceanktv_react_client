import { CALL_API, Schemas } from '../../middleware/api';
import {
  LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE,
  POST_REQUEST, POST_SUCCESS, POST_FAILURE,
  PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE,
  DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE,
  DELETE_QUEUE_REQUEST, DELETE_QUEUE_SUCCESS, DELETE_QUEUE_FAILURE,
  PLAYLIST_INFO_REQUEST, PLAYLIST_INFO_SUCCESS, PLAYLIST_INFO_FAILURE
} from '../../constants/ActionTypes';
import expect from 'expect';
import sinon from 'sinon';
import * as playlistActions from '../../actions/playlist';

const fakeStore = fakeData => ({
  getState() {
    return fakeData;
  }
});

describe('playlist actions', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(Date, 'now');
  });

  afterEach(() => {
    stub.restore();
  });

  it('loadPlaylist should create CALL_API action', () => {
  	stub.withArgs().returns(1234);

    expect(playlistActions.loadPlaylist('current', 1, 15)(action => action, fakeStore({})))
    .toEqual({
	    name: 'current',
	    page: 1
	  });

	  expect(playlistActions.loadPlaylist('current', 1, 15)(action => action, fakeStore({}))[CALL_API])
    .toEqual({
	    types: [LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE],
      endpoint: `/playlist?state=current&page=1&count=15&t=1234`,
      schema: Schemas.SONG_ARRAY_BY_CURRENT,
      method: 'GET',
      version: 'v2'
    });

	  expect(playlistActions.loadPlaylist('current')(action => action, fakeStore({})))
    .toEqual({
	    name: 'current',
	    page: 1
	  });

	  expect(playlistActions.loadPlaylist('current')(action => action, fakeStore({}))[CALL_API])
    .toEqual({
	    types: [LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE],
      endpoint: `/playlist?state=current&page=1&count=15&t=1234`,
      schema: Schemas.SONG_ARRAY_BY_CURRENT,
      method: 'GET',
      version: 'v2'
    });

    expect(playlistActions.loadPlaylist('finished', 1, 15)(action => action, fakeStore({})))
    .toEqual({
	    name: 'finished',
	    page: 1
	  });

	  expect(playlistActions.loadPlaylist('finished', 1, 15)(action => action, fakeStore({}))[CALL_API])
    .toEqual({
	    types: [LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE],
      endpoint: `/playlist?state=finished&page=1&count=15&t=1234`,
      schema: Schemas.SONG_ARRAY_BY_FINISHED,
      method: 'GET',
      version: 'v2'
    });

	  expect(playlistActions.loadPlaylist('finished')(action => action, fakeStore({})))
    .toEqual({
	    name: 'finished',
	    page: 1
	  });

	  expect(playlistActions.loadPlaylist('finished')(action => action, fakeStore({}))[CALL_API])
    .toEqual({
	    types: [LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE],
      endpoint: `/playlist?state=finished&page=1&count=15&t=1234`,
      schema: Schemas.SONG_ARRAY_BY_FINISHED,
      method: 'GET',
      version: 'v2'
    });
  });

  it('loadHistory should create CALL_API action', () => {
  	stub.withArgs().returns(1234);

    expect(playlistActions.loadHistory(1, 15, 'asc')(action => action, fakeStore({})))
    .toEqual({
	    name: 'history',
	    page: 1
	  });

	  expect(playlistActions.loadHistory(1, 15, 'asc')(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE],
      endpoint: `/playlist/history?page=1&count=15&order=asc&t=1234`,
      schema: Schemas.SONG_ARRAY_BY_HISTORY_ID,
      method: 'GET',
      version: 'v2'
    });

	  expect(playlistActions.loadHistory()(action => action, fakeStore({})))
    .toEqual({
	    name: 'history',
	    page: 1
	  });

	  expect(playlistActions.loadHistory()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [LOAD_PLAYLIST_REQUEST, LOAD_PLAYLIST_SUCCESS, LOAD_PLAYLIST_FAILURE],
      endpoint: `/playlist/history?page=1&count=15&order=desc&t=1234`,
      schema: Schemas.SONG_ARRAY_BY_HISTORY_ID,
      method: 'GET',
      version: 'v2'
    });
	});

  it('postSongToQueue should create CALL_API action', () => {
    expect(playlistActions.postSongToQueue(1, '豪大大', 1))
    .toEqual({
	    songName: '豪大大'
	  });

	  expect(playlistActions.postSongToQueue(1, '豪大大', 1)[CALL_API])
    .toEqual({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist`,
      body: { songid: 1, flow: 1 },
      method: 'POST',
      version: 'v2'
    });

	  expect(playlistActions.postSongToQueue(1, '豪大大'))
    .toEqual({
	    songName: '豪大大'
	  });

	  expect(playlistActions.postSongToQueue(1, '豪大大')[CALL_API])
    .toEqual({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist`,
      body: { songid: 1, flow: 0 },
      method: 'POST',
      version: 'v2'
    });
	});

  it('postSongArrayToQueue should create CALL_API action', () => {
    expect(playlistActions.postSongArrayToQueue([{id:'AA'}, {id:'BB'}]))
    .toEqual({
	    [CALL_API]: {
	      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
	      endpoint: `/playlist/multimode`,
	      body: { list: JSON.stringify({ list: [{id:'AA'}, {id:'BB'}]}) },
	      method: 'POST',
        version: 'v2'
	    }
	  });
	});

  it('putSongToQueue should create CALL_API action', () => {
    expect(playlistActions.putSongToQueue(1, '豪大大', 1))
    .toEqual({
	    songName: '豪大大'
	  });

	  expect(playlistActions.putSongToQueue(1, '豪大大', 1)[CALL_API])
    .toEqual({
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/playlist`,
      body: { songid: 1, flow: 1 },
      method: 'PUT',
      version: 'v2'
    });

	  expect(playlistActions.putSongToQueue(1, '豪大大'))
    .toEqual({
	    songName: '豪大大'
	  });

	  expect(playlistActions.putSongToQueue(1, '豪大大')[CALL_API])
    .toEqual({
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/playlist`,
      body: { songid: 1, flow: 0 },
      method: 'PUT',
      version: 'v2'
    });
	});

  it('putSongArrayToQueue should create CALL_API action', () => {
    expect(playlistActions.putSongArrayToQueue([{id:'AA'}, {id:'BB'}]))
    .toEqual({
    	next: 'next'
	  });

	  expect(playlistActions.putSongArrayToQueue([{id:'AA'}, {id:'BB'}])[CALL_API])
    .toEqual({
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/playlist/multimode`,
      body: { list: JSON.stringify({ list: [{id:'AA'}, {id:'BB'}]}) },
      method: 'PUT'
    });
	});

  it('deleteSongFromQueue should create CALL_API action', () => {
    expect(playlistActions.deleteSongFromQueue(1, 1, '豪大大'))
    .toEqual({
	    songName: '豪大大'
	  });

	  expect(playlistActions.deleteSongFromQueue(1, 1, '豪大大')[CALL_API])
    .toEqual({
      types: [DELETE_QUEUE_REQUEST, DELETE_QUEUE_SUCCESS, DELETE_QUEUE_FAILURE],
      endpoint: `/playlist?songid=1&index=1`,
      method: 'DELETE',
      version: 'v2'
    });
	});

  it('deleteSongArrayFromQueue should create CALL_API action', () => {
    expect(playlistActions.deleteSongArrayFromQueue([{id:'AA'}, {id:'BB'}])[CALL_API])
    .toEqual({
      types: [DELETE_QUEUE_REQUEST, DELETE_QUEUE_SUCCESS, DELETE_QUEUE_FAILURE],
      endpoint: `/playlist/multimode/delete`,
      body: { list: JSON.stringify({ list: [{id:'AA'}, {id:'BB'}]}) },
      method: 'POST'
    });
	});

 	it('postFavoriteToQueue should create CALL_API action', () => {
    expect(playlistActions.postFavoriteToQueue(1, 'add', true))
    .toEqual({
	    mode: 'add'
	  });

	  expect(playlistActions.postFavoriteToQueue(1, 'add', true)[CALL_API])
    .toEqual({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist/favorite/1`,
      method: 'POST',
      body: { mode: 'add', random: true }
    });
	});

  it('fetchPlaylistInfo should create CALL_API action', () => {
  	stub.withArgs().returns(1234);

    expect(playlistActions.fetchPlaylistInfo())
    .toEqual({
	    [CALL_API]: {
	      types: [PLAYLIST_INFO_REQUEST, PLAYLIST_INFO_SUCCESS, PLAYLIST_INFO_FAILURE],
	      endpoint: `/playlist/info`,
	      method: 'GET',
        version: 'v2'
	    }
	  });
	});

  it('postYoutubeSongToQueue should create CALL_API action', () => {
    expect(playlistActions.postYoutubeSongToQueue(1, '豪大大', 1))
    .toEqual({
      songName: '豪大大'
    });

    expect(playlistActions.postYoutubeSongToQueue(1, '豪大大', 1)[CALL_API])
    .toEqual({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist`,
      body: { songid: 1, source_type: 1 },
      method: 'POST',
      version: 'v2'
    });

    expect(playlistActions.postYoutubeSongToQueue(1, '豪大大'))
    .toEqual({
      songName: '豪大大'
    });

    expect(playlistActions.postYoutubeSongToQueue(1, '豪大大')[CALL_API])
    .toEqual({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/playlist`,
      body: { songid: 1, source_type: 1 },
      method: 'POST',
      version: 'v2'
    });
  });

  it('putYoutubeSongToQueue should create CALL_API action', () => {
    expect(playlistActions.putYoutubeSongToQueue(1, '豪大大', 1))
    .toEqual({
      songName: '豪大大'
    });

    expect(playlistActions.putYoutubeSongToQueue(1, '豪大大', 1)[CALL_API])
    .toEqual({
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/playlist`,
      body: { songid: 1, source_type: 1 },
      method: 'PUT',
      version: 'v2'
    });

    expect(playlistActions.putYoutubeSongToQueue(1, '豪大大'))
    .toEqual({
      songName: '豪大大'
    });

    expect(playlistActions.putYoutubeSongToQueue(1, '豪大大')[CALL_API])
    .toEqual({
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/playlist`,
      body: { songid: 1, source_type: 1 },
      method: 'PUT',
      version: 'v2'
    });
  });

  it('postYoutubePlaylistToQueue should create CALL_API action', () => {
    expect(playlistActions.postYoutubePlaylistToQueue({}))
    .toEqual({
      [CALL_API]: {
        types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
        endpoint: `/playlist/ktvcloud/list/0`,
        body: { mode: 'add' },
        method: 'POST',
        version: 'v2'
      }
    });
    expect(playlistActions.postYoutubePlaylistToQueue({ id: 1000, mode: 'XXX'}))
    .toEqual({
      [CALL_API]: {
        types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
        endpoint: `/playlist/ktvcloud/list/1000`,
        body: { mode: 'XXX' },
        method: 'POST',
        version: 'v2'
      }
    });
    expect(playlistActions.postYoutubePlaylistToQueue({ id: 1000 }))
    .toEqual({
      [CALL_API]: {
        types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
        endpoint: `/playlist/ktvcloud/list/1000`,
        body: { mode: 'add' },
        method: 'POST',
        version: 'v2'
      }
    });
  });
});
