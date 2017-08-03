import i18n from '../constants/i18n';
import { SELECT_LANGUAGE } from '../constants/ActionTypes';
import { defaultLang } from '../constants/Config';

const initialState = Object.assign({}, i18n, { myLang: defaultLang })

export default function i18nData( state = initialState, action ) {
  switch ( action.type ) {
    case SELECT_LANGUAGE:
      return Object.assign( {}, i18n, { myLang: action.lang });
    default:
      return state;
  }
}
