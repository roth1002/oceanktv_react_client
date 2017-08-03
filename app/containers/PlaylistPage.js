import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';

import { ROOT, API_ROOT } from '../constants/Config';
import IMG_DEFAULT from '../assets/images/ic_thumbnail_default.png';
import YOUTUBE from '../assets/images/youtube_folder_normal.png';

import List from '../components/List';
import SideNav from '../components/SideNav';
import Pager from '../components/Pager';
import ActionPanel from '../components/ActionPanel';
import Notification from '../components/Notification';
import YoutubeActionPanel from '../components/YoutubeActionPanel';

import { loadPlaylist } from '../actions/playlist';
import { putSongArrayToQueue, postSongArrayToQueue, postFavoriteToQueue } from '../actions/playlist';
import { loadListFromFavorite } from '../actions/favorite';
import { stopPropagation, getNextActionPage } from '../utils/functions'

function loadData(props) {
  props.loadPlaylist('current');
  props.loadPlaylist('finished');
  props.loadListFromFavorite();
}

class PlaylistPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      songid: '',
      showAddFavor: true
    }
  }

  componentWillMount() {
    const { mouseActions, socket, loadPlaylist, socketio, addEvent } = this.props;
    mouseActions.removeMove();
    socket.removeAllListeners('playlist.change');
    socket.removeAllListeners('songlist.song.change');
    socket.removeAllListeners('playlist.history.change');
    socket.removeAllListeners('youtube.playlist.change');
    socket.on('playlist.change', this.handlePlaylistChangeEvent.bind(this));
    loadData(this.props);
  }

  handlePlaylistChangeEvent() {
    const { loadPlaylist, queueInfo, finishedInfo, fetchPlaylistInfo } = this.props;
    loadPlaylist('current', queueInfo.page);
    loadPlaylist('finished', finishedInfo.page);
    fetchPlaylistInfo();
  }


  componentWillReceiveProps(nextProps)  {
    const { mouseActions, mouse } = this.props;
    if (this.props.location.query !== nextProps.location.query) {
      mouseActions.removeMove();
      this.setState({ selected: [] });
    } else if ( nextProps.mouse.move ) {
      const { location: { query }, songsInQueue, songsInFinished } = nextProps;
      if ( ( query.list === 'current' && songsInQueue.length === 0 ) || ( query.list === 'finished' && songsInFinished.length === 0 ) ) {
        mouseActions.removeMove();
        this.setState({ selected: [] });
      }
    }
  }
  componentDidUpdate(prevProp, prevState) {
    const { location: { query } } = prevProp
    if (typeof query.list === 'undefined') {
      return this.context.router.push(`${ROOT}/app/playlist?list=current`)
    }
  }

  render() {
    const { query } = this.props.location;
    const {
      songsInQueue,
      songsInFinished,
      queueInfo,
      finishedInfo,
      listsInFavorite,
      footerState,
      toggleNotification,
      mouse,
      i18n,
      putSongArrayToQueue,
      postSongArrayToQueue,
      postFavoriteToQueue,
      sidenav
    } = this.props;
    const ClassName = classnames({
      'Page': true,
      'Page--playlist': true,
      'is-footer-hidden': !footerState.visible
    });

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
        {this.renderTabs(songsInQueue, songsInFinished, queueInfo, finishedInfo)}
        {this.renderContent(query, this.props)}
        <div className={`ActionPanel-multi`} style={{'top': mouseTop}}>
          <ActionPanel
            className={ActionPanelClassName}
            isMultiMode={this.state.songid}
            data={data}
            parentState={`multi`}
            notifyFunc={toggleNotification.bind(this)}
            isInQueue={query.list === 'current'}
            playerOnOff={this.props.playerOnOff}
            onRemoveFromQueue={this.handleSetInit.bind(this)}
            onAddToQueue={this.handleSetInit.bind(this)}
            onInsertToQueue={this.handleSetInit.bind(this)} />
        </div>
      </div>
    );
  }

  renderTabs(songsInQueue, songsInFinished, queueInfo, finishedInfo) {
    const { i18n } = this.props;
    return (
      <div className={`SideTab`}>
        <Link className={`SideTab-link`} to={{ pathname: `${ROOT}/app/playlist`, query: { list: `current` } }} activeClassName={`is-current`} onClick={this.handleSongClick.bind(this, -1)}>
          {`${i18n[i18n.myLang]['playlist.title.current']}`}
          <span className={`SideTab-total-normal`}>{ `(${queueInfo.total === undefined ? 0 : queueInfo.total})`}</span>
        </Link>
        <Link className={`SideTab-link`} to={{ pathname: `${ROOT}/app/playlist`, query: { list: `finished` }}} activeClassName={`is-current`} onClick={this.handleSongClick.bind(this, -1)}>
          {`${i18n[i18n.myLang]['playlist.title.finished']}`}
          <span className={`SideTab-total-normal`}>{ `(${finishedInfo.total === undefined ? 0 : finishedInfo.total})`}</span>
        </Link>
      </div>
    );
  }

  renderContent(query, props) {
    const { songsInQueue, songsInFinished, queueInfo, finishedInfo, history, i18n, mouse } = props;
    let i18nNoContent;
    switch (query.list) {
      case 'current':
        i18nNoContent = i18n[i18n.myLang]['playlist.list.nocurrent']
        return (
          <div className={`Page-content`}>
            {/*<Filter
              totalLen={songsInQueue.total}
              handleMultiMode={this._handleMultiMode.bind(this)}
              data={{selected: this.state.selected, multiMode: this.state.isMulti}}
              notifyFunc={this.props.toggleNotification.bind(this)}
              isMulti={this.state.isMulti}
              canClearAll={true}
              afterSuccess={this._setStateInit.bind(this)}
              isInCurrent={query.list === 'current'}
              onHandleSelectAll={this._selectCurrentAll.bind(this)}
              onHandleClearAll={this._clearAll.bind(this)}  />*/}
            <section className={`Page-main`}>
              {/*<h1 className={`Page-title`}>
                {i18n[i18n.myLang]['playlist.title.current']}
                <span className={`Page-total`}>{`${i18n[i18n.myLang][this.state.isMulti ? 'pager.total.selected.prefix' : 'pager.total.prefix']}: ${this.state.isMulti ? this.state.selected.length : (queueInfo.total === undefined ? 0 : queueInfo.total)} ${i18n[i18n.myLang][this.state.isMulti ? 'pager.total.item' : 'pager.total.songs']}`}</span>
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
                myPage={queueInfo.page}
                total={queueInfo.total}
                title={i18n[i18n.myLang]['playlist.title.current']}
                history={history}
                isInFavorite={false}
                firstNum={queueInfo.total === 0 ? 0 : (queueInfo.page - 1) * 15 + 1}
                lastNum={queueInfo.page * 15 >= queueInfo.total ? queueInfo.total : queueInfo.page * 15}
                playerOnOff={this.props.playerOnOff}
                selectedCount={mouse.move ? this.state.selected.length : 0}
                onLoadData={this.loadSongs.bind(this)}
                isFetching={queueInfo.isFetching} >
              </Pager>
              <div className={`Queue Queue--w620 Queue--current`}>
                {
                  queueInfo.total === 0 ? null :
                  <div className={`Queue-head--folder-multimode`}>
                    <input
                      className={`Song-info-checkbox-folder-multimode`}
                      checked={this.state.selected.length === songsInQueue.length && this.state.selected.length !== 0 && mouse.move}
                      type="checkbox"
                      onChange={(evt) => this._handleSelectAll(evt, songsInQueue)} />
                    <div className={`Songname-multimode`}>
                      {i18n[i18n.myLang]['list.head.song']}
                    </div>
                    <div style={{marginLeft: '55px'}} className="Queue-head-artists Artistsname-multimode">
                      {i18n[i18n.myLang]['list.head.artist']}
                    </div>
                    <div>
                      {i18n[i18n.myLang]['list.head.source']}
                    </div>
                  </div>
                }
                <List
                  className={`List--queue Queue-body`}
                  items={songsInQueue}
                  renderItem={this.renderListItem.bind(this, true)}
                  isFetching={queueInfo.isFetching}
                  // onLoadMore={this.loadQueue.bind(this)}
                  i18nNoContent={i18nNoContent} />
              </div>
            </section>
          </div>
        );
      case 'finished':
        i18nNoContent = i18n[i18n.myLang]['songbook.list.nocontent']
        return (
          <div className={`Page-content`}>
            {/*<Filter
              totalLen={songsInFinished.total}
              handleMultiMode={this._handleMultiMode.bind(this)}
              data={{selected: this.state.selected, multiMode: this.state.isMulti}}
              isMulti={this.state.isMulti}
              canClearAll={false}
              onHandleSelectAll={this._selectFinishedAll.bind(this)}
              onHandleClearAll={this._clearAll.bind(this)} />*/}
            <section className={`Page-main`}>
              {/*<h1 className={`Page-title`}>
                {i18n[i18n.myLang]['playlist.title.finished']}
                <span className={`Page-total`}>{`${i18n[i18n.myLang]['pager.total.prefix']}: ${finishedInfo.total === undefined ? 0 : finishedInfo.total} ${i18n[i18n.myLang]['pager.total.songs']}`}</span>
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
                myPage={finishedInfo.page}
                total={finishedInfo.total}
                title={i18n[i18n.myLang]['playlist.title.finished']}
                history={history}
                isInFavorite={false}
                firstNum={finishedInfo.total === 0 ? 0 : (finishedInfo.page - 1) * 15 + 1}
                lastNum={finishedInfo.page * 15 >= finishedInfo.total ? finishedInfo.total : finishedInfo.page * 15}
                selectedCount={mouse.move ? this.state.selected.length : 0}
                onLoadData={this.loadSongs.bind(this)}
                isFetching={finishedInfo.isFetching} >
              </Pager>
              <div className={`Queue Queue--w620`}>
                {
                  finishedInfo.total === 0 ? null :
                  <div className={`Queue-head--folder-multimode`}>
                    <input
                      className={`Song-info-checkbox-folder-multimode`}
                      checked={this.state.selected.length === songsInFinished.length && this.state.selected.length !== 0 && mouse.move}
                      type="checkbox"
                      onChange={(evt) => this._handleSelectAll(evt, songsInFinished)} />
                    <div className={`Songname-multimode`}>
                      {i18n[i18n.myLang]['list.head.song']}
                    </div>
                    <div style={{marginLeft: '55px'}} className="Queue-head-artists Artistsname-multimode">
                      {i18n[i18n.myLang]['list.head.artist']}
                    </div>
                    <div>
                      {i18n[i18n.myLang]['list.head.source']}
                    </div>
                  </div>
                }
                <List
                  className={`List--queue Queue-body`}
                  items={songsInFinished}
                  renderItem={this.renderListItem.bind(this, false)}
                  isFetching={finishedInfo.isFetching}
                  // onLoadMore={this.loadFinished.bind(this)}
                  i18nNoContent={i18nNoContent} />
              </div>
            </section>
          </div>
        );
      default:
        return (
          <div className={`Page-content`}>
            <h2>{`\u21D0 Select a label`}</h2>
          </div>
        );
    }
  }

  renderListItem(isInQueue, item, index) {
    const { actionpanel, mouse, toggleNotification } = this.props;
    const { selected } = this.state;
    const multiModeActiveActionPanel = selected.length ? selected[selected.length - 1].index === item.index : false;
    const ClassName = classnames('Song', {
      'is-selected': multiModeActiveActionPanel
    });
    const LabelMultiModeClassName = classnames({
      'Song': !mouse.move,
      'Song-multi': mouse.move,
      'is-inQueue': item.inPlaylist && !isInQueue,
      'is-selected': !this.state.selected.every(elem => elem.index !== item.index) && mouse.move
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
      <label htmlFor={`playlistMultiMode${index}`} key={index} className={LabelMultiModeClassName} onMouseOver={() => this.handleItemMouseOver(item)}>
        <div className={`Song-info`}>
          <span className={`ic ${item.state === 'PLAYING' ? 'ic_songlist_nowplaying' : ''}`} />
          <input
            id={`playlistMultiMode${index}`}
            checked={!this.state.selected.every(elem => elem.index !== item.index) && mouse.move}
            className={`Song-info-checkbox`}
            type="checkbox"
            onChange={(evt) => this._handleSelectItem(evt, { songid: item.id, flow: item.flow, index: item.index, item })} />
          <img className="Song-thumbnail"
              src={thumbSrc}
              onError={this.handleImgError.bind(this)} />
          <span className="Song-title">{item.name}</span>
          <span className={`Song-artist ${MultiModeClassName}`}>{item.artist}</span>
          {this.renderSourceIcon(item.sourceType)}
        </div>
        { item.sourceType === 0 ?
          <ActionPanel
            className={ActionPanelClassName}
            isMultiMode={true}
            data={data}
            isInQueue={isInQueue}
            playerOnOff={this.props.playerOnOff}
            notifyFunc={toggleNotification.bind(this)} />
          :
          <YoutubeActionPanel
            className={ActionPanelClassName}
            isMultiMode={this.state.songid}
            data={data}
            isInQueue={isInQueue}
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

  handleSongClick(item, evt) {
    const { selected } = this.state;
    // stopPropagation(evt)
    this.setState({
      selected: selected.length === 1 && selected[0].index === item.index ? [] : [{ index: item.index, source_type: item.sourceType, songid: item.id, flow: item.flow, item}]
    });
  }

  handleImgError(e) {
    return e.currentTarget.src = IMG_DEFAULT
  }

  handleSetInit() {
    const { mouseActions } = this.props;
    this.setState({selected: [] });
    mouseActions.removeMove();
  }

  loadQueue() {
    const { songsInQueue, queueInfo, loadPlaylist } = this.props;
    if ( songsInQueue.length >= queueInfo.total ) {
      return ;
    }

    loadPlaylist('current', queueInfo.page + 1);
  }

  loadFinished() {
    const { songsInFinished, finishedInfo, loadPlaylist } = this.props;
    if ( songsInFinished.length >= finishedInfo.total ) {
      return ;
    }

    loadPlaylist('finished', finishedInfo.page + 1);
  }

  loadSongs(evt, count, diff, forcePage) {
    const {
      songsInQueue,
      queueInfo,
      location: { query },
      songsInFinished,
      finishedInfo,
      loadPlaylist,
      mouseActions
    } = this.props;

    let page;
    if ( query.list === 'current' ) {
      page = forcePage ? forcePage : getNextActionPage( queueInfo.page, count , diff );
      this.setState({selected: [] });
      mouseActions.removeMove();
      loadPlaylist('current', page, count);
    } else if ( query.list === 'finished' ) {
      page = forcePage ? forcePage : getNextActionPage( finishedInfo.page, count, diff );
      this.setState({selected: [] });
      mouseActions.removeMove();
      loadPlaylist('finished', page, count);
    } else {
      return ;
    }

  }

  _handleSelectItem(evt, action) {
    const { mouseActions, mouse } = this.props;
    stopPropagation(evt)
    if (evt.target.checked) {
      if ( !mouse.move ) {
        this.setState({ selected: [action] });
        mouseActions.addMove();
      } else {
        this.setState({ selected: [...this.state.selected, action] });
      }
    } else {
      const selected = this.state.selected.filter( item => item.index !== action.index );
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
      const selected = songs.map( item => Object.assign({ songid: item.id, flow: item.flow, index: item.index, source_type: item.sourceType, item }));
      if ( selected.length > 0 ) {
        this.setState({ selected });
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
      this.setState({
        songid: item.id,
        selected: [
          {
            item
          }
        ]
      });
    }
  }
}

function mapStateToProps(state, ownProps) {
  const {
    pagination: { songsFromPlaylist, listsElse },
    entities: { songsByCurrent, songsByFinished, lists },
    views, i18n, socketio
  } = state;

  const favoriteInfo = listsElse['favorite'] || { ids: [] };
  const listsInFavorite = favoriteInfo.ids.map(id => lists[id]);
  const queueInfo = songsFromPlaylist['current'] || { ids: [], page: 0 };
  const finishedInfo = songsFromPlaylist['finished'] || { ids: [], page: 0 };
  const songsInQueue = queueInfo.ids.map(id => songsByCurrent[id]);
  const songsInFinished = finishedInfo.ids.map(id => songsByFinished[id]);
  const footerState = views['footer'];
  const playerOnOff = state.system.playerOnOff;

  return {
    queueInfo,
    finishedInfo,
    songsInQueue,
    songsInFinished,
    listsInFavorite,
    footerState,
    i18n,
    socketio,
    playerOnOff
  };
}

PlaylistPage.contextTypes = {
  router: React.PropTypes.object
};

export default connect(mapStateToProps, { loadPlaylist, loadListFromFavorite, putSongArrayToQueue, postSongArrayToQueue, postFavoriteToQueue })(PlaylistPage);
