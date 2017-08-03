import { ADD_CHILD, CREATE_NODE } from '../actions'

function childIds(state, action) {
  switch (action.type) {
    case ADD_CHILD:
      return [ ...state, action.childId ]
    default:
      return state
  }
}

function node(state, action) {
  switch (action.type) {
    case CREATE_NODE:
      return {
        id: action.nodeId,
        counter: 0,
        childIds: []
      }
    case ADD_CHILD:
      return Object.assign({}, state, {
        childIds: childIds(state.childIds, action)
      })
    default:
      return state
  }
}

export default function (state = {}, action) {
  const { nodeId } = action
  if (typeof nodeId === 'undefined') {
    return state
  }

  return Object.assign({}, state, {
    [nodeId]: node(state[nodeId], action)
  })
}
