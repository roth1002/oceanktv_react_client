import { combineReducers } from 'redux';
import { TOGGLE_VIEW } from '../constants/ActionTypes';

function createViewState(initialState, component) {
  return function updateView(state = initialState, action) {
    if ( action.component !== component ) {
      return state;
    }
    switch (action.type) {
      case TOGGLE_VIEW:
        if ( typeof action.state !== 'object' ) {
          throw new Error('Expoect the state of component to be a object');
        }
        return Object.assign({}, state, action.state);
      default:
        return state;
    }
  };
}

const views = combineReducers({
  footer: createViewState({ visible: true }, 'footer'),
  slidePanel: createViewState({ visible: false }, 'slidePanel'),
  moreSettingPanel: createViewState({ visible: false }, 'moreSettingPanel'),
  modal: createViewState({ visible: false }, 'modal'),
  theme: createViewState({ current: undefined, preview: undefined }, 'theme'),
  app: createViewState({ disabled: false }, 'app'),
  notification: createViewState({ visible: false }, 'notification'),
  langSettingPanel: createViewState({ visible: false }, 'langSettingPanel')
});

export default views;
