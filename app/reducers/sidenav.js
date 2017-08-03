import { PLAYLIST_INFO_SUCCESS } from '../constants/ActionTypes';

const initialState = {
	current: 0,
	finished: 0
}

export default function editSideNav( state = initialState, action ) {
	switch( action.type ) {
		case PLAYLIST_INFO_SUCCESS:
			return {
				current: action.response.info.current[0].count,
				finished: action.response.info.finished[0].count
			};
		default:
			return state;
	}
}
