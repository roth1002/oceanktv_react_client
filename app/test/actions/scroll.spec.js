import { EDIT_SCROLL_POSTION } from '../../constants/ActionTypes';
import expect from 'expect';
import * as scrollActions from '../../actions/scroll';

describe('scroll actions', () => {
	it('editScroll should create SELECT_LANGUAGE action', () => {
		expect(scrollActions.editScroll(1000))
		.toEqual({
			type: EDIT_SCROLL_POSTION,
			top: 1000
		});
	});
})
