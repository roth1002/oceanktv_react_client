import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { API_ROOT } from '../constants/Config'
import { stopPropagation } from '../utils/functions'

/**
 * Cart React component
 * @prop {String} className
 * @prop {String} headline
 * @prop {Array} items
 * @prop {Function} onCancel
 */
export default class Cart extends Component {
  static propTypes = {
    items: PropTypes.array
  }

  static defaultProps = {
    headline: ''
  }

  state = {
    mode: false
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { className, items, headline, cancelText, submitText, cartActions } = this.props
    const parentClass = className ? className.split('-')[0] : ''
    const ClassName = classnames(`Cart`, className)
    return (
      <form className={ClassName} onSubmit={::this.handleSubmit}>
        <h2 className={`Cart-header`}>{headline}</h2>
        <div className={`Cart-list`}>
          {items.map(::this.renderCartItem)}
        </div>
        <div className={`Cart-actions`}>
          <button className={`ic ic_action_remove`} type="button" onClick={::this.handleDeleteAction} />
        </div>
        <div className={`Cart-confirm ${parentClass}-confirm`}>
          <button type="button" onClick={::this.handleCancel}>{cancelText}</button>
          <button type="submit" onClick={::this.handleSubmit}>{submitText}</button>
        </div>
      </form>
    )
  }
  renderCartItem(item, index) {
    const { mode } = this.state
    return (
      <div key={index} className={`Cart-item`}>
        <img className={`Cart-image`} src={`${API_ROOT}/songlist/thumb/${item.item.id}`} alt={`${item.item.fullname || item.item.name} Image`} />
        <span>{item.item.name}</span>
        { item.item.artist.length === 0 ? null : <span>{item.item.artist}</span> }
        { mode ? <button className={`Cart-remove ic ic_action_remove`} type="button" onClick={this.handleItemRemove.bind(this, item, index)} /> : null}
      </div>
    )
  }

  handleItemRemove(item, index, e) {
    const { onItemRemove } = this.props
    stopPropagation(e)
    if (typeof onItemRemove !== 'function') {
      return
    }
    onItemRemove(item, index)
  }

  handleDeleteAction(e) {
    const { mode } = this.state
    stopPropagation(e)
    this.setState({
      mode: !mode
    })
  }

  handleCancel(e) {
    const { onCancel } = this.props
    e.preventDefault()
    stopPropagation(e)
    if (typeof onCancel !== 'function') {
      return
    }

    onCancel(e)
  }

  handleSubmit(e) {
    const { onSubmit } = this.props
    e.preventDefault()
    stopPropagation(e)
    if (typeof onSubmit !== 'function') {
      return
    }

    onSubmit(e)
  }

}
