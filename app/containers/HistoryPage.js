import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import moment from 'moment';

import { API_ROOT } from '../constants/Config';
import IMG_DEFAULT from '../assets/images/ic_thumbnail_default.png';
import YOUTUBE from '../assets/images/youtube_folder_normal.png';

import List from '../components/List';
import SideNav from '../components/SideNav';
import Pager from '../components/Pager';
import ActionPanel from '../components/ActionPanel';
import Notification from '../components/Notification';
import YoutubeActionPanel from '../components/YoutubeActionPanel';

import { loadHistory } from '../actions/playlist';
import { putSongArrayToQueue, postSongArrayToQueue, postFavoriteToQueue } from '../actions/playlist';
import { loadListFromFavorite } from '../actions/favorite';
import { stopPropagation, getNextActionPage } from '../utils/functions'

class HistoryPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      songid: ''
    };
  }

  componentWillMount() {
    const { mouseActions, socket, loadHistory } = this.props;
    mouseActions.removeMove();
    socket.removeAllListeners('playlist.change');
    socket.removeAllListeners('songlist.song.change');
    socket.removeAllListeners('playlist.history.change');
    socket.removeAllListeners('youtube.playlist.change');
    this.props.loadHistory();
    this.props.loadListFromFavorite();
    socket.on('playlist.change', this.handlePlaylistSocketIoEvent.bind(this));
    socket.on('playlist.history.change', this.handleHistorySocketIoEvent.bind(this));
  }

  handlePlaylistSocketIoEvent(msg){
    const { fetchPlaylistInfo } = this.props;
    fetchPlaylistInfo();
  }

  handleHistorySocketIoEvent(msg){
    const { loadHistory, historyInfo } = this.props;
    loadHistory(historyInfo.page, 15, 'desc');
  }

  render() {
    const {
      historyInfo, songsInHistory, listsInFavorite,
      footerState, i18n, toggleNotification, mouse,
      putSongArrayToQueue, postSongArrayToQueue, postFavoriteToQueue,
      sidenav } = this.props;
    const ClassName = classnames({
      'Page': true,
      'Page--history': true,
      'is-footer-hidden': !footerState.visible
    });
    const i18nNoContent = i18n[i18n.myLang]['songbook.list.nocontent']

    const ActionPanelClassName = classnames('ActionPanel-inmulti', {
      'is-show': mouse.move,
      'is-selected': true
    });

    const data = {
      selected: this.state.selected,
      multiMode: true,
      onAddToFavorite: this.handleSetInit.bind(this)
    };
    const mouseTop = mouse && mouse.move ? (mouse.pageY - 20) + 'px' : '-20%';
    return (
      <div className={ClassName}>
        <SideNav
          toggleNotification={toggleNotification}
          i18n={i18n}
          sidenav={sidenav} />
        <div className={`Page-content`}>
          {/*<Filter
            totalLen={songsInHistory.total}
            handleMultiMode={this._handleMultiMode.bind(this)}
            data={{selected: this.state.selected, multiMode: this.state.isMulti}}
            notifyFunc={this.props.toggleNotification.bind(this)}
            isMulti={this.state.isMulti}
            isInHistory={true}
            onHandleSelectAll={this._selectAll.bind(this)}
            onHandleClearAll={this._clearAll.bind(this)} />*/}
          <div className={`Page-main`}>
            {/*<h1 className={`Page-title`}>
              {i18n[i18n.myLang]['homepage.title.history']}
              <span className={`Page-total`}>{`${i18n[i18n.myLang][this.state.isMulti ? 'pager.total.selected.prefix' : 'pager.total.prefix']}: ${this.state.isMulti ? this.state.selected.length : (historyInfo.total === undefined ? 0 : historyInfo.total)} ${i18n[i18n.myLang][this.state.isMulti ? 'pager.total.item' : 'pager.total.songs']}`}</span>
            </h1>*/}
            <Pager
              i18n={i18n}
              putSongArrayToQueue={putSongArrayToQueue}
              postSongArrayToQueue={postSongArrayToQueue}
              postFavoriteToQueue={postFavoriteToQueue}
              pagerType={'songs'}
              pageCount={15}
              className={``}
              backStratumClass={``}
              myPage={historyInfo.page}
              total={historyInfo.total}
              title={i18n[i18n.myLang]['homepage.title.history']}
              history={history}
              isInFavorite={false}
              firstNum={historyInfo.total === 0 ? 0 : (historyInfo.page - 1) * 15 + 1}
              lastNum={historyInfo.page * 15 >= historyInfo.total ? historyInfo.total : historyInfo.page * 15}
              playerOnOff={this.props.playerOnOff}
              selectedCount={mouse.move ? this.state.selected.length : 0}
              onLoadData={this.loadSongs.bind(this)}
              isFetching={historyInfo.isFetching} >
            </Pager>
            <div className={`History History--w60`}>
              {
                historyInfo.total === 0 ? null :
                <div className={`Favorite-head--folder-multimode`}>
                  <input
                    className={`Song-info-checkbox-folder-multimode`}
                    checked={this.state.selected.length === songsInHistory.length && this.state.selected.length !== 0 && mouse.move}
                    type="checkbox"
                    onChange={(evt) => this._handleSelectAll(evt, songsInHistory)} />
                  <div className={`Songname-multimode`}>
                    {i18n[i18n.myLang]['list.head.song']}
                  </div>
                  <div style={{marginLeft: '60px'}} className="Favorite-head-artists Artistsname-multimode">
                    {i18n[i18n.myLang]['list.head.artist']}
                  </div>
                  <div className={`History-head-date Date-multimode`}>
                    {i18n[i18n.myLang]['list.head.date']}
                  </div>
                  <div>
                      {i18n[i18n.myLang]['list.head.source']}
                    </div>
                </div>
              }
              <List
                className={`List--history History-body`}
                items={songsInHistory}
                renderItem={this.renderListItem.bind(this)}
                isFetching={historyInfo.isFetching}
                i18nNoContent={i18nNoContent} />
            </div>
          </div>
        </div>
        <div className={`ActionPanel-multi-history`} style={{'top': mouseTop}}>
          <ActionPanel
            className={ActionPanelClassName}
            isMultiMode={this.state.songid}
            data={data}
            parentState={`multi`}
            playerOnOff={this.props.playerOnOff}
            notifyFunc={toggleNotification.bind(this)}
            onAddToQueue={this.handleSetInit.bind(this)}
            onInsertToQueue={this.handleSetInit.bind(this)} />
        </div>
      </div>
    );
  }

  renderListItem(item, index) {
    const { selected } = this.state;
    const { mouse, toggleNotification } = this.props;
    const multiModeActiveActionPanel = selected.length ? selected[selected.length - 1].historyId === item.historyId : false;
    const ClassName = classnames({
      'Song Song--history': !mouse.move,
      'Song-multi Song--history': mouse.move,
      'is-inQueue': item.inPlaylist,
      'is-selected': multiModeActiveActionPanel
    });
    const LabelMultiModeClassName = classnames({
      'Song Song--history': !mouse.move,
      'Song-multi Song--history': mouse.move,
      'is-inQueue': item.inPlaylist,
      'is-selected': !this.state.selected.every(elem => elem.historyId !== item.historyId) && mouse.move
    });
    const ActionPanelClassName = classnames('ActionPanel', {
      'is-selected': multiModeActiveActionPanel,
      'is-unselected': !multiModeActiveActionPanel
    });
    const MultiModeClassName = classnames({
      'is-multimode': true
    });
    const data = {
      selected: this.state.selected,
      multiMode: false,
      songId: item.id,
      songName: item.name,
      flow: item.flow
    };
    const thumbSrc = item.sourceType !== 0 ? item.thumb : `${API_ROOT}/songlist/thumb/${item.id}`

    return (
      <label
        htmlFor={`historyMultiMode${item.historyId}`}
        key={index} className={LabelMultiModeClassName}
        onMouseOver={() => this.handleItemMouseOver(item)}>
        <div className={`Song-info`}>
          <input
            id={`historyMultiMode${item.historyId}`}
            checked={!this.state.selected.every(elem => elem.historyId !== item.historyId) && mouse.move}
            className={`Song-info-checkbox`}
            type="checkbox"
            onChange={(evt) => this._handleSelectItem(evt, { songid: item.id, flow: item.flow, historyId: item.historyId, item })} />
          <img className="Song-thumbnail"
              src={thumbSrc}
              onError={this.handleImgError.bind(this)} />
          <span className="Song-title">{item.name}</span>
          <span className={`Song-artist ${MultiModeClassName}`}>{item.artist}</span>
          <span className={`Song-time`}>{moment.unix(item.date).format('YYYY/MM/DD HH:mm')}</span>
          {this.renderSourceIcon(item.sourceType)}
        </div>
        { item.sourceType === 0 ?
          <ActionPanel
            className={ActionPanelClassName}
            isMultiMode={true}
            data={data}
            playerOnOff={this.props.playerOnOff}
            notifyFunc={toggleNotification.bind(this)} />
          :
          <YoutubeActionPanel
            className={ActionPanelClassName}
            isMultiMode={true}
            data={data}
            playerOnOff={this.props.playerOnOff}
            notifyFunc={toggleNotification.bind(this)} />
        }
      </label>
    );
  }

  renderSourceIcon(sourceType) {
    if ( sourceType === 1 || sourceType === 3 ) {
      return (
        <img src={YOUTUBE} />
      );
    } else {
      return (
        <div className={`Song-source`}>
          <span className={`ic ic_hd`} />
        </div>
      );
    }
  }

  handleImgError(e) {
    return e.currentTarget.src = IMG_DEFAULT
  }

  loadMore(evt) {
    const { songsInHistory, historyInfo, loadHistory } = this.props;
    if ( songsInHistory.length >= historyInfo.total ) {
      return ;
    }
    loadHistory(historyInfo.page + 1, 20);
  }

  loadSongs(evt, count, diff, forcePage) {
    const { songsInHistory, historyInfo, loadHistory, mouseActions } = this.props;
    const page = forcePage ? forcePage : getNextActionPage( historyInfo.page, count ,diff );
    this.setState({ selected: [] });
    mouseActions.removeMove();
    loadHistory(page, count);
  }

  _handleSelectItem(evt, action) {
    const { mouseActions, mouse } = this.props;
    stopPropagation(evt)
    if (evt.target.checked) {
      if ( !mouse.move ) {
        this.setState({ selected: [action]  });
        mouseActions.addMove();
      } else {
        this.setState({ selected: [...this.state.selected, action]  });
      }
    } else {
      const selected = this.state.selected.filter( item => item.historyId !== action.historyId );
      if ( this.state.selected.length === 1 ) {
        this.setState({ selected });
        mouseActions.removeMove();
      } else {
        this.setState({ selected });
      }
    }
  }

  _handleSelectAll(evt, songs) {
    const { mouseActions } = this.props;
    if (evt.target.checked) {
      const selected = songs.map( item => Object.assign({ songid: item.id, flow: item.flow, historyId: item.historyId, item }));
      if ( selected.length > 0 ) {
        this.setState({selected });
        mouseActions.addMove();
      }
    } else {
      this.setState({selected: [] });
      mouseActions.removeMove();
    }
  }

  handleItemMouseOver(item) {
    const { mouse } = this.props;
    if ( !mouse.move ) {
      this.setState({songid: item.id, selected: [{item}]})
    }
  }

  handleSetInit() {
    const { mouseActions } = this.props;
    this.setState({selected: [] });
    mouseActions.removeMove();
  }
}

function mapStateToProps(state, ownProps) {
  const {
    pagination: { songsFromPlaylist, listsElse },
    entities: { songsByHistoryId, lists },
    views, i18n
  } = state;
  const favoriteInfo = listsElse['favorite'] || { ids: [] };
  const listsInFavorite = favoriteInfo.ids.map(id => lists[id]);
  const historyInfo = songsFromPlaylist['history'] || { ids: [], page: 0 };
  const songsInHistory = historyInfo.ids.map(id => songsByHistoryId[id]);
  const footerState = views['footer'];
  const playerOnOff = state.system.playerOnOff;

  return {
    historyInfo,
    songsInHistory,
    listsInFavorite,
    footerState,
    i18n,
    playerOnOff
  };
}

export default connect(mapStateToProps, { loadHistory, loadListFromFavorite, putSongArrayToQueue, postSongArrayToQueue, postFavoriteToQueue })(HistoryPage);
