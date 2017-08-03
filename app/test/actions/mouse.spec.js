import { EDIT_MOUSE_POSTION, ADD_MOVE, REMOVE_MOVE } from '../../constants/ActionTypes';
import expect from 'expect';
import * as mouseActions from '../../actions/mouse';

describe('mouse actions', () => {
	it('editMouse should create SELECT_LANGUAGE action', () => {
		expect(mouseActions.editMouse(1000))
		.toEqual({
			type: EDIT_MOUSE_POSTION,
			pageY: 1000
		});
	});

	it('addMove should create SELECT_LANGUAGE action', () => {
		expect(mouseActions.addMove())
		.toEqual({
			type: ADD_MOVE
		});
	});

	it('removeMove should create SELECT_LANGUAGE action', () => {
		expect(mouseActions.removeMove())
		.toEqual({
			type: REMOVE_MOVE
		});
	});
});
