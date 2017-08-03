import expect from 'expect';
import mouseReducer from '../../reducers/mouse';
import { EDIT_MOUSE_POSTION, ADD_MOVE, REMOVE_MOVE } from '../../constants/ActionTypes';

const initialState = {
  pageY: 0,
  move: false
}

describe('mouse reducer', () => {
  it('should handle initial state', () => {
    expect(
      mouseReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle EDIT_MOUSE_POSTION', () => {
  	expect(
  	  mouseReducer(initialState, { type: EDIT_MOUSE_POSTION, pageY: 10 })
  	).toEqual(Object.assign({}, initialState, { pageY: 10 }));
  });

  it('should handle ADD_MOVE', () => {
    expect(
      mouseReducer(initialState, { type: ADD_MOVE, move: true })
    ).toEqual(Object.assign({}, initialState, { move: true }));
  });

  it('should handle REMOVE_MOVE', () => {
    expect(
      mouseReducer(initialState, { type: REMOVE_MOVE, move: false })
    ).toEqual(Object.assign({}, initialState, { move: false }));
  });
});