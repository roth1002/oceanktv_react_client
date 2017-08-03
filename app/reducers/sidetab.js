import { FETCH_MENUINFO_SUCCESS } from '../constants/ActionTypes';

const initialState = {
	folder: [],
	lang: [],
	artist: []
}

export default function sideTabInfo( state = initialState, action ) {
  switch ( action.type ) {
    case FETCH_MENUINFO_SUCCESS:
      return {
      	folder: action.response.info.byAll,
      	lang: action.response.info.byLanguage,
      	artist: action.response.info.byArtist
      };
    default:
      return state;
  }
}