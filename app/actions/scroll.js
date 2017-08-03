import { EDIT_SCROLL_POSTION } from '../constants/ActionTypes';

export function editScroll(top) {
  return { type: EDIT_SCROLL_POSTION, top };
}
