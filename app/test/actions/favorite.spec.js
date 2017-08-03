import { expect } from 'chai';
import sinon from 'sinon';
import { CALL_API, Schemas } from '../../middleware/api';
import {
  SONGS_FROM_FAVORITE_REQUEST, SONGS_FROM_FAVORITE_SUCCESS, SONGS_FROM_FAVORITE_FAILURE,
  LISTS_ELSE_REQUEST, LISTS_ELSE_SUCCESS, LISTS_ELSE_FAILURE,
  POST_REQUEST, POST_SUCCESS, POST_FAILURE,
  PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE,
  DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE,
  EDIT_FAVORITE_NAME_REQUEST, EDIT_FAVORITE_NAME_SUCCESS, EDIT_FAVORITE_NAME_FAILURE,
  GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST, GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS, GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE,
  COLLECTION_FROM_YOUTUBE_REQUEST, COLLECTION_FROM_YOUTUBE_SUCCESS, COLLECTION_FROM_YOUTUBE_FAILURE
} from '../../constants/ActionTypes';
import * as favorActions from '../../actions/favorite';

const fakeStore = fakeData => ({
  getState() {
    return fakeData;
  }
});

describe('favorites actions', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(Date, 'now');
  });

  afterEach(() => {
    stub.restore();
  });

	it('loadSongsFromFavorite should create CALL_API action', () => {
		stub.withArgs().returns(1234);

		expect(favorActions.loadSongsFromFavorite(1, 1, 15)(action => action, fakeStore({})))
		.to.deep.equal({
			page: 1,
			favorId: 1
		});

		expect(favorActions.loadSongsFromFavorite(1, 1, 15)(action => action, fakeStore({}))[CALL_API])
		.to.deep.equal({
			types: [SONGS_FROM_FAVORITE_REQUEST, SONGS_FROM_FAVORITE_SUCCESS, SONGS_FROM_FAVORITE_FAILURE],
      endpoint: `/favorite/1?page=1&count=15&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
	  });

		expect(favorActions.loadSongsFromFavorite(1)(action => action, fakeStore({})))
		.to.deep.equal({
			page: 1,
			favorId: 1
		});

		expect(favorActions.loadSongsFromFavorite(1)(action => action, fakeStore({}))[CALL_API])
		.to.deep.equal({
			types: [SONGS_FROM_FAVORITE_REQUEST, SONGS_FROM_FAVORITE_SUCCESS, SONGS_FROM_FAVORITE_FAILURE],
      endpoint: `/favorite/1?page=1&count=15&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })
	});

	it('loadListFromFavorite should create CALL_API action', () => {
		stub.withArgs().returns(1234);

		expect(favorActions.loadListFromFavorite()(action => action, fakeStore({})))
		.to.deep.equal({
			name: 'favorite'
		})

		expect(favorActions.loadListFromFavorite()(action => action, fakeStore({}))[CALL_API])
		.to.deep.equal({
			types: [LISTS_ELSE_REQUEST, LISTS_ELSE_SUCCESS, LISTS_ELSE_FAILURE],
      endpoint: `/favorite?t=1234`,
      schema: Schemas.LIST_ARRAY,
      method: 'GET'
    })
	});

	it('putSongToFavorite should create CALL_API action', () => {
		expect(favorActions.putSongToFavorite(1,1,'AA','BB',1))
		.to.deep.equal({
	    name: 'AA',
	    favorName: 'BB'
	  });

	  expect(favorActions.putSongToFavorite(1,1,'AA','BB',1)[CALL_API])
		.to.deep.equal({
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/favorite/1?songid=1&flow=1`,
      method: 'PUT'
    });

	  expect(favorActions.putSongToFavorite(1,1,'AA','BB'))
		.to.deep.equal({
	    name: 'AA',
	    favorName: 'BB'
	  });

	  expect(favorActions.putSongToFavorite(1,1,'AA','BB')[CALL_API])
		.to.deep.equal({
      types: [PUT_REQUEST, PUT_SUCCESS, PUT_FAILURE],
      endpoint: `/favorite/1?songid=1&flow=0`,
      method: 'PUT'
    })
	});

	it('putSongArrayToFavorite should create CALL_API action', () => {
		expect(favorActions.putSongArrayToFavorite(1,[{id:'AA'}, {id:'BB'}]))
		.to.deep.equal({
	    isArray: true
	  })
	});

	it('postNameToFavorite should create CALL_API action', () => {
		expect(favorActions.postNameToFavorite(1, '豪大大')[CALL_API])
		.to.deep.equal({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/favorite/1`,
      body: { name: '豪大大' },
      method: 'POST'
    });
	});

	it('postNewFavoriteName should create CALL_API action', () => {
		expect(favorActions.postNewFavoriteName('豪大大')[CALL_API])
		.to.deep.equal({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/favorite`,
      body: { name: '豪大大' },
      method: 'POST'
    })
	});

	it('deleteFavoriteName should create CALL_API action', () => {
		expect(favorActions.deleteFavoriteName(1)[CALL_API])
		.to.deep.equal({
      types: [DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE],
      endpoint: `/favorite?favor_id=1`,
      method: 'DELETE'
    })
	});

	it('deleteSongFromFavorite should create CALL_API action', () => {
		expect(favorActions.deleteSongFromFavorite(1,1,'豪大大'))
		.to.deep.equal({
	    songName: '豪大大'
	  })

	  expect(favorActions.deleteSongFromFavorite(1,1,'豪大大')[CALL_API])
		.to.deep.equal({
      types: [DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE],
      endpoint: `/favorite/1?songid=1`,
      method: 'DELETE'
    })
	});

	it('deleteSongArrayFromFavorite should create CALL_API action', () => {
		expect(favorActions.deleteSongArrayFromFavorite(1, [{id:'AA'}, {id:'BB'}])[CALL_API])
		.to.deep.equal({
      types: [DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE],
      endpoint: `/favorite/list/1?list=${JSON.stringify([{id:'AA'}, {id:'BB'}])}`,
      method: 'DELETE'
    })
	});

	it('loadSongsFromCollection should create CALL_API action', () => {
		stub.withArgs().returns(1234);

		expect(favorActions.loadSongsFromCollection({})(action => action, fakeStore({})))
		.to.deep.equal({
			page: 1,
			endpoint: '',
			collectionId: ''
		})

		expect(favorActions.loadSongsFromCollection({})(action => action, fakeStore({}))[CALL_API])
		.to.deep.equal({
			types: [GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST, GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS, GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE],
      endpoint: `/favorite/collection/?count=15`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET',
      version: 'v2'
    })

    expect(favorActions.loadSongsFromCollection({ id: 'abc', page: 2, count: 1000 })(action => action, fakeStore({})))
		.to.deep.equal({
			page: 2,
			endpoint: '',
			collectionId: 'abc'
		})

		expect(favorActions.loadSongsFromCollection({ id: 'abc', page: 2, count: 1000 })(action => action, fakeStore({}))[CALL_API])
		.to.deep.equal({
			types: [GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST, GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS, GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE],
      endpoint: `/favorite/collection/abc?count=1000`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET',
      version: 'v2'
    })

    expect(favorActions.loadSongsFromCollection({ id: 'abc', endpoint: '/GG', page: 2, count: 1000 })(action => action, fakeStore({})))
		.to.deep.equal({
			page: 2,
			endpoint: '/GG',
			collectionId: 'abc'
		})

		expect(favorActions.loadSongsFromCollection({ id: 'abc', endpoint: '/GG', page: 2, count: 1000 })(action => action, fakeStore({}))[CALL_API])
		.to.deep.equal({
			types: [GET_SONGS_FROM_YOUTUBE_CATEGORY_REQUEST, GET_SONGS_FROM_YOUTUBE_CATEGORY_SUCCESS, GET_SONGS_FROM_YOUTUBE_CATEGORY_FAILURE],
      endpoint: `/GG`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET',
      version: 'v2'
    })
	});

	it('deleteFromCollection should create CALL_API action', () => {
		expect(favorActions.deleteFromCollection({}))
		.to.deep.equal({
			sharelink: 'sharelink',
		})

		expect(favorActions.deleteFromCollection({})[CALL_API])
		.to.deep.equal({
      types: [DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE],
      endpoint: `/favorite/collection/0`,
      method: 'DELETE',
      version: 'v2'
    })

    expect(favorActions.deleteFromCollection({id: 'aaaa'})[CALL_API])
		.to.deep.equal({
      types: [DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE],
      endpoint: `/favorite/collection/aaaa`,
      method: 'DELETE',
      version: 'v2'
    })
	});

	it('postNewCollection should create CALL_API action', () => {
		expect(favorActions.postNewCollection({}))
		.to.deep.equal({
			sharelink: 'sharelink',
		})

		expect(favorActions.postNewCollection({})[CALL_API])
		.to.deep.equal({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/favorite/collection`,
      body: { sharelink: '', link_type: 'listId' },
      method: 'POST',
      version: 'v2'
    })

    expect(favorActions.postNewCollection({sharelink: 'AA', link_type: 'GG'})[CALL_API])
		.to.deep.equal({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/favorite/collection`,
      body: { sharelink: 'AA', link_type: 'GG' },
      method: 'POST',
      version: 'v2'
    })
	});

	it('loadCollection should create CALL_API action', () => {
		stub.withArgs().returns(1234);

		expect(favorActions.loadCollection({})(action => action, fakeStore({})))
		.to.deep.equal({
			page: 1
		})

		expect(favorActions.loadCollection({})(action => action, fakeStore({}))[CALL_API])
		.to.deep.equal({
			types: [COLLECTION_FROM_YOUTUBE_REQUEST, COLLECTION_FROM_YOUTUBE_SUCCESS, COLLECTION_FROM_YOUTUBE_FAILURE],
      endpoint: `/favorite/collection?page=1&count=1000`,
      schema: Schemas.YOUTUBE_COLLECTION_CATEGORY_ARRAY,
      method: 'GET',
      version: 'v2'
    })

    expect(favorActions.loadCollection({ id: 'abc', page: 2, count: 1000 })(action => action, fakeStore({})))
		.to.deep.equal({
			page: 2
		})

		expect(favorActions.loadCollection({ id: 'abc', page: 2, count: 1000 })(action => action, fakeStore({}))[CALL_API])
		.to.deep.equal({
			types: [COLLECTION_FROM_YOUTUBE_REQUEST, COLLECTION_FROM_YOUTUBE_SUCCESS, COLLECTION_FROM_YOUTUBE_FAILURE],
      endpoint: `/favorite/collection?page=2&count=1000`,
      schema: Schemas.YOUTUBE_COLLECTION_CATEGORY_ARRAY,
      method: 'GET',
      version: 'v2'
    })
	});
});
