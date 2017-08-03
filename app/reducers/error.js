import { RESET_ERROR_MESSAGE } from '../constants/ActionTypes';

const initialState = {
	code: 0,
	msg: '',
}

export default function errorMessage(state = initialState, action) {
  const { type, error } = action;
  if (type === RESET_ERROR_MESSAGE) {
    return initialState;
  } else if (error) {
    return {
			...state,
			code: action.error.code,
			msg: action.error.msg,
  	}
  } else {
  	return state;
  }
}
