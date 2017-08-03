import React, { Component, PropTypes } from 'react'
import Draggable from 'react-draggable'

export default class Modal extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { isOpen, handle } = this.props
    const finalHandle = handle || 'h2'
    if (!isOpen) {
      return <div style={{ visibility: 'hidden' }} />
    }
    return (
      <div className={`Modal-overlay`}>
        <Draggable handle={finalHandle} zIndex={100}>
          <div className={`Modal`}>
            {this.props.children}
          </div>
        </Draggable>
      </div>
    )
  }
}
