import expect from 'expect';
import searchReducer from '../../reducers/search';
import { SUBMIT_KEYWORD, BACK_TO_ARTISTS } from '../../constants/ActionTypes';

const initialState = {};

describe('search reducer', () => {
  it('should handle initial state', () => {
    expect(
      searchReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle SUBMIT_KEYWORD', () => {
  	expect(
  	  searchReducer(initialState, { type: SUBMIT_KEYWORD, searchType: 'type', keyword: 'test', step: 'first' })
  	).toEqual(Object.assign({}, initialState, { searchType: 'type', keyword: 'test', step: 'first' }));
  });

  it('should handle BACK_TO_ARTISTS', () => {
  	expect(
  	  searchReducer(initialState, { type: BACK_TO_ARTISTS, searchType: 'type', step: 'first' })
  	).toEqual(Object.assign({}, initialState, { searchType: 'type', step: 'first' }));
  });
});