import { SELECT_LANGUAGE } from '../../constants/ActionTypes';
import expect from 'expect';
import { CALL_API, Schemas } from '../../middleware/api';
import * as i18nActions from '../../actions/i18n';

describe('i18n actions', () => {
	it('selectLanguage should create SELECT_LANGUAGE action', () => {
		expect(i18nActions.selectLanguage('zh-tw'))
		.toEqual({
			type: SELECT_LANGUAGE,
			lang: 'zh-tw'
		});
	});
});
