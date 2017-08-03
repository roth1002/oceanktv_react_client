import { SELECT_LANGUAGE } from '../constants/ActionTypes';

export function selectLanguage(lang) {
  return { type: SELECT_LANGUAGE, lang };
};

