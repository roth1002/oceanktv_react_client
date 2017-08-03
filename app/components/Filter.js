import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { postFavoriteToQueue, putSongArrayToQueue, postSongArrayToQueue, deleteSongArrayFromQueue } from '../actions/playlist';
import { deleteSongArrayFromFavorite, loadSongsFromFavorite, loadListFromFavorite } from '../actions/favorite';
import { toggleView } from '../actions/views';
import { stopPropagation } from '../utils/functions'
import MUTISELECT_DROPDOWN from '../assets/images/ic_toolbar_dropdown.png'

class Filter extends Component {
  static propTypes = {
    data: PropTypes.shape({
      favorId: PropTypes.string,
      selected: PropTypes.array,
      multiMode: PropTypes.bool,
      flow: PropTypes.number
    }),
    isInFavorite: PropTypes.bool,
    isInHistory: PropTypes.bool,
    isDisable: PropTypes.bool,
    isInCurrent: PropTypes.bool,
    canClearAll: PropTypes.bool,
    afterSuccess: PropTypes.func
  }

  state = {
    showDropMenu: false
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { data, className, isInFavorite, isDisable, i18n, isInHistory, isInCurrent } = this.props;
    const ClassName = classnames(`Filter`, className);
    const multiModeEnableIcon = !( data && data.selected && data.selected.length !== 0);
    const showActionPanelDivider = (this.props.isMulti && isInFavorite === undefined) || this.props.isMulti || (this.props.isMulti && !isInFavorite && !isInHistory) || (this.props.isMulti && isInFavorite !== undefined && isInFavorite);
    return (
      <div className={ClassName}>
        <div className={`Filter-left`}>
          {/*
            this._renderMultiSelectBtn(true, {
              className: `Filter-btn ic ic_toolbar_multiselect_off ${this.props.isMulti ? 'is-active' : ''}`,
              onClick: this._unComplete.bind(this),
              disabled: isDisable
            })
          */}
          {/*
            this._renderBtn(this.props.canClearAll !== undefined && this.props.canClearAll && !this.props.isMulti, {
              className: `Filter-btn`,
              children: `清空清單`,
              onClick: this._unComplete.bind(this),
              disabled: isDisable
            })
          */}
          {/*
            showActionPanelDivider ?
            <div className={`Filter-divider ${isDisable ? 'is-disable' : ''}`} />
            : null
          */}
          {
            this._renderBtn(this.props.isMulti, {
              className: `Filter-btn ic ic_action_requesting ic_action_requesting_custom`,
              title: i18n[i18n.myLang]['actionpanel.button.play'],
              onClick: this._addAllToQueue.bind(this),
              disabled: multiModeEnableIcon
            })
          }
          {
            this._renderBtn(this.props.isMulti, {
              className: `Filter-btn ic ic_action_inserting ic_action_inserting_custom`,
              title: i18n[i18n.myLang]['actionpanel.button.insert'],
              onClick: this._freeToQueue.bind(this),
              disabled: multiModeEnableIcon
            })
          }
          {
            this._renderBtn(this.props.isMulti && isInFavorite === undefined, {
              className: `Filter-btn ic ic_action_favorite`,
              title: i18n[i18n.myLang]['actionpanel.button.addFavor'],
              onClick: this.addToFavorite.bind(this),
              disabled: multiModeEnableIcon
            })
          }
          {
            this._renderBtn(this.props.isMulti && isInCurrent, {
              className: `Filter-btn ic ic_action_remove`,
              title: i18n[i18n.myLang]['actionpanel.button.remove'],
              onClick: this._deleteFromQueue.bind(this),
              disabled: multiModeEnableIcon
            })
          }
          {
            this._renderBtn(this.props.isMulti && isInFavorite !== undefined && isInFavorite, {
              className: `Filter-btn ic ic_action_remove`,
              title: i18n[i18n.myLang]['actionpanel.button.removeFavor'],
              onClick: this._deleteFromFavor.bind(this),
              disabled: multiModeEnableIcon
            })
          }
          {
            isInFavorite ?
            <div className={`Filter-divider ${isDisable ? 'is-disable' : ''}`} />
            : null
          }
          {
            this._renderBtn(isInFavorite, {
              className: `Filter-btn ic ic_action_requesting`,
              children: `${i18n[i18n.myLang]['filter.button.addAll']}`,
              onClick: this._addAllToQueue.bind(this),
              disabled: isDisable
            })
          }
          {
            this._renderBtn(isInFavorite, {
              className: `Filter-btn ic ic_toolbar_shuffle`,
              children: `${i18n[i18n.myLang]['filter.button.addRandom']}`,
              onClick: this._freeToQueue.bind(this),
              disabled: isDisable
            })
          }
        </div>
        <div className={`Filter-right`}></div>
      </div>
    );
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

  _renderMultiSelectBtn(display, props) {
    if (!display) {
      return;
    }
    const dividerClassName = classnames(`Filter-ic-divider`,
      {
        'is-disable': props.disabled
      }
    );
    return (
      <div style={{'display' : 'flex'}}>
        <button {...props}></button>
        <div className={dividerClassName} />
        <button className={`Filter-dropdown`} disabled={props.disabled} onClick={this._handleDropMenu.bind(this)}>
          <img src={MUTISELECT_DROPDOWN} />
        </button>
        {this._renderDropMenu()}
      </div>
    );
  }

  _renderDropMenu() {
    const { i18n, onHandleSelectAll, onHandleClearAll, isInHistory } = this.props;
    const dropMenuClassName = classnames({
      'Filter-Dropmenu': !isInHistory,
      'Filter-Dropmenu-History': isInHistory,
      'is-visible': this.state.showDropMenu
    });
    return (
      <div className={dropMenuClassName}>
        <ul className={`Filter-dropmenu-content`}>
          <div className={`Filter-Dropmenu-content-btn`} onClick={(evt) => this._handleSelectAll(evt)}>
            <span>全選</span>
          </div>
          <div className={`Filter-Dropmenu-content-btn`} onClick={(evt) => this._handleClearAll(evt)}>
            <span>全不選</span>
          </div>
        </ul>
      </div>
    );
  }

  _handleDropMenu() {
    this.setState({showDropMenu: !this.state.showDropMenu})
  }

  _addAllToQueue(evt) {
    const { data, postFavoriteToQueue, postSongArrayToQueue, notifyFunc } = this.props;
    const multiMode = data && data.selected && data.selected.length !== 0;
    if ( multiMode ) {
      const multiPostData = data.selected.map( item => Object.assign({}, {songid: item.songid, flow: item.flow}));
      postSongArrayToQueue(multiPostData)
      .then(() => notifyFunc());
    } else {
      postFavoriteToQueue(data.favorId, 'False')
      .then(() => notifyFunc());
    }
    stopPropagation(evt)
  }

  _freeToQueue(evt) {
    const { data, postFavoriteToQueue, putSongArrayToQueue, notifyFunc } = this.props;
    const multiMode = data && data.selected && data.selected.length !== 0;
    if ( multiMode ) {
      const multiPutData = data.selected.map( item => Object.assign({songid: item.songid, flow: item.flow}));
      putSongArrayToQueue(multiPutData)
      .then(() => notifyFunc());
    } else {
      postFavoriteToQueue(data.favorId, 'True')
      .then(() => notifyFunc());
    }
    stopPropagation(evt)
  }

  _unComplete(evt) {
    this.props.handleMultiMode(!this.props.isMulti);
    stopPropagation(evt)
  }

  addToFavorite(evt) {
    const { data, toggleView } = this.props;
    stopPropagation(evt)
    return toggleView('modal', { visible: true, type: 'favorites', data })
  }

  _deleteFromFavor(evt) {
    const { data, deleteSongArrayFromFavorite, notifyFunc, loadSongsFromFavorite, afterSuccess, loadListFromFavorite } = this.props;
    const deleteData = data.selected.map( item => item.songid );
    deleteSongArrayFromFavorite(data.favorId, deleteData)
    .then( () => {
      notifyFunc();
      loadSongsFromFavorite(data.favorId);
      loadListFromFavorite();
      afterSuccess();
    });
  }

  _deleteFromQueue(evt) {
    const { data, deleteSongArrayFromQueue, notifyFunc, afterSuccess } = this.props;
    const deleteData = data.selected.map( item => Object.assign({index: item.index, songid: item.songid}) );
    deleteSongArrayFromQueue(deleteData)
    .then(() => {
      notifyFunc();
      afterSuccess();
    });
  }

  _handleSelectAll(evt) {
    stopPropagation(evt);
    this.setState({showDropMenu: !this.state.showDropMenu});
    this.props.onHandleSelectAll();
  }

  _handleClearAll(evt) {
    stopPropagation(evt);
    this.setState({showDropMenu: !this.state.showDropMenu});
    this.props.onHandleClearAll();
  }

}

function mapStateToProps(state) {
  return {
    i18n: state.i18n
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postFavoriteToQueue: bindActionCreators(postFavoriteToQueue, dispatch),
    putSongArrayToQueue: bindActionCreators(putSongArrayToQueue, dispatch),
    postSongArrayToQueue: bindActionCreators(postSongArrayToQueue, dispatch),
    deleteSongArrayFromQueue: bindActionCreators(deleteSongArrayFromQueue, dispatch),
    deleteSongArrayFromFavorite: bindActionCreators(deleteSongArrayFromFavorite, dispatch),
    loadSongsFromFavorite: bindActionCreators(loadSongsFromFavorite, dispatch),
    loadListFromFavorite: bindActionCreators(loadListFromFavorite, dispatch),
    toggleView: bindActionCreators(toggleView, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
