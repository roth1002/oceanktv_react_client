import expect from 'expect';
import scrollReducer from '../../reducers/scroll';
import { EDIT_SCROLL_POSTION } from '../../constants/ActionTypes';

const initialState = {
	top: 0
}

describe('scroll reducer', () => {
  it('should handle initial state', () => {
    expect(
      scrollReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle EDIT_SCROLL_POSTION', () => {
  	expect(
  	  scrollReducer(initialState, { type: EDIT_SCROLL_POSTION, top: 10 })
  	).toEqual(Object.assign({}, initialState, { top: 10 }));
  });
});