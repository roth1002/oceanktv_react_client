import { SUBMIT_KEYWORD, BACK_TO_ARTISTS } from '../../constants/ActionTypes';
import expect from 'expect';
import * as slidePanelActions from '../../actions/slide-panel';

describe('slide-panel actions', () => {
	it('search should create SELECT_LANGUAGE action', () => {
		expect(slidePanelActions.search('artists', '豪大大', 1))
		.toEqual({
	    type: SUBMIT_KEYWORD,
	    searchType: 'artists',
	    keyword: '豪大大',
	    step: 1
	  });
	});

	it('backToArtists should create SELECT_LANGUAGE action', () => {
		expect(slidePanelActions.backToArtists('artists', 1))
			.toEqual({
	    type: BACK_TO_ARTISTS,
	    searchType: 'artists',
	    step: 1
	  });
	});
})
