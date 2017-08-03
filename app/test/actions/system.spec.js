import { CALL_API, Schemas } from '../../middleware/api';
import {
  GET_THEMES_REQUEST, GET_THEMES_SUCCESS, GET_THEMES_FAILURE,
  POST_THEMES_REQUEST, POST_THEMES_SUCCESS, POST_THEMES_FAILURE,
  GET_AUDIO_REQUEST, GET_AUDIO_SUCCESS, GET_AUDIO_FAILURE,
  POST_AUDIO_REQUEST, POST_AUDIO_SUCCESS, POST_AUDIO_FAILURE,
  GET_MIC_REQUEST, GET_MIC_SUCCESS, GET_MIC_FAILURE,
  POST_MIC_REQUEST, POST_MIC_SUCCESS, POST_MIC_FAILURE,
  GET_INFO_REQUEST, GET_INFO_SUCCESS, GET_INFO_FAILURE,
  POST_PLAYER_REQUEST, POST_PLAYER_SUCCESS, POST_PLAYER_FAILURE,
  GET_SHARED_REQUEST, GET_SHARED_SUCCESS, GET_SHARED_FAILURE,
  GET_SHARE_REQUEST, GET_SHARE_SUCCESS, GET_SHARE_FAILURE,
  POST_SHARED_REQUEST, POST_SHARED_SUCCESS, POST_SHARED_FAILURE,
  DELETE_SHARED_REQUEST, DELETE_SHARED_SUCCESS, DELETE_SHARED_FAILURE,
  EDIT_TVLAUNCH_STATE,
  EDIT_DEVICE_HOT_PLUG_STATE,
  EDIT_NETWORK_ACCESS_STATE
} from '../../constants/ActionTypes';
import expect from 'expect';
import sinon from 'sinon';
import * as systemActions from '../../actions/system';

const fakeStore = fakeData => ({
  getState() {
    return fakeData;
  }
});

describe('system actions', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(Date, 'now');
  });

  afterEach(() => {
    stub.restore();
  });

  it('loadMyTheme should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(systemActions.loadMyTheme()[CALL_API])
    .toEqual({
      types: [GET_THEMES_REQUEST, GET_THEMES_SUCCESS, GET_THEMES_FAILURE],
      endpoint: `/system/config/web?t=1234`,
      method: 'GET'
    })
  });

  it('loadMyAudioOutput should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(systemActions.loadMyAudioOutput()[CALL_API])
    .toEqual({
      types: [GET_AUDIO_REQUEST, GET_AUDIO_SUCCESS, GET_AUDIO_FAILURE],
      endpoint: `/system/audio/output?t=1234`,
      method: 'GET'
    })
  });

it('loadMyAudioInput should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(systemActions.loadMyAudioInput()[CALL_API])
    .toEqual({
      types: [GET_MIC_REQUEST, GET_MIC_SUCCESS, GET_MIC_FAILURE],
      endpoint: `/system/audio/input?t=1234`,
      method: 'GET'
    })
  });

  it('setMyTheme should create CALL_API action', () => {
    expect(systemActions.setMyTheme('A')[CALL_API])
    .toEqual({
      types: [POST_THEMES_REQUEST, POST_THEMES_SUCCESS, POST_THEMES_FAILURE],
      endpoint: `/system/config/web`,
      method: 'POST',
      body: { data: JSON.stringify({ current_theme: 'A' })}
    })
  });

  it('setMyAudioOutput should create CALL_API action', () => {
    expect(systemActions.setMyAudioOutput('hw:0,0')[CALL_API])
    .toEqual({
      types: [POST_AUDIO_REQUEST, POST_AUDIO_SUCCESS, POST_AUDIO_FAILURE],
      endpoint: `/system/audio/output`,
      method: 'POST',
      body: { dev: 'hw:0,0' }
    })
  });

  it('setMyAudioInput should create CALL_API action', () => {
    expect(systemActions.setMyAudioInput('hw:0,0')[CALL_API])
    .toEqual({
      types: [POST_MIC_REQUEST, POST_MIC_SUCCESS, POST_MIC_FAILURE],
      endpoint: `/system/audio/input`,
      method: 'POST',
      body: { dev: 'hw:0,0' }
    })
  });

  it('loadAppInfo should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(systemActions.loadAppInfo()[CALL_API])
    .toEqual({
      types: [GET_INFO_REQUEST, GET_INFO_SUCCESS, GET_INFO_FAILURE],
      endpoint: `/system/info?t=1234`,
      method: 'GET',
      version: 'v2'
    })
  });

  it('fullscreenFailue should create FULLSCREEN_FAILUE action', () => {
    expect(systemActions.fullscreenFailue(1))
    .toEqual({
      type: 'FULLSCREEN_FAILUE',
      state: 1
    })
  });

  it('playerStart should create CALL_API action', () => {
    expect(systemActions.playerStart()[CALL_API])
    .toEqual({
      types: [POST_PLAYER_REQUEST, POST_PLAYER_SUCCESS, POST_PLAYER_FAILURE],
      endpoint: `/system/poweron`,
      method: 'POST'
    })
  });

  it('playerShutDown should create CALL_API action', () => {
    expect(systemActions.playerShutDown()[CALL_API])
    .toEqual({
      types: [POST_PLAYER_REQUEST, POST_PLAYER_SUCCESS, POST_PLAYER_FAILURE],
      endpoint: `/system/shutdown`,
      method: 'POST'
    })
  });

  it('fetchSharedFolder should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(systemActions.fetchSharedFolder()[CALL_API])
    .toEqual({
      types: [GET_SHARED_REQUEST, GET_SHARED_SUCCESS, GET_SHARED_FAILURE],
      endpoint: `/system/share/oceanktv?t=1234`,
      method: 'GET'
    })
  });

  it('fetchShareFolderDynamic should create CALL_API action', () => {
    stub.withArgs().returns(1234);

    expect(systemActions.fetchShareFolderDynamic()[CALL_API])
    .toEqual({
      types: [GET_SHARE_REQUEST, GET_SHARE_SUCCESS, GET_SHARE_FAILURE],
      endpoint: `/system/share?t=1234`,
      method: 'GET'
    })

    expect(systemActions.fetchShareFolderDynamic('豪大大')[CALL_API])
    .toEqual({
      types: [GET_SHARE_REQUEST, GET_SHARE_SUCCESS, GET_SHARE_FAILURE],
      endpoint: `/system/share?dir=豪大大&t=1234`,
      method: 'GET'
    })
  });

  it('postSharedFolder should create CALL_API action', () => {
    expect(systemActions.postSharedFolder('豪大大')[CALL_API])
    .toEqual({
      types: [POST_SHARED_REQUEST, POST_SHARED_SUCCESS, POST_SHARED_FAILURE],
      endpoint: `/system/share/oceanktv?dir=豪大大`,
      method: 'POST'
    })
  });

  it('deleteSharedFolder should create CALL_API action', () => {
    expect(systemActions.deleteSharedFolder('豪大大')[CALL_API])
    .toEqual({
      types: [DELETE_SHARED_REQUEST, DELETE_SHARED_SUCCESS, DELETE_SHARED_FAILURE],
      endpoint: `/system/share/oceanktv?dir=豪大大`,
      method: 'DELETE'
    })
  });

  it('editSystemTvLaunchState should create CALL_API action', () => {
    expect(systemActions.editSystemTvLaunchState(1))
      .toEqual({
      type: EDIT_TVLAUNCH_STATE,
      data: 1
    })
  });

  it('editSystemDeviceHotPlugState should create CALL_API action', () => {
    expect(systemActions.editSystemDeviceHotPlugState(1))
      .toEqual({
      type: EDIT_DEVICE_HOT_PLUG_STATE,
      data: 1
    })
  });

  it('editNetworkAccessState should create CALL_API action', () => {
    expect(systemActions.editNetworkAccessState(1))
      .toEqual({
      type: EDIT_NETWORK_ACCESS_STATE,
      data: 1
    })
  });
});
