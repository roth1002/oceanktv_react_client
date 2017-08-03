import { SUBMIT_KEYWORD, BACK_TO_ARTISTS } from '../constants/ActionTypes';

export function search(searchType, keyword, step) {
  return {
    type: SUBMIT_KEYWORD,
    searchType,
    keyword,
    step
  };
};

export function backToArtists(searchType, step) {
  return {
    type: BACK_TO_ARTISTS,
    searchType,
    step
  };
};
