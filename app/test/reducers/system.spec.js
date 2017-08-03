import expect from 'expect';
import systemReducer from '../../reducers/system';
import {
	GET_THEMES_SUCCESS,
	GET_AUDIO_SUCCESS,
  GET_MIC_SUCCESS,
	GET_INFO_SUCCESS,
	EDIT_TVLAUNCH_STATE,
  EDIT_NETWORK_ACCESS_STATE
} from '../../constants/ActionTypes';

const initialState = {
  theme: 'A',
  audioOutput: [],
  audioInput: [],
  info: {},
  playerOnOff: 2,
  internetAccess: false
};

describe('system reducer', () => {
  it('should handle initial state', () => {
    expect(
      systemReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle GET_THEMES_SUCCESS', () => {
    expect(
      systemReducer(initialState, { type: GET_THEMES_SUCCESS, response: { web: { currentTheme: 'B' }}})
    ).toEqual(Object.assign({}, initialState, { theme: 'B' }));
  });

  it('should handle GET_AUDIO_SUCCESS', () => {
    expect(
      systemReducer(initialState, { type: GET_AUDIO_SUCCESS, response: { audioOutput: [{ display: 'testDevice' }]}})
    ).toEqual(Object.assign({}, initialState, {
      audioOutput: [{
        display: 'testDevice',
        hwValue: undefined,
        type: undefined,
        select: false,
        isConnected: true
      }]
    }));
    expect(
      systemReducer(initialState, { type: GET_AUDIO_SUCCESS, response: { audioOutput: [{ display: 'testDevice', select: true }]}})
    ).toEqual(Object.assign({}, initialState, {
      audioOutput: [{
        display: 'testDevice',
        hwValue: undefined,
        type: undefined,
        select: true,
        isConnected: true
      }]
    }));
  });

  it('should handle GET_MIC_SUCCESS', () => {
    expect(
      systemReducer(initialState, { type: GET_MIC_SUCCESS, response: { audioInput: [{ display: 'testDevice' }]}})
    ).toEqual(Object.assign({}, initialState, {
      audioInput: [{
        label: 'testDevice',
        value: undefined,
        type: undefined,
        select: false,
        isConnected: true
      }]
    }));

    expect(
      systemReducer(initialState, { type: GET_MIC_SUCCESS, response: { audioInput: [{ display: 'testDevice', select: true }]}})
    ).toEqual(Object.assign({}, initialState, {
      audioInput: [{
        label: 'testDevice',
        value: undefined,
        type: undefined,
        select: true,
        isConnected: true
      }]
    }));
  });

  it('should handle GET_INFO_SUCCESS', () => {
    expect(
      systemReducer(initialState, { type: GET_INFO_SUCCESS, response: { build: { systemInfo: 'testInfo' }, tvLaunch: 1, internetAccess: false }})
    ).toEqual(Object.assign({}, initialState, { info: { systemInfo: 'testInfo' }, playerOnOff: 1, modelName: undefined, internetAccess: false }));
  });

  it('should handle EDIT_TVLAUNCH_STATE', () => {
    expect(
      systemReducer(initialState, { type: EDIT_TVLAUNCH_STATE, data: 0 })
    ).toEqual(Object.assign({}, initialState, { playerOnOff: 0 }));
  });

  it('should handle EDIT_NETWORK_ACCESS_STATE', () => {
    expect(
      systemReducer(initialState, { type: EDIT_NETWORK_ACCESS_STATE, data: { status: 0 } })
    ).toEqual(Object.assign({}, initialState, { internetAccess: 0 }));
  });
});