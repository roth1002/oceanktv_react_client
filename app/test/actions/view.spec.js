import { TOGGLE_VIEW, FLASH_DETECT_FAIL, FLASH_VERSION_TOO_OLD } from '../../constants/ActionTypes';
import expect from 'expect';
import * as viewActions from '../../actions/views';

describe('view actions', () => {
	it('toggleView should create TOGGLE_VIEW action', () => {
		expect(viewActions.toggleView('modal', true))
		.toEqual({
	    type: TOGGLE_VIEW,
	    component: 'modal',
	    state: true
	  });
	});

	it('toggleHeader should create TOGGLE_HEADER action', () => {
		expect(viewActions.toggleHeader(true))
			.toEqual({
	    type: 'TOGGLE_HEADER',
	    state: true
	  });
	});

	it('detectFlashFail should create FLASH_DETECT_FAIL action', () => {
		expect(viewActions.detectFlashFail())
			.toEqual({
	    type: FLASH_DETECT_FAIL
	  });
	});

	it('flashVersionTooOld should create FLASH_VERSION_TOO_OLD action', () => {
		expect(viewActions.flashVersionTooOld())
			.toEqual({
	    type: FLASH_VERSION_TOO_OLD
	  });
	});
})
