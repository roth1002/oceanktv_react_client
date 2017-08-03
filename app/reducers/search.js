import { SUBMIT_KEYWORD, BACK_TO_ARTISTS } from '../constants/ActionTypes';

export default function search(state = {}, action) {
  switch (action.type) {
    case SUBMIT_KEYWORD:
      return Object.assign({}, state, {
        searchType: action.searchType,
        keyword: action.keyword,
        step: action.step
      });
    case BACK_TO_ARTISTS:
      return Object.assign({}, state, {
        searchType: action.searchType,
        step: action.step
      });
    default:
      return state;
  }
}