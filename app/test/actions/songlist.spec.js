import { CALL_API, Schemas } from '../../middleware/api';
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
} from '../../constants/ActionTypes';
import * as songslistActions from '../../actions/songslist';
import expect from 'expect';
import sinon from 'sinon';

const fakeStore = fakeData => ({
  getState() {
    return fakeData;
  }
});

describe('songslist actions', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(Date, 'now');
  });

  afterEach(() => {
    stub.restore();
  });

  it('loadSongsByArtist should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.loadSongsByArtist({ page: 1, count: 15, artistId: 1, artistName: '豪大大' })(action => action, fakeStore({})))
    .toEqual({
      append: false,
      artistName: '豪大大',
      artistId: 1,
      page: 1
    })

    expect(songslistActions.loadSongsByArtist({ page: 1, count: 15, artistId: 1, artistName: '豪大大' })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_ARTIST_REQUEST, SONGS_BY_ARTIST_SUCCESS, SONGS_BY_ARTIST_FAILURE],
      endpoint: `/songlist?query_who=songs&page=1&count=15&artist_id=1&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadSongsByArtist({ artistId: 1, artistName: '豪大大' })(action => action, fakeStore({})))
    .toEqual({
      append: false,
      artistName: '豪大大',
      artistId: 1,
      page: 1
    })

    expect(songslistActions.loadSongsByArtist({ artistId: 1, artistName: '豪大大', append: true })(action => action, fakeStore({})))
    .toEqual({
      append: true,
      artistName: '豪大大',
      artistId: 1,
      page: 1
    })

    expect(songslistActions.loadSongsByArtist({ artistId: 1, artistName: '豪大大' })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_ARTIST_REQUEST, SONGS_BY_ARTIST_SUCCESS, SONGS_BY_ARTIST_FAILURE],
      endpoint: `/songlist?query_who=songs&page=1&count=15&artist_id=1&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadSongsByArtist()(action => action, fakeStore({})))
    .toEqual({
      append: false,
      artistName: undefined,
      artistId: undefined,
      page: 1
    })

    expect(songslistActions.loadSongsByArtist()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_ARTIST_REQUEST, SONGS_BY_ARTIST_SUCCESS, SONGS_BY_ARTIST_FAILURE],
      endpoint: `/songlist?query_who=songs&page=1&count=15&artist_id=${undefined}&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })
  });

  it('loadSongsByLang should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.loadSongsByLang({ page: 1, count: 15, lang: '豪大大', nsongs: 100 })(action => action, fakeStore({})))
    .toEqual({
      lang: '豪大大',
      page: 1
    })

    expect(songslistActions.loadSongsByLang({ page: 1, count: 15, lang: '豪大大', nsongs: 100 })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_LANG_REQUEST, SONGS_BY_LANG_SUCCESS, SONGS_BY_LANG_FAILURE],
      endpoint: `/songlist?query_who=songs&page=1&count=15&lang=豪大大&nsongs=100&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadSongsByLang({ lang: '豪大大', nsongs: 100 })(action => action, fakeStore({})))
    .toEqual({
      lang: '豪大大',
      page: 1
    })

    expect(songslistActions.loadSongsByLang({ lang: '豪大大', nsongs: 100 })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_LANG_REQUEST, SONGS_BY_LANG_SUCCESS, SONGS_BY_LANG_FAILURE],
      endpoint: `/songlist?query_who=songs&page=1&count=15&lang=豪大大&nsongs=100&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadSongsByLang()(action => action, fakeStore({})))
    .toEqual({
      lang: undefined,
      page: 1
    })

    expect(songslistActions.loadSongsByLang()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_LANG_REQUEST, SONGS_BY_LANG_SUCCESS, SONGS_BY_LANG_FAILURE],
      endpoint: `/songlist?query_who=songs&page=1&count=15&lang=${undefined}&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })
  });

  it('loadSongsByKeyword should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.loadSongsByKeyword({ page: 1, count: 15, keyword: '豪大大', append: true })(action => action, fakeStore({})))
    .toEqual({
      keyword: '豪大大',
      page: 1,
      append: true
    })

    expect(songslistActions.loadSongsByKeyword({ page: 1, count: 15, keyword: '豪大大', append: true })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_KEYWORD_REQUEST, SONGS_BY_KEYWORD_SUCCESS, SONGS_BY_KEYWORD_FAILURE],
      endpoint: `/songlist?query_who=songs&page=1&count=15&keywords=豪大大&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadSongsByKeyword({ keyword: '豪大大' })(action => action, fakeStore({})))
    .toEqual({
      keyword: '豪大大',
      page: 1,
      append: false
    })

    expect(songslistActions.loadSongsByKeyword({ keyword: '豪大大' })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_KEYWORD_REQUEST, SONGS_BY_KEYWORD_SUCCESS, SONGS_BY_KEYWORD_FAILURE],
      endpoint: `/songlist?query_who=songs&page=1&count=15&keywords=豪大大&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadSongsByKeyword()(action => action, fakeStore({})))
    .toEqual({
      keyword: undefined,
      page: 1,
      append: false
    })

    expect(songslistActions.loadSongsByKeyword()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_KEYWORD_REQUEST, SONGS_BY_KEYWORD_SUCCESS, SONGS_BY_KEYWORD_FAILURE],
      endpoint: `/songlist?query_who=songs&page=1&count=15&keywords=undefined&t=1234`,
      schema: Schemas.SONG_ARRAY,
      method: 'GET'
    })
  });

  it('loadArtistsByArtistType should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.loadArtistsByArtistType({ page: 1, count: 60, artistType: 'male' })(action => action, fakeStore({})))
    .toEqual({
      artistType: 'male',
      page: 1
    })

    expect(songslistActions.loadArtistsByArtistType({ page: 1, count: 60, artistType: 'male' })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ARTISTS_BY_ARTISTTYPE_REQUEST, ARTISTS_BY_ARTISTTYPE_SUCCESS, ARTISTS_BY_ARTISTTYPE_FAILURE],
      endpoint: `/songlist/artists/male?page=1&count=60&t=1234`,
      schema: Schemas.ARTIST_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadArtistsByArtistType({ artistType: 'male' })(action => action, fakeStore({})))
    .toEqual({
      artistType: 'male',
      page: 1
    })

    expect(songslistActions.loadArtistsByArtistType({ artistType: 'male' })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ARTISTS_BY_ARTISTTYPE_REQUEST, ARTISTS_BY_ARTISTTYPE_SUCCESS, ARTISTS_BY_ARTISTTYPE_FAILURE],
      endpoint: `/songlist/artists/male?page=1&count=60&t=1234`,
      schema: Schemas.ARTIST_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadArtistsByArtistType()(action => action, fakeStore({})))
    .toEqual({
      artistType: undefined,
      page: 1
    })

    expect(songslistActions.loadArtistsByArtistType()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ARTISTS_BY_ARTISTTYPE_REQUEST, ARTISTS_BY_ARTISTTYPE_SUCCESS, ARTISTS_BY_ARTISTTYPE_FAILURE],
      endpoint: `/songlist/artists/${undefined}?page=1&count=60&t=1234`,
      schema: Schemas.ARTIST_ARRAY,
      method: 'GET'
    })
  });

  it('loadArtistsByKeyword should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.loadArtistsByKeyword({ page: 1, count: 60, keyword: '豪大大', append: true })(action => action, fakeStore({})))
    .toEqual({
      keyword: '豪大大',
      page: 1,
      append: true
    })

    expect(songslistActions.loadArtistsByKeyword({ page: 1, count: 60, keyword: '豪大大', append: true })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ARTISTS_BY_KEYWORD_REQUEST, ARTISTS_BY_KEYWORD_SUCCESS, ARTISTS_BY_KEYWORD_FAILURE],
      endpoint: `/songlist?query_who=artists&page=1&count=60&keywords=豪大大&t=1234`,
      schema: Schemas.ARTIST_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadArtistsByKeyword({ keyword: '豪大大' })(action => action, fakeStore({})))
    .toEqual({
      keyword: '豪大大',
      page: 1,
      append: false
    })

    expect(songslistActions.loadArtistsByKeyword({ keyword: '豪大大' })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ARTISTS_BY_KEYWORD_REQUEST, ARTISTS_BY_KEYWORD_SUCCESS, ARTISTS_BY_KEYWORD_FAILURE],
      endpoint: `/songlist?query_who=artists&page=1&count=60&keywords=豪大大&t=1234`,
      schema: Schemas.ARTIST_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadArtistsByKeyword()(action => action, fakeStore({})))
    .toEqual({
      keyword: undefined,
      page: 1,
      append: false
    })

    expect(songslistActions.loadArtistsByKeyword()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [ARTISTS_BY_KEYWORD_REQUEST, ARTISTS_BY_KEYWORD_SUCCESS, ARTISTS_BY_KEYWORD_FAILURE],
      endpoint: `/songlist?query_who=artists&page=1&count=60&keywords=undefined&t=1234`,
      schema: Schemas.ARTIST_ARRAY,
      method: 'GET'
    })
  });

  it('loadArtistTypes should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.loadArtistTypes()(action => action, fakeStore({})))
    .toEqual({
      name: 'artistTypes'
    })

    expect(songslistActions.loadArtistTypes()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [LISTS_ELSE_REQUEST, LISTS_ELSE_SUCCESS, LISTS_ELSE_FAILURE],
      endpoint: `/songlist/artists?t=1234`,
      schema: Schemas.LIST_ARRAY,
      method: 'GET'
    })
  });

  it('loadLangs should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.loadLangs()(action => action, fakeStore({})))
    .toEqual({
      name: 'langs'
    })

    expect(songslistActions.loadLangs()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [LISTS_ELSE_REQUEST, LISTS_ELSE_SUCCESS, LISTS_ELSE_FAILURE],
      endpoint: `/songlist/languages?t=1234`,
      schema: Schemas.LIST_ARRAY,
      method: 'GET'
    })
  });

  it('loadSongsByFolder should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.loadSongsByFolder({ page: 1, count: 15, path: 'OceanKTV' })(action => action, fakeStore({})))
    .toEqual({
      path: 'OceanKTV',
      page: 1
    })

    expect(songslistActions.loadSongsByFolder({ page: 1, count: 15, path: 'OceanKTV' })(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_ALL_REQUEST, SONGS_BY_ALL_SUCCESS, SONGS_BY_ALL_FAILURE],
      endpoint: `/songlist/folder?page=1&count=15&path=OceanKTV&t=1234`,
      schema: Schemas.SONG_BY_FOLDER_ARRAY,
      method: 'GET'
    })

    expect(songslistActions.loadSongsByFolder()(action => action, fakeStore({})))
    .toEqual({
      path: 'OceanKTV',
      page: 1
    })

    expect(songslistActions.loadSongsByFolder()(action => action, fakeStore({}))[CALL_API])
    .toEqual({
      types: [SONGS_BY_ALL_REQUEST, SONGS_BY_ALL_SUCCESS, SONGS_BY_ALL_FAILURE],
      endpoint: `/songlist/folder?page=1&count=15&path=OceanKTV&t=1234`,
      schema: Schemas.SONG_BY_FOLDER_ARRAY,
      method: 'GET'
    })
  });

  it('postFileEdit should create CALL_API action', () => {
    expect(songslistActions.postFileEdit({ songId: 1, songName: '豪大大的歌', artist: '豪大大豪歌', gender: 'male', lang: 'GG', track: 'WTF' })[CALL_API])
    .toEqual({
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE],
      endpoint: `/songlist/song/1`,
      body: { songname: '豪大大的歌', artist: '豪大大豪歌', gender: 'male', lang: 'GG', track: 'WTF' },
      method: 'POST'
    })
  });

  it('getFileEdit should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.getFileEdit(1)[CALL_API])
    .toEqual({
      types: [FILE_EDIT_INFO_REQUEST, FILE_EDIT_INFO_SUCCESS, FILE_EDIT_INFO_FAILURE],
      endpoint: `/songlist/song/1?t=1234`,
      method: 'GET'
    })
  });

  it('fetchMenuInfo should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.fetchMenuInfo()[CALL_API])
    .toEqual({
      types: [FETCH_MENUINFO_REQUEST, FETCH_MENUINFO_SUCCESS, FETCH_MENUINFO_FAILURE],
      endpoint: `/songlist/info?t=1234`,
      method: 'GET'
    })
  });

  it('fetchAudioTrack should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(songslistActions.fetchAudioTrack(1)[CALL_API])
    .toEqual({
      types: [FETCH_AUDIOTRACK_REQUEST, FETCH_AUDIOTRACK_SUCCESS, FETCH_AUDIOTRACK_FAILURE],
      endpoint: `/songlist/songtrackinfo?sonid=1&t=1234`,
      method: 'GET'
    })
  });
});
