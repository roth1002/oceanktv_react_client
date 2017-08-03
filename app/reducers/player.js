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
} from '../constants/ActionTypes';

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
};

export default function playerReducers( state = initialState, action ) {
  switch ( action.type ) {
    case SELECT_BOTTON:
      return Object.assign({}, state, {
        visible: action.visible,
        selected: action.selected
      });
    case FETCH_PLAYSTATE_SUCCESS:
      return Object.assign({}, state, {
        playState: action.response.state,
        echoMode: action.response.echoMode,
        mute: action.response.mute,
        musicVolume: action.response.music,
        pitchValue: action.response.pitch,
        micVolume: action.response.mic[0],
        guideState: action.response.audiompx
      });
    case FETCH_PLAYSTATE_FAILURE:
      if ( action.error.code === 13001 ) {
        return Object.assign({}, state, { playState: 'notReady' });
      } else {
        return state;
      }
    case EDIT_PLAY_STATE:
      return Object.assign({}, state, { playState: action.data });
    case EDIT_PITCH_STATE:
      return Object.assign({}, state, { pitchValue: action.data });
    case EDIT_MUTE_STATE:
      return Object.assign({}, state, { mute: action.data });
    case EDIT_ECHOMODE_STATE:
      return Object.assign({}, state, { echoMode: action.data });
    case EDIT_MIC_STATE:
      return Object.assign({}, state, { micVolume: action.data[0] });
    case EDIT_MUSIC_STATE:
      return Object.assign({}, state, { musicVolume: action.data });
    case EDIT_AUDIOMPX_STATE:
      return Object.assign({}, state, { guideState: action.data });
    default:
      return state;
  }
}
