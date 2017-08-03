import { TOGGLE_VIEW, FLASH_DETECT_FAIL, FLASH_VERSION_TOO_OLD } from '../constants/ActionTypes';

export function toggleView(component, state) {
  return {
    type: TOGGLE_VIEW,
    component,
    state
  };
};
export function toggleHeader(state) {
  return {
    type: 'TOGGLE_HEADER',
    state
  };
};

export function detectFlashFail() {
	return {
		type: FLASH_DETECT_FAIL
	}
}

export function flashVersionTooOld() {
  return {
    type: FLASH_VERSION_TOO_OLD
  }
}
