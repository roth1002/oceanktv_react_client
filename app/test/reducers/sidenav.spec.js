import expect from 'expect';
import sidenavReducer from '../../reducers/sidenav';
import { PLAYLIST_INFO_SUCCESS } from '../../constants/ActionTypes';

const initialState = {
	current: 0,
	finished: 0
}

describe('sidenav reducer', () => {
  it('should handle initial state', () => {
    expect(
      sidenavReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle PLAYLIST_INFO_SUCCESS', () => {
  	const response = {
  		info: {
  			current: [{ count: 1 }],
  			finished: [{ count: 2 }]
  		}
  	};
  	expect(
  	  sidenavReducer(initialState, { type: PLAYLIST_INFO_SUCCESS, response: response })
  	).toEqual(Object.assign({}, initialState, { current: 1, finished: 2 }));
  });
});