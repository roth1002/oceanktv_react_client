import { EDIT_MOUSE_POSTION, ADD_MOVE, REMOVE_MOVE } from '../constants/ActionTypes';

const initialState = {
  pageY: 0,
  move: false
};

export default function editMouse( state = initialState, action ) {
  switch ( action.type ) {
    case EDIT_MOUSE_POSTION:
      return { ...state, pageY: action.pageY };
    case ADD_MOVE:
    	return { ...state, move: true };
    case REMOVE_MOVE:
    	return { ...state, move: false };
    default:
      return state;
  }
}
