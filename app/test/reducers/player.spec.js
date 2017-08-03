import expect from 'expect';
import playerReducer from '../../reducers/player';
import {
  SELECT_BOTTON,
  FETCH_PLAYSTATE_SUCCESS,
  FETCH_PLAYSTATE_FAILURE,
  EDIT_PLAY_STATE,
  EDIT_PITCH_STATE,
  EDIT_MUTE_STATE,
  EDIT_ECHOMODE_STATE,
  EDIT_MIC_STATE,
  EDIT_MUSIC_STATE,
  EDIT_ISSINGING_STATE,
  EDIT_AUDIOMPX_STATE
 } from '../../constants/ActionTypes';

const initialState = {
  visible: false,
  selected: ' ',
  playState: ' ',
  echoMode: ' ',
  mute: ' ',
  musicVolume: ' ',
  pitchValue: ' ',
  micVolume: ' ',
  guideState: ' '
}

describe('player reducer', () => {
  it('should handle initial state', () => {
    expect(
      playerReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle SELECT_BOTTON', () => {
  	expect(
  	  playerReducer(initialState, { type: SELECT_BOTTON, visible: true, selected: 'Andy' })
  	).toEqual(Object.assign({}, initialState, { visible: true, selected: 'Andy' }));
  });

  it('should handle FETCH_PLAYSTATE_SUCCESS', () => {
    expect(
      playerReducer(initialState, { type: FETCH_PLAYSTATE_SUCCESS, response: { state: 0, echoMode: 0, mute: 0, music: 80, pitch: 0, mic: [80,80], audiompx: 0 }})
    ).toEqual(Object.assign({}, initialState, { playState: 0, echoMode: 0, mute: 0, musicVolume: 80, pitchValue: 0, micVolume: 80, guideState: 0 }));
  });

  it('should handle FETCH_PLAYSTATE_FAILURE', () => {
    expect(
      playerReducer(initialState, { type: FETCH_PLAYSTATE_FAILURE, error: { code: 13001 }})
    ).toEqual(Object.assign({}, initialState, { playState: 'notReady' }));

    expect(
      playerReducer(initialState, { type: FETCH_PLAYSTATE_FAILURE, error: { code: 0 }})
    ).toEqual(initialState);
  });

  it('should handle EDIT_PLAY_STATE', () => {
    expect(
      playerReducer(initialState, { type: EDIT_PLAY_STATE, data: 'Ready' })
    ).toEqual(Object.assign({}, initialState, { playState: 'Ready' }));
  });

  it('should handle EDIT_PITCH_STATE', () => {
    expect(
      playerReducer(initialState, { type: EDIT_PITCH_STATE, data: '1' })
    ).toEqual(Object.assign({}, initialState, { pitchValue: '1' }));
  });

  it('should handle EDIT_MUTE_STATE', () => {
    expect(
      playerReducer(initialState, { type: EDIT_MUTE_STATE, data: 'mute' })
    ).toEqual(Object.assign({}, initialState, { mute: 'mute' }));
  });

  it('should handle EDIT_ECHOMODE_STATE', () => {
    expect(
      playerReducer(initialState, { type: EDIT_ECHOMODE_STATE, data: 'noEcho' })
    ).toEqual(Object.assign({}, initialState, { echoMode: 'noEcho' }));
  });

  it('should handle EDIT_MIC_STATE', () => {
    expect(
      playerReducer(initialState, { type: EDIT_MIC_STATE, data: [80,1] })
    ).toEqual(Object.assign({}, initialState, { micVolume: 80 }));
  });

  it('should handle EDIT_MUSIC_STATE', () => {
    expect(
      playerReducer(initialState, { type: EDIT_MUSIC_STATE, data: 60 })
    ).toEqual(Object.assign({}, initialState, { musicVolume: 60 }));
  });

  it('should handle EDIT_AUDIOMPX_STATE', () => {
    expect(
      playerReducer(initialState, { type: EDIT_AUDIOMPX_STATE, data: 'left' })
    ).toEqual(Object.assign({}, initialState, { guideState: 'left' }));
  });
});