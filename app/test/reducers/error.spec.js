import { RESET_ERROR_MESSAGE } from '../../constants/ActionTypes';
import expect from 'expect';
import errorMessage from '../../reducers/error';

const initialState = {
  code: 0,
  msg: '',
}

describe('errorMessage reducer', () => {
  it('should handle initial state', () => {
    expect(
      errorMessage(initialState, {})
    ).toEqual(initialState);
    expect(
      errorMessage(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle error in actions', () => {
    expect(
      errorMessage(initialState, { type: RESET_ERROR_MESSAGE, error: '豪大大'})
    ).toEqual(initialState);

    expect(
      errorMessage(initialState, { type: RESET_ERROR_MESSAGE })
    ).toEqual(initialState);

    expect(
      errorMessage(initialState, { error: { code: 111, msg: '豪大大'}})
    ).toEqual({ code: 111, msg: '豪大大'});
  });
});

