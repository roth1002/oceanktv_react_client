import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Cookies from 'js-cookie';
import FlashDetect from 'flash-detect';

import {
  postSongToQueue,
  putSongToQueue,
  deleteSongFromQueue,
  putSongArrayToQueue,
  postSongArrayToQueue,
  deleteSongArrayFromQueue,
  postYoutubeSongToQueue,
  putYoutubeSongToQueue
} from '../actions/playlist';
import { deleteSongArrayFromFavorite } from '../actions/favorite';
import { deleteSongFromFavorite } from '../actions/favorite';
import { loadPlaylist } from '../actions/playlist';
import { toggleView, detectFlashFail, flashVersionTooOld } from '../actions/views';
import { stopPropagation } from '../utils/functions'

class ActionPanel extends Component {

  constructor(props) {
    super(props);
    this._handlePlayerNotOpenConfirmModal = ::this._handlePlayerNotOpenConfirmModal
  }

  render() {
    const { isInQueue, isInFavorite, className, i18n, isInFolderList, isMultiMode, parentState } = this.props;
    const ClassNames = classnames(className);

    return (
      <div className={ClassNames}>
        {
          this.renderBtn(parentState !== 'multi', {
            className: `ActionPanel-btn ic ic_action_preview`,
            title: i18n[i18n.myLang]['actionpanel.button.preview'],
            onClick: this.handlePreview.bind(this)
          })
        }
        {
          this.renderBtn(true, {
            className: `ActionPanel-btn ic ic_action_requesting`,
            title: i18n[i18n.myLang]['actionpanel.button.play'],
            onClick: this.addToQueue.bind(this),
          })
        }
        {
          this.renderBtn(true, {
            className: `ActionPanel-btn ic ic_action_inserting`,
            title: i18n[i18n.myLang]['actionpanel.button.insert'],
            onClick: this.insertToQueue.bind(this)
          })
        }
        {
          this.renderBtn(!isInFavorite, {
            className: `ActionPanel-btn ic ic_action_favorite`,
            title: i18n[i18n.myLang]['actionpanel.button.addFavor'],
            onClick: this.addToFavorite.bind(this)
          })
        }
        {
          this.renderBtn(isInQueue, {
            className: `ActionPanel-btn ic ic_action_remove`,
            title: i18n[i18n.myLang]['actionpanel.button.remove'],
            onClick: this.removeFromQueue.bind(this)
          })
        }
        {
          this.renderBtn(isInFavorite, {
            className: `ActionPanel-btn ic ic_action_remove`,
            title: i18n[i18n.myLang]['actionpanel.button.removeFavor'],
            onClick: this.removeFromFavorite.bind(this)
          })
        }
        {
          this.renderBtn(isInFolderList && this.props.data.selected.length <= 1, {
            className: `ActionPanel-btn ic ic_submenu_rename`,
            title:  i18n[i18n.myLang]['actionpanel.button.fileEdit'],
            onClick: this.editFileRule.bind(this)
          })
        }
      </div>
    );
  }

  renderBtn(display, props) {
    if (!display) {
      return ;
    }

    return (
      <button {...props}></button>
    );
  }

  addToQueue(evt) {
    const { data, mouse } = this.props;
    stopPropagation(evt);
    if ( mouse.move ) {
      const { postSongArrayToQueue, onAddToQueue } = this.props;
      const multiPostData = data.selected.map( item => Object.assign({}, {songid: item.item.id, source_type: item.item.sourceType, flow: item.item.flow}));
      postSongArrayToQueue(multiPostData)
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi')
        if (typeof onAddToQueue === 'function') {
          onAddToQueue();
        }
      });
    } else {
      const { postSongToQueue, postYoutubeSongToQueue, onAddToQueue } = this.props;
      if (typeof onAddToQueue === 'function') {
        return onAddToQueue(evt, data, postSongToQueue);
      }
      const isLocalFile = 'sourceType' in data.selected[0].item && data.selected[0].item.sourceType !== 0;
      return isLocalFile ? postYoutubeSongToQueue(data.selected[0].item.id, data.selected[0].item.name, data.selected[0].item.sourceType).then(() => this._handlePlayerNotOpenConfirmModal('single'))
                         : postSongToQueue(data.selected[0].item.id, data.selected[0].item.name, data.selected[0].item.flow).then(() => this._handlePlayerNotOpenConfirmModal('single'));
    }
  }

  insertToQueue(evt) {
    const { data, mouse } = this.props;
    stopPropagation(evt)
    if ( mouse.move ) {
      const { putSongArrayToQueue, onInsertToQueue } = this.props;
      const multiPutData = data.selected.map( item => Object.assign({}, {songid: item.item.id, source_type: item.item.sourceType, flow: item.item.flow}));
      putSongArrayToQueue(multiPutData)
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi')
        if (typeof onInsertToQueue === 'function') {
          return onInsertToQueue();
        }
      });
    } else {
      const { putSongToQueue, putYoutubeSongToQueue, onInsertToQueue } = this.props;
      if (typeof onInsertToQueue === 'function') {
        return onInsertToQueue(evt, data, putSongToQueue);
      }
      const isLocalFile = 'sourceType' in data.selected[0].item && data.selected[0].item.sourceType !== 0;
      return isLocalFile ? putYoutubeSongToQueue(data.selected[0].item.id, data.selected[0].item.name, data.selected[0].item.sourceType).then(() => this._handlePlayerNotOpenConfirmModal('single'))
                         : putSongToQueue(data.selected[0].item.id, data.selected[0].item.name, data.selected[0].item.flow).then(() => this._handlePlayerNotOpenConfirmModal('single'));
    }
  }

  addToFavorite(evt) {
    const { data, toggleView } = this.props;
    stopPropagation(evt);
    const filterSelected = data.selected.filter( it => it.item.sourceType === 0 || !('sourceType' in it.item) );
    const filterData = { ...data, selected: filterSelected };
    const isNeedTip = data.selected.length !== filterSelected.length;
    return toggleView('modal', { visible: true, type: 'favorites', data: filterData, isNeedTip })
  }

  removeFromQueue(evt) {
    const { data, mouse } = this.props;
    stopPropagation(evt);
    if ( mouse.move ) {
      const { deleteSongArrayFromQueue, notifyFunc, onRemoveFromQueue } = this.props;
      const multiDeleteData = data.selected.map( item => Object.assign({index: item.index, songid: item.songid}) );
      deleteSongArrayFromQueue(multiDeleteData)
      .then( () => {
        notifyFunc('multi');
        if ( typeof onRemoveFromQueue === 'function' ) {
          return onRemoveFromQueue();
        }
      });
    } else {
      const { deleteSongFromQueue, onRemoveFromQueue, notifyFunc } = this.props;
      if (typeof onRemoveFromQueue === 'function') {
        return onRemoveFromQueue(evt, data, deleteSongFromQueue);
      }

      return deleteSongFromQueue(data.selected[0].item.id, data.selected[0].item.index, data.selected[0].item.name).then( () => notifyFunc('single') );
    }
  }

  removeFromFavorite(evt) {
    const { data, mouse } = this.props;
    stopPropagation(evt);
    if ( mouse.move ) {
      const { deleteSongArrayFromFavorite, notifyFunc, onRemoveFromFavorite } = this.props;
      const multiDeleteData = data.selected.map( item => item.songid );
      deleteSongArrayFromFavorite(data.favorId, multiDeleteData)
      .then( () => {
        notifyFunc('multi')
        if (typeof onRemoveFromFavorite === 'function') {
          return onRemoveFromFavorite();
        }
      });
    } else {
      const { deleteSongFromFavorite, onRemoveFromFavorite, notifyFunc } = this.props;
      deleteSongFromFavorite(data.favorId, data.songId, data.songName).then( () => notifyFunc('single') );
      if (typeof onRemoveFromFavorite === 'function') {
        return onRemoveFromFavorite(evt, data, deleteSongFromFavorite);
      }
    }
  }

  handlePreview(evt) {
    const { data, toggleView, notifyFunc, detectFlashFail, flashVersionTooOld } = this.props;
    const flashDetectObj = new FlashDetect();
    if ( flashDetectObj.installed ) {
      if ( flashDetectObj.major <= 21) {
        flashVersionTooOld();
        notifyFunc('control', 5000);
      } else {
        toggleView('modal', { visible: true, type: 'player', data });
      }
    } else {
      detectFlashFail()
      notifyFunc('control');
    }
    evt.preventDefault();
    stopPropagation(evt);
  }

  editFileRule(evt) {
    const { data, toggleView } = this.props;
    stopPropagation(evt)
    return toggleView('modal', { visible: true, type: 'fileEdit', data })
  }

  _handlePlayerNotOpenConfirmModal(value) {
    const { playerOnOff, toggleView, notifyFunc } = this.props;
    const isPlayAlwaysTip = Cookies.get('playNeverTip') === '1';
    return playerOnOff === 0 && isPlayAlwaysTip ?
      toggleView('modal', { visible: true, type: 'playerNotOpenConfirm' }) :
      notifyFunc(value) ;
  }
}

function mapStateToProps(state) {
  return {
    i18n: state.i18n,
    mouse: state.mouse
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postSongToQueue: bindActionCreators(postSongToQueue, dispatch),
    putSongToQueue: bindActionCreators(putSongToQueue, dispatch),
    deleteSongFromQueue: bindActionCreators(deleteSongFromQueue, dispatch),
    deleteSongFromFavorite: bindActionCreators(deleteSongFromFavorite, dispatch),
    putSongArrayToQueue: bindActionCreators(putSongArrayToQueue, dispatch),
    postSongArrayToQueue: bindActionCreators(postSongArrayToQueue, dispatch),
    deleteSongArrayFromQueue: bindActionCreators(deleteSongArrayFromQueue, dispatch),
    deleteSongArrayFromFavorite: bindActionCreators(deleteSongArrayFromFavorite, dispatch),
    loadPlaylist: bindActionCreators(loadPlaylist, dispatch),
    toggleView: bindActionCreators(toggleView, dispatch),
    postYoutubeSongToQueue: bindActionCreators(postYoutubeSongToQueue, dispatch),
    putYoutubeSongToQueue: bindActionCreators(putYoutubeSongToQueue, dispatch),
    detectFlashFail: bindActionCreators(detectFlashFail, dispatch),
    flashVersionTooOld: bindActionCreators(flashVersionTooOld, dispatch)
  }
}

ActionPanel.propTypes = {
  data: PropTypes.shape({
    songId: PropTypes.any,
    favorId: PropTypes.string,
    index:PropTypes.number,
    songName: PropTypes.string,
    flow: PropTypes.number,
    selected: PropTypes.array,
    isMulti: PropTypes.bool
  }).isRequired,
  isInFavorite: PropTypes.bool,
  isInQueue: PropTypes.bool,
  isInFolderList: PropTypes.bool,
  onAddToQueue: PropTypes.func,
  onInsertToQueue: PropTypes.func,
  onAddToFavorite: PropTypes.func,
  onRemoveFromQueue: PropTypes.func,
  onRemoveFromFavorite: PropTypes.func,
  notifyFunc: PropTypes.func,
  afterSuccess: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionPanel);
