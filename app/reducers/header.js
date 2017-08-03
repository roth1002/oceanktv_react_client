const initialHeaderState = {
  pressed: 'init',
  visible:false
};

export default function toggleHeader(state = initialHeaderState, action) {
  switch (action.type) {
    case 'TOGGLE_HEADER':
      return action.state.forceHidden ?
      Object.assign({}, state, {
        pressed: action.state.pressed,
        visible: !action.state.forceHidden
      }) :
      Object.assign({}, state, {
        pressed: action.state.pressed,
        visible: state.pressed === action.state.pressed ? !state.visible : true
      });
    default:
      return state;
  }
}