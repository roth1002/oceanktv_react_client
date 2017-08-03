import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Cookies from 'js-cookie';

import {
  postSongToQueue,
  putSongToQueue,
  deleteSongFromQueue,
  putSongArrayToQueue,
  postSongArrayToQueue,
  deleteSongArrayFromQueue,
  postYoutubeSongToQueue,
  putYoutubeSongToQueue,
  postYoutubePlaylistToQueue,
} from '../actions/playlist';
import { postNewCollection } from '../actions/favorite';
import { toggleView } from '../actions/views';
import { stopPropagation } from '../utils/functions';
import { YoutubeImg } from '../assets/images/youtube_folder_normal.png';

class YoutubeActionPanel extends Component {

  constructor(props) {
    super(props);
    this._handlePlayerNotOpenConfirmModal = ::this._handlePlayerNotOpenConfirmModal
  }

  render() {
    const {
      isInQueue,
      isInFavorite,
      className,
      i18n,
      isInFolderList,
      isMultiMode,
      parentState,
      data,
      mouse,
      isInYoutubePlaylistSearch,
    } = this.props;
    const ClassNames = classnames(className);
    const srcUrl = data.selected.length === 1 ? data.selected[0].item.originUrl : null;
    return (
      <div className={ClassNames}>
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
          this.renderBtn(isInQueue, {
            className: `ActionPanel-btn ic ic_action_remove`,
            title: i18n[i18n.myLang]['actionpanel.button.remove'],
            onClick: this.removeFromQueue.bind(this)
          })
        }
        {
          this.renderBtn(isInYoutubePlaylistSearch, {
            className: `ActionPanel-btn ic ic_controlbar_plus`,
            title: i18n[i18n.myLang]['youtube.button.addcollection'],
            onClick: this.addToCollection.bind(this)
          })
        }
        {
          this.renderBtn(parentState !== 'multi', {
            className: `ActionPanel-btn Youtube-icon--actionpanel`,
            title: i18n[i18n.myLang]['youtube.button.openlink'],
            onClick: () => window.open(srcUrl, '_blank')
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
    if ( data.isPlaylist ) {
      const { postYoutubePlaylistToQueue } = this.props;
      postYoutubePlaylistToQueue({ id: data.vid, mode: 'add' })
      .then( () => {
        this._handlePlayerNotOpenConfirmModal('multi')
        if (typeof onAddToQueue === 'function') {
          onAddToQueue();
        }
      })
    } else if ( mouse.move ) {
      const { postSongArrayToQueue, onAddToQueue } = this.props;
      const multiPostData = data.selected.map( item => Object.assign({}, {songid: item.item.id, source_type: item.item.sourceType}));
      postSongArrayToQueue(multiPostData)
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi')
        if (typeof onAddToQueue === 'function') {
          onAddToQueue();
        }
      });
    } else {
      const { postYoutubeSongToQueue, onAddToQueue } = this.props;
      if (typeof onAddToQueue === 'function') {
        return onAddToQueue(evt, data, postYoutubeSongToQueue);
      }

      return postYoutubeSongToQueue(data.selected[0].item.id, data.selected[0].item.name, data.selected[0].item.sourceType).then(() => this._handlePlayerNotOpenConfirmModal('single'));
    }
  }

  insertToQueue(evt) {
    const { data, mouse } = this.props;
    stopPropagation(evt);
    if ( data.isPlaylist ) {
      const { postYoutubePlaylistToQueue } = this.props;
      postYoutubePlaylistToQueue({ id: data.vid, mode: 'insert' })
      .then( () => {
        this._handlePlayerNotOpenConfirmModal('multi')
        if (typeof onAddToQueue === 'function') {
          onAddToQueue();
        }
      })
    } else if ( mouse.move ) {
      const { putSongArrayToQueue, onInsertToQueue } = this.props;
      const multiPutData = data.selected.map( item => Object.assign({}, {songid: item.item.id, source_type: item.item.sourceType}));
      putSongArrayToQueue(multiPutData)
      .then(() => {
        this._handlePlayerNotOpenConfirmModal('multi')
        if (typeof onInsertToQueue === 'function') {
          return onInsertToQueue();
        }
      });
    } else {
      const { putYoutubeSongToQueue, onInsertToQueue } = this.props;
      if (typeof onInsertToQueue === 'function') {
        return onInsertToQueue(evt, data, putYoutubeSongToQueue);
      }

      return putYoutubeSongToQueue(data.selected[0].item.id, data.selected[0].item.name, data.selected[0].item.sourceType).then(() => this._handlePlayerNotOpenConfirmModal('single'));
    }
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

  _handlePlayerNotOpenConfirmModal(value) {
    const { playerOnOff, toggleView, notifyFunc } = this.props;
    const isPlayAlwaysTip = Cookies.get('playNeverTip') === '1';
    return playerOnOff === 0 && isPlayAlwaysTip ?
      toggleView('modal', { visible: true, type: 'playerNotOpenConfirm' }) :
      notifyFunc(value) ;
  }

  addToCollection(evt) {
    const { postNewCollection, data: { vid }, notifyFunc } = this.props;
    return postNewCollection({sharelink: vid})
    .then( () => {
      notifyFunc('single');
    });
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
    putYoutubeSongToQueue: bindActionCreators(putYoutubeSongToQueue, dispatch),
    deleteSongFromQueue: bindActionCreators(deleteSongFromQueue, dispatch),
    putSongArrayToQueue: bindActionCreators(putSongArrayToQueue, dispatch),
    postSongArrayToQueue: bindActionCreators(postSongArrayToQueue, dispatch),
    deleteSongArrayFromQueue: bindActionCreators(deleteSongArrayFromQueue, dispatch),
    postYoutubeSongToQueue: bindActionCreators(postYoutubeSongToQueue, dispatch),
    toggleView: bindActionCreators(toggleView, dispatch),
    postNewCollection: bindActionCreators(postNewCollection, dispatch),
    postYoutubePlaylistToQueue: bindActionCreators(postYoutubePlaylistToQueue, dispatch),
  }
}

YoutubeActionPanel.propTypes = {
  data: PropTypes.shape({
    songId: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeActionPanel);
