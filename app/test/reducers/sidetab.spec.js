import expect from 'expect';
import sidetabReducer from '../../reducers/sidetab';
import { FETCH_MENUINFO_SUCCESS } from '../../constants/ActionTypes';

const initialState = {
	folder: [],
	lang: [],
	artist: []
}

describe('sidetab reducer', () => {
  it('should handle initial state', () => {
    expect(
      sidetabReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle FETCH_MENUINFO_SUCCESS', () => {
  	expect(
  	  sidetabReducer(initialState, { type: FETCH_MENUINFO_SUCCESS, response: { info: { byAll:['A'], byLanguage: ['B'], byArtist:['C']}}})
  	).toEqual(Object.assign({}, initialState, { folder:['A'], lang:['B'], artist:['C'] }));
  });
});
