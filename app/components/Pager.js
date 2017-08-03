import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Cookies from 'js-cookie';
import { stopPropagation } from '../utils/functions';
import { ROOT } from '../constants/Config';

export default class Pager extends Component {
  constructor(props) {
    super(props);
    this._handlePlayerNotOpenConfirmModal = ::this._handlePlayerNotOpenConfirmModal
  }

  render() {
    return (
      <div>
        {this._renderContent(this.props)}
      </div>
    );
  }

  _renderContent(props) {
    const {
      className,
      total,
      i18n,
      backStratumClass,
      title,
      openEditModal,
      isInFavorite,
      isInRecommand,
      isInCollection,
      isDisable,
      data,
    } = props;
    const options = [
      {
        label: '15',
        value: 15
      }
    ]
    const classes = classnames(`Page-title`, `scrollbar-style-1`, className);

    return (
      <h1 className={`${classes}`}>
        <div className={`Page-title-left`}>
          <span className={`${backStratumClass}`} onClick={this.handleGoBack.bind(this)}></span>
          <span className={`Pager-title-context`}>{title}</span>
          {
            typeof openEditModal === 'function' ?
            <span
              className="ic ic_submenu_rename SideTab-link--listview-edit"
              onClick={ (evt) => openEditModal(evt, data.favorId, data.favorName) } />
            : null
          }
          {
            this._renderBtn(isInFavorite || isInRecommand || isInCollection, {
              className: `Filter-btn ic ic_action_requesting`,
              children: `${i18n[i18n.myLang]['filter.button.addAll']}`,
              onClick: this._addAllToQueue.bind(this),
              disabled: isInFavorite && total === 0
            })
          }
          {
            this._renderBtn(isInFavorite || isInRecommand || isInCollection, {
              className: `Filter-btn ic ic_toolbar_shuffle`,
              children: `${i18n[i18n.myLang]['filter.button.addRandom']}`,
              onClick: this._freeToQueue.bind(this),
              disabled: isInFavorite && total === 0
            })
          }
        </div>
        {this.renderPaging()}
      </h1>
    );
  }

  renderPaging() {
    const {
      i18n,
      isNoPaging,
      total,
      myPage,
      onLoadData,
      pageCount,
      selectedCount,
      firstNum,
      lastNum,
      pagerType,
      isTokenPaging,
      isFetching,
    } = this.props;
    const totalUnit = `pager.total.${pagerType}`;

    const preIconClassName = myPage === 1  ? 'Pager-disable' : 'Pager';
    const nextIconClassName = myPage * pageCount >= total ? 'Pager-disable' : 'Pager';
    const selectedCountText = `${i18n[i18n.myLang]['pager.total.selected.prefix']}:${this.props.selectedCount}`;
    const tailPageNum = Math.ceil( total / pageCount );
    const rangeContextText = `${i18n[i18n.myLang]['pager.range.context']} ${isNaN(firstNum) ? 0 : firstNum}-${isNaN(lastNum) ? 0 : lastNum} ${i18n[i18n.myLang][totalUnit]}`;


    if ( isNoPaging ) {
      return (
        <span className={`Page-total`}>
          <span className={`Page-display-prefix`}>{`${i18n[i18n.myLang]['pager.total.prefix']} : ${total === undefined ? 0 : total} ${i18n[i18n.myLang][totalUnit]}`}</span>
        </span>
      );
    } else if ( total > 0 && myPage ) {
      return (
        <div className={`Page-total`}>
          { selectedCount > 0 ? selectedCountText : rangeContextText }
          <span className={`Page-display-prefix`}>{`(${i18n[i18n.myLang]['pager.total.prefix']} : ${total === undefined ? 0 : total} ${i18n[i18n.myLang][totalUnit]})`}</span>
          {/*<Select
            className={`Pager-select`}
            name="pagerCountOption" options={options}
            onChange={this.handleSelect.bind(this)}
            searchable={false}
            clearable={false}
            value={pageCount} />*/}
          <span className={`Page-display-item`}>{`, ${i18n[i18n.myLang]['pager.total.page.prefix']} ${myPage === undefined ? 0 : myPage} ${i18n[i18n.myLang]['pager.total.page']}`}</span>
          { isTokenPaging ? null : <span className={`${preIconClassName} ic ic_topbar_top`} onClick={ (evt) => myPage === 1 || isFetching ? null : onLoadData(evt, pageCount, null, 1) }></span>}
          <span className={`${preIconClassName} ic ic_topbar_pre`} onClick={ (evt) => myPage === 1 || isFetching ? null : onLoadData(evt, pageCount, -1) }></span>
          <span className={`${nextIconClassName} ic ic_topbar_next`} onClick={ (evt) => myPage * pageCount >= total || isFetching ? null : onLoadData(evt, pageCount, 1) }></span>
          { isTokenPaging ? null : <span className={`${nextIconClassName} ic ic_topbar_bottom`} onClick={ (evt) => myPage * pageCount >= total || isFetching ? null : onLoadData(evt, pageCount, null, tailPageNum) }></span>}
        </div>
      );
    }
  }

  _renderBtn(display, props) {
    const newProps = Object.assign({}, props, {
      children: <span>{props.children}</span>
    })
    if (!display) {
      return ;
    }

    return (
      <button {...newProps}></button>
    );
  }

  _addAllToQueue(evt) {
    const {
      data,
      postFavoriteToQueue,
      postRecommandlistToQueue,
      postCollectionlistToQueue,
      notifyFunc,
      mouseActions,
      isInFavorite,
      isInRecommand,
      isInCollection,
    } = this.props;
    if ( isInFavorite ) {
      postFavoriteToQueue(data.favorId, 'add')
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi');
        mouseActions.removeMove();
      });
    } else if ( isInRecommand ) {
      postRecommandlistToQueue({id: data.defaultId, mode: 'add'})
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi');
        mouseActions.removeMove();
      });
    } else if ( isInCollection ) {
      postCollectionlistToQueue({id: data.cloudlinkId, mode: 'add'})
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi');
        mouseActions.removeMove();
      });
    }
    stopPropagation(evt);
  }

  _freeToQueue(evt) {
    const {
      data,
      postFavoriteToQueue,
      postRecommandlistToQueue,
      postCollectionlistToQueue,
      notifyFunc,
      mouseActions,
      isInFavorite,
      isInRecommand,
      isInCollection,
    } = this.props;

    if ( isInFavorite ) {
      postFavoriteToQueue(data.favorId, 'add', 'True')
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi')
        mouseActions.removeMove();
      });
    } else if ( isInRecommand ) {
      postRecommandlistToQueue({id: data.defaultId, mode: 'add', random: 'True'})
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi')
        mouseActions.removeMove();
      });
    } else if ( isInCollection ) {
      postCollectionlistToQueue({id: data.cloudlinkId, mode: 'add', random: 'True'})
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi')
        mouseActions.removeMove();
      });
    }
    stopPropagation(evt);
  }


  handleSelect(newVal, evt) {
    const { onLoadData } = this.props;
    onLoadData(null, newVal, 0)
    this.setState({
      select: newVal
    });
  }

  _handlePlayerNotOpenConfirmModal(value) {
    const { playerOnOff, toggleView, notifyFunc } = this.props;
    const isPlayAlwaysTip = Cookies.get('playNeverTip') === '1';
    return playerOnOff === 0 && isPlayAlwaysTip ?
      toggleView('modal', { visible: true, type: 'playerNotOpenConfirm', forceMulti: true }) :
      notifyFunc(value) ;
  }

  handleGoBack() {
    const { backUrlData } = this.props;
    if ( backUrlData ) {
      if ( backUrlData.cloudType === 'search' ) {
        this.context.router.push(`${ROOT}/app/youtube`);
      } else {
        this.context.router.replace(backUrlData.url);
      }
    } else {
      this.context.router.goBack();
    }
  }
}

Pager.contextTypes = {
  router: React.PropTypes.object
};

Pager.defaultProps = {
  currentLen: 0,
  totalLen: 0
}

