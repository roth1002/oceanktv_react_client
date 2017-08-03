import expect from 'expect';
import toggleHeader from '../../reducers/header';

const initialHeaderState = {
  pressed: 'init',
  visible: false
};

describe('toggleHeader reducer', () => {
  it('should handle initial state', () => {
    expect(
      toggleHeader(undefined, {})
    ).toEqual(initialHeaderState);
  });

  it('should handle TOGGLE_HEADER', () => {
    expect(
      toggleHeader(initialHeaderState, { type: 'TOGGLE_HEADER', state: { pressed: '豪大大', forceHidden: false }})
    ).toEqual(Object.assign({}, initialHeaderState, {
        pressed: '豪大大',
        visible: true
      })
    );

    expect(
      toggleHeader(initialHeaderState, { type: 'TOGGLE_HEADER', state: { pressed: '豪大大', forceHidden: true }})
    ).toEqual(Object.assign({}, initialHeaderState, {
        pressed: '豪大大',
        visible: false
      })
    );

    expect(
      toggleHeader(initialHeaderState, { type: 'TOGGLE_HEADER', state: { pressed: 'init', forceHidden: false }})
    ).toEqual(Object.assign({}, initialHeaderState, {
        pressed: 'init',
        visible: true
      })
    );

  });
});
