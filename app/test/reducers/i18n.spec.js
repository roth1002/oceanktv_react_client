import expect from 'expect';
import i18n from '../../constants/i18n';
import i18nReducer from '../../reducers/i18n';
import { SELECT_LANGUAGE } from '../../constants/ActionTypes';

const initialState = Object.assign({}, i18n, { myLang: 'en' })

describe('i18n reducer', () => {
  it('should handle initial state', () => {
    expect(
      i18nReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle SELECT_LANGUAGE', () => {
    expect(
      i18nReducer(initialState, { type: SELECT_LANGUAGE, lang: 'zh-tw'})
    ).toEqual(Object.assign({}, i18n, { myLang: 'zh-tw' }));
  });
});
