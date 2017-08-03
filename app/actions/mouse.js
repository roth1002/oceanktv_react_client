import { EDIT_MOUSE_POSTION, ADD_MOVE, REMOVE_MOVE } from '../constants/ActionTypes';

export function editMouse(pageY) {
  return { type: EDIT_MOUSE_POSTION, pageY };
}

export function addMove() {
  return { type: ADD_MOVE };
}

export function removeMove() {
  return { type: REMOVE_MOVE };
}