import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import emptyImg from '../assets/images/ic_empty.png';

class List extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const list = findDOMNode(this.refs.list);
    if ( list &&  this.props.scroll ) {
      list.scrollTop = this.props.scroll.top;
    }
  }

  render() {
    const {
      items, renderItem, renderMore, renderEmpty,
      isFetching, pageCount, className,
      i18nNoContent, isNetworkTrouble
    } = this.props;

    const isEmpty = items.length === 0;
    const ClassName = classnames(`List`, `scrollbar-style-1`, className, {
      'is-empty': isEmpty
    });
    return (
      <div ref="list" draggable="false" className={ClassName} onScroll={debounce(this.handleScroll.bind(this), 1000)}>
        {this.renderSpinner(isFetching)}
        {typeof renderEmpty === 'function' && isEmpty && !isFetching ? renderEmpty() : this.renderNoContent(isEmpty && !isFetching, i18nNoContent, isNetworkTrouble)}
        {items.map(renderItem)}
        {typeof renderMore === 'function' ? renderMore() : null}
      </div>
    );
  }

  renderSpinner(isFetching) {
    const spinnerClassName = classnames('Spnnier loader', {
      'Spinner-hidden': !isFetching
    })
    return (
      <div className={spinnerClassName}/>
    );
  }

  renderNoContent(isShow, i18nNoContent, isNetworkTrouble) {
    const noContentClass = classnames('Empty', {
      'Noempty': !isShow
    });
    return isNetworkTrouble ?
      (
        <div className={noContentClass}>
          <span className={`ic ic_warning`} style={ {'fontSize' : '5vw'} } />
          <span>{i18nNoContent}</span>
        </div>
      )
    : (
      <div className={noContentClass}>
        <img src={emptyImg} alt="Empty" />
        <span>{i18nNoContent}</span>
      </div>
    )
  }

  handleScroll(evt) {
    const { onLoadMore, editScroll } = this.props
    const list = findDOMNode(this.refs.list);
    if ( typeof editScroll === 'function' ) {
      editScroll(list.scrollTop);
    }
    if (typeof onLoadMore !== 'function') {
      return;
    }

    if (list.scrollTop > list.scrollHeight - list.clientHeight - 100) {
      onLoadMore(evt);
    }
  }
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  renderMore: PropTypes.func,
  renderEmpty: PropTypes.func,
  isFetching: PropTypes.bool.isRequired,
  onLoadMore: PropTypes.func,
  pageCount: PropTypes.number,
  editScroll: PropTypes.func,
  scroll: PropTypes.object,
  i18nNoContent: PropTypes.string
};

List.defaultProps = {
  isFetching: false
};

export default List;
