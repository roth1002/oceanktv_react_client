import {
  GET_THEMES_SUCCESS,
  GET_AUDIO_SUCCESS,
  GET_MIC_SUCCESS,
  GET_INFO_SUCCESS,
  EDIT_TVLAUNCH_STATE,
  EDIT_NETWORK_ACCESS_STATE
} from '../constants/ActionTypes';

const initialState = {
  theme: 'A',
  audioOutput: [],
  audioInput: [],
  info: {},
  playerOnOff: 2,
  internetAccess: false
};

export default function getSystemConfig( state = initialState, action ) {
  switch ( action.type ) {
    case GET_THEMES_SUCCESS:
      return {
        ...state,
        theme: action.response.web.currentTheme
      };
    case GET_AUDIO_SUCCESS:
      const audioOutput = action.response.audioOutput;
      return {
        ...state,
        audioOutput: audioOutput.map( item => Object.assign({
          display: item.display,
          hwValue: item.hwValue,
          select: item.select ? true : false,
          type: item.type,
          isConnected: Object.keys(item).indexOf('display') !== -1
        }))
      };
    case GET_MIC_SUCCESS:
      const audioInput = action.response.audioInput;
      return {
        ...state,
        audioInput: audioInput.map( item => Object.assign({
          label: item.display,
          value: item.hwValue,
          select: item.select ? true : false,
          type: item.type,
          isConnected: Object.keys(item).indexOf('display') !== -1
        }))
      };
    case GET_INFO_SUCCESS:
      return {
        ...state,
        info: action.response.build,
        playerOnOff: action.response.tvLaunch,
        modelName: action.response.modelName,
        internetAccess: action.response.internetAccess
      };
    case EDIT_TVLAUNCH_STATE:
      return {
        ...state,
        playerOnOff: action.data
      }
    case EDIT_NETWORK_ACCESS_STATE:
      return {
        ...state,
        internetAccess: action.data.status
      }
    default:
      return state;
  }
}
