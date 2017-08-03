import { EDIT_SCROLL_POSTION } from '../constants/ActionTypes';

const initialState = {
  top: 0
};

export default function editScroll( state = initialState, action ) {
  switch ( action.type ) {
    case EDIT_SCROLL_POSTION:
      return { top: action.top };
    default:
      return state;
  }
}
