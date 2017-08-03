import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import unzip from 'lodash/unzip';
import chunk from 'lodash/chunk';
import Cookies from 'js-cookie';

import { ROOT, API_ROOT } from '../constants/Config';
import IMG_DEFAULT from '../assets/images/ic_thumbnail_default.png';
import IMG_FOLDER from '../assets/images/ic_folder.png';

import List from '../components/List';
import Pager from '../components/Pager';
import ActionPanel from '../components/YoutubeActionPanel';

import {
  loadSongsFromYoutubeCategory,
  loadPlaylistsFromYoutubeDataAPI,
  loadSongsFromPlaylistsOfDataAPI,
  loadSongsFromYoutubeDataAPI,
} from '../actions/youtube';
import { loadSongsFromCollection } from '../actions/favorite';
import { stopPropagation, getNextActionPage } from '../utils/functions';
import { postRecommandlistToQueue, postCollectionlistToQueue } from '../actions/playlist';

function loadData(props) {
  const { location: { query }, cloudType } = props;
  if ( cloudType === 'default' && query.defaultId ) {
    props.loadSongsFromYoutubeCategory({ id : query.defaultId, page: props.listInfo.page })
  }
  if ( cloudType === 'cloudlink' && query.cloudlinkId ) {
    if ( props.listInfo.endpoint ) {
      props.loadSongsFromCollection({ endpoint: props.listInfo.endpoint, page: props.listInfo.page });
    } else {
      props.loadSongsFromCollection({ id : query.cloudlinkId, page: props.listInfo.page })
    }
  }
  if ( cloudType === 'search' && query.keyword ) {
    if ( query.searchType === 'video' ) {
      props.loadSongsFromYoutubeDataAPI( { keywords: query.keyword });
    } else if ( query.searchType === 'playlist' ) {
      if ( query.pvid ) {
        if ( props.songsFromYoutubePlaylistsInfo.endpoint ) {
          props.loadSongsFromPlaylistsOfDataAPI({endpoint: props.songsFromYoutubePlaylistsInfo.endpoint, page: props.songsFromYoutubePlaylistsInfo.page });
        } else {
          props.loadSongsFromPlaylistsOfDataAPI({ id: query.pvid, page: props.songsFromYoutubePlaylistsInfo.page });
        }
      } else {
        props.loadPlaylistsFromYoutubeDataAPI( { keywords: query.keyword })
      }
    }
  }
}

class YoutubeContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      vid: 0,
      cloudType: '',
    }
  }

  componentWillMount() {
    loadData(this.props);
    const { location, cloudType, socket, mouseActions, toggleView } = this.props;
    const isShowYoutubeTipModal = Cookies.get('youtubeNeverTip');
    mouseActions.removeMove();
    socket.removeAllListeners('playlist.change');
    socket.removeAllListeners('songlist.song.change');
    socket.removeAllListeners('playlist.history.change');
    socket.removeAllListeners('youtube.playlist.change');
    this.setState({ myUrl: location.pathname + location.search, cloudType });
    socket.on('playlist.change', this.handleSocketIoPlaylistEvent.bind(this));
    socket.on('songlist.song.change', this.handleSocketIoSonglistEvent.bind(this));
    socket.on('youtube.playlist.change', this.handleSocketIoSonglistEvent.bind(this));
    if ( isShowYoutubeTipModal === '1' && cloudType !== 'search' ) {
      toggleView('modal', { visible: true, type: 'youtubeTip' });
    }
  }

  handleSocketIoPlaylistEvent(msg){
    const { fetchPlaylistInfo } = this.props;
    fetchPlaylistInfo();
    loadData(this.props);
  }

  handleSocketIoSonglistEvent(msg) {
    loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      cloudType,
      listsInCategory,
      listsInCollection,
      loadSongsFromYoutubeCategory,
      loadSongsFromCollection,
      loadSongsFromPlaylistsOfDataAPI,
      loadSongsFromYoutubeDataAPI,
      loadPlaylistsFromYoutubeDataAPI,
      listInfo,
      location: { query, key },
      location,
    } = nextProps;

    if ( cloudType === 'default' &&  (query.defaultId && this.props.location.query.defaultId !== query.defaultId) ) {
      this.setState({ myUrl: location.pathname + location.search, cloudType });
      return loadSongsFromYoutubeCategory({ id: query.defaultId });
    }
    if ( cloudType === 'cloudlink' && ( query.cloudlinkId && this.props.location.query.cloudlinkId !== query.cloudlinkId) ) {
      this.setState({ myUrl: location.pathname + location.search, cloudType });
      return loadSongsFromCollection({ id: query.cloudlinkId });
    }
    if ( cloudType === 'default' && !query.defaultId && listsInCategory.length !== 0 ) {
      this.setState({ myUrl: location.pathname + location.search, cloudType });
      return this.context.router.push(encodeURI(`${ROOT}/app/youtube/default?defaultId=${listsInCategory[0].id}&name=${listsInCategory[0].name}`));
    }
    if ( cloudType === 'cloudlink' && !query.cloudlinkId ) {
      this.setState({ myUrl: location.pathname + location.search, cloudType });
      if ( listsInCollection.length !== 0 ) {
        return this.context.router.push(encodeURI(`${ROOT}/app/youtube/cloudlink?cloudlinkId=${listsInCollection[0].id}&name=${listsInCollection[0].name}`));
      } else if ( listsInCategory.length !== 0 ) {
        return this.context.router.push(encodeURI(`${ROOT}/app/youtube/default?defaultId=${listsInCategory[0].id}&name=${listsInCategory[0].name}`));
      }
    }
    if ( cloudType === 'search' ) {
      if ( query.searchType === 'playlist' && query.pvid && query.pvid !== this.props.location.query.pvid ) {
        return loadSongsFromPlaylistsOfDataAPI({ id: query.pvid });
      }
      if ( query.searchType === 'video' && ( this.props.location.query.searchType !== 'video' || key !== this.props.location.key ) ) {
        return loadSongsFromYoutubeDataAPI( { keywords: query.keyword });
      } else if ( query.searchType === 'playlist' && ( this.props.location.query.searchType !== 'playlist' || key !== this.props.location.key ) ) {
        return loadPlaylistsFromYoutubeDataAPI( { keywords: query.keyword });
      }
    }
  }

  componentDidMount() {
  }

  render() {
    return this.renderContent(this.props);
  }

  renderContent(props) {
    const { cloudType, location: { query } } = props;
    if ( cloudType === 'default' || cloudType === 'cloudlink' ) {
      const { listInfo, songsInYoutube } = props;
      return this.renderSongsContent(songsInYoutube, listInfo, query);
    }
    if ( cloudType === 'search' && query.searchType === 'video') {
      const { videoListsInfo, videoFromYoutubeDataAPI } = props;
      return this.renderSongsContent(videoFromYoutubeDataAPI, videoListsInfo, query);
    }
    if ( cloudType === 'search' && query.searchType === 'playlist') {
      if ( query.pvid ) {
        const { songsFromYoutubePlaylistsInfo, songsInPlaylistsOfYoutubeDataAPI } = props;
        return this.renderSongsContent(songsInPlaylistsOfYoutubeDataAPI, songsFromYoutubePlaylistsInfo, query);
      } else {
        const { playlistsInfo, playlistsInYoutubeDataAPI } = props;
        return this.renderPlaylistsContent(playlistsInYoutubeDataAPI, playlistsInfo, query);
      }
    }

    return <div>NOTHING!</div>
  }

  renderSongsContent(songs = [], songsInfo, query) {
    const { defaultId, cloudlinkId, name, pvid } = query;
    const {
      i18n,
      mouse,
      internetAccess,
      errorMessage,
      cloudType,
      postRecommandlistToQueue,
      postCollectionlistToQueue,
      mouseActions,
      toggleView
    } = this.props;
    let title;
    let pageCount = 15;
    let pagerType = 'songs';
    let backStratumClass = '';
    let backUrlData = { url: this.state.myUrl, cloudType: this.state.cloudType };
    let isNoPaging = false;
    if ( defaultId || cloudlinkId ) {
      title = name;
    } else if ( cloudType === 'search' ) {
      backStratumClass = 'Songbook-goback ic btn_mainpage_backstratum';
      if ( pvid ) {
        backUrlData = '';
        title = name;
      } else {
        title = i18n[i18n.myLang]['youtube.search.title'];
      }
      if ( query.searchType === 'video' ) {
        pageCount = 50;
        isNoPaging = true;
      }
    }
    const mouseTop = mouse && mouse.move ? (mouse.pageY - 75) + 'px' : '-20%';
    const data = {
      selected: this.state.selected,
      multiMode: true,
    };

    const ActionPanelClassName = classnames('ActionPanel-inmulti', {
      'is-show': mouse.move,
      'is-selected': true
    });

    const i18nNoContent = this.getContentByNetworkAccessAndErrorCode(internetAccess, errorMessage.code);
    const isTokenPaging = defaultId === undefined;
    return (
      <div className={`Page-content`}>
        <section className={`Page-main`}>
          <Pager
            i18n={i18n}
            pagerType={pagerType}
            pageCount={pageCount}
            backStratumClass={backStratumClass}
            isTokenPaging={isTokenPaging}
            myPage={songsInfo.page}
            total={songsInfo.total}
            title={title}
            history={history}
            notifyFunc={this.props.notifyFunc.bind(this)}
            isInFavorite={false}
            backUrlData={backUrlData}
            firstNum={songsInfo.total === 0 ? 0 : (songsInfo.page - 1) * pageCount + 1}
            lastNum={songsInfo.page * pageCount >= songsInfo.total ? songsInfo.total : songsInfo.page * pageCount}
            playerOnOff={this.props.playerOnOff}
            selectedCount={mouse.move ? this.state.selected.length : 0}
            onLoadData={this.loadSongs.bind(this)}
            isFetching={songsInfo.isFetching}
            isNoPaging={isNoPaging}
            isInRecommand={cloudType === 'default'}
            isInCollection={cloudType === 'cloudlink'}
            data={{defaultId, cloudlinkId}}
            postRecommandlistToQueue={postRecommandlistToQueue}
            postCollectionlistToQueue={postCollectionlistToQueue}
            toggleView={toggleView}
            mouseActions={mouseActions} >
          </Pager>
          <div className={`Favorite Favorite--w620`}>
            {
              songsInfo.total === 0 ? null :
              <div className={`Songbook-head--folder-multimode`}>
                <input
                  className={`Song-info-checkbox-folder-multimode`}
                  checked={
                    this.state.selected.length === songs.filter( item =>
                      item.type === undefined || item.type === 1).length && this.state.selected.length !== 0 && mouse.move
                  }
                  type="checkbox"
                  onChange={(evt) => this._handleSelectAll(evt, songs)} />
                <div className={`Songname-multimode`}>
                  {i18n[i18n.myLang]['list.head.song']}
                </div>
                { cloudType === 'default' ?
                  <div className={`Songbook-head-artists Artistsname-multimode`}>
                    {i18n[i18n.myLang]['list.head.artist']}
                  </div>
                  : null
                }
              </div>
            }
            <List
              className={`List--song Songbook-body`}
              items={songs}
              renderItem={this.renderListItem.bind(this)}
              isFetching={songsInfo.isFetching}
              i18nNoContent={i18nNoContent} />
          </div>
        </section>
        <div className={`ActionPanel-multi-songbook`} style={{'top': mouseTop}}>
          <ActionPanel
            className={ActionPanelClassName}
            isMultiMode={this.state.songid}
            data={data}
            parentState={`multi`}
            notifyFunc={this.props.notifyFunc.bind(this)}
            playerOnOff={this.props.playerOnOff}
            onAddToQueue={this.handleSetInit.bind(this)}
            onInsertToQueue={this.handleSetInit.bind(this)} />
        </div>
      </div>
    );
  }

  renderListItem(item, index) {
    const { mouse, playerOnOff, toggleNotification, location: { query } } = this.props;
    const { defaultId } = query;
    const { selected } = this.state;
    const multiModeActiveActionPanel = selected.length ? selected[selected.length - 1].songid === item.id : false;

    const LabelMultiModeClassName = classnames({
      'Song': !mouse.move,
      'Song-multi': mouse.move,
      'is-inQueue': item.inPlaylist,
      'is-selected': !this.state.selected.every(elem => elem.songid !== item.id) && mouse.move
    });

    const ActionPanelClassName = classnames('ActionPanel', {
      'is-selected': multiModeActiveActionPanel,
      'is-unselected': !multiModeActiveActionPanel
    });

    const data = {
      selected: this.state.selected,
      multiMode: false,
      songId: item.id,
      songName: item.name,
      flow: item.flow
    };

    return (
      <label htmlFor={`youtubeMultiMode${item.id}`} key={index} className={LabelMultiModeClassName} onMouseOver={() => this.handleItemMouseOver(item)}>
        <div className={`Song-info`}>
          <input
            id={`youtubeMultiMode${item.id}`}
            className={`Song-info-checkbox`}
            type="checkbox"
            checked={!this.state.selected.every(elem => elem.songid !== item.id) && mouse.move}
            onChange={(evt) => this._handleSelectItem(evt, { songid: item.id, source_type: item.sourceType, flow: item.flow, item })} />
          <img className="Song-thumbnail"
              src={item.thumb || IMG_DEFAULT}
              onError="" />
          <span className="Song-title">{item.name}</span>
          { defaultId ? <span className={`Song-artist is-multimode`}>{item.artist}</span> : null }
        </div>
        <ActionPanel
          className={ActionPanelClassName}
          isMultiMode={this.state.songid}
          data={data}
          onRemoveFromFavorite={this.handleSetInit.bind(this)}
          isInFavorite={false}
          playerOnOff={playerOnOff}
          notifyFunc={toggleNotification.bind(this)} />
      </label>
    );
  }

  renderPlaylistsContent(playlists = [], playlistInfo, query) {
    const {
      toggleNotification,
      player,
      i18n,
      toggleView,
      mouseActions,
      mouse,
      playerOnOff,
      errorMessage,
      internetAccess,
      playlistsInfo,
      playlistsInYoutubeDataAPI,
      cloudType,
    } = this.props;

    const { query : { name } } = this.props.location;
    const mouseTop = mouse && mouse.move ? (mouse.pageY - 20) + 'px' : '-20%';

    const i18nNoContent = this.getContentByNetworkAccessAndErrorCode(internetAccess, errorMessage.code);
    const ClassName = classnames({
      'Page': true,
      'Page--youtube': true,
      'is-footer-hidden': false
    });

    const ActionPanelClassName = classnames('ActionPanel-inmulti', {
      'is-show': mouse.move,
      'is-selected': true
    });

    const data = {
      selected: this.state.selected,
      multiMode: true
    };

    const isNetworkTrouble = !internetAccess || ( errorMessage && ( errorMessage.code === 16000 || errorMessage.code === 11001) );
    const backStratumClass = 'Songbook-goback ic btn_mainpage_backstratum';
    const pageCount = 50;

    return (
      <div className={`Page-content`}>
        <div className={`Page-main`}>
          {
            !playlistsInfo.total ? null :
            <Pager
              i18n={i18n}
              pagerType={'songs'}
              total={playlistsInfo.total}
              myPage={playlistsInfo.page}
              title={i18n[i18n.myLang]['youtube.search.title']}
              notifyFunc={toggleNotification.bind(this)}
              backStratumClass={backStratumClass}
              playerOnOff={playerOnOff}
              toggleView={toggleView}
              mouseActions={mouseActions}
              isInFavorite={false}
              isInYoutube={true}
              pageCount={pageCount}
              backUrlData={{ url: this.state.myUrl, cloudType: this.state.cloudType }}
              firstNum={playlistsInfo.total === 0 ? 0 : (playlistsInfo.page - 1) * pageCount + 1}
              lastNum={playlistsInfo.page * pageCount >= playlistsInfo.total ? playlistsInfo.total : playlistsInfo.page * pageCount}
              playerOnOff={this.props.playerOnOff}
              selectedCount={mouse.move ? this.state.selected.length : 0}
              onLoadData={this.loadSongs.bind(this)}
              isFetching={playlistsInfo.isFetching}
              isNoPaging={true} >
            </Pager>
          }
          <div className={`Favorite Favorite--w620`}>
            {
              !playlistsInfo.total ? null :
              <div className={`Favorite-head--folder-multimode`}>
                <div className={`Songname-multimode`}>
                  {i18n[i18n.myLang]['list.header.playlists']}
                </div>
              </div>
            }
            <List
              className={`List--favorite Favorite-body`}
              items={playlistsInYoutubeDataAPI}
              renderItem={this.renderPlaylistsItem.bind(this)}
              isFetching={playlistsInfo.isFetching}
              isNetworkTrouble={isNetworkTrouble}
              i18nNoContent={i18nNoContent} />
            </div>
          </div>
      </div>
    );
  }

  renderPlaylistsItem(item, index) {
    const { location: { query }, mouse, toggleNotification } = this.props;
    const { selected } = this.state;
    const multiModeActiveActionPanel = selected.length ? selected[selected.length - 1].songid === item.id : false;
    const LabelMultiModeClassName = classnames({
      'Song': !mouse.move,
      'Song-multi': mouse.move,
      'is-inQueue': item.inPlaylist
    });
    const ActionPanelClassName = classnames('ActionPanel', {
      'is-selected': multiModeActiveActionPanel,
      'is-unselected': !multiModeActiveActionPanel
    });
    const MultiModeClassName = classnames({
      'is-multimode': true
    })
    const data = {
      selected: this.state.selected,
      multiMode: false,
      vid: this.state.vid,
      isPlaylist: true,
    };

    return (
      <label htmlFor={`playlists${index}`} key={index} className={LabelMultiModeClassName} onMouseOver={() => this.handleItemMouseOver(item)}>
        <Link className={`Song-info`} to={{ pathname: `${ROOT}/app/youtube/search`, query: { cloudType: 'search', keyword: query.keyword, searchType: 'playlist', pvid: item.id, name: item.name }}}>
          <img
            data-layzr="image/source"
            className="Song-thumbnail"
            alt={`thumb`}
            src={item.thumb} />
          <span className="Song-title">{item.name}</span>
        </Link>
        <ActionPanel
          className={ActionPanelClassName}
          isMultiMode={true}
          data={data}
          playerOnOff={this.props.playerOnOff}
          isInYoutubePlaylistSearch={true}
          notifyFunc={toggleNotification.bind(this)} />
      </label>
    );
  }


  loadSongs(evt, count, diff, forcePage) {
    const { cloudType, listInfo, location: { query } } = this.props;
    let page;
    if ( cloudType === 'default' ) {
      const { loadSongsFromYoutubeCategory } = this.props;
      page = forcePage ? forcePage : getNextActionPage(listInfo.page, count, diff);
      return loadSongsFromYoutubeCategory({id: query.defaultId, page, count});
    } else if ( cloudType === 'cloudlink' ) {
      const { loadSongsFromCollection } = this.props;
      page = forcePage ? forcePage : getNextActionPage(listInfo.page, count, diff);
      const endpoint = diff > 0 ? listInfo.paging.nextPage : listInfo.paging.prevPage;
      return loadSongsFromCollection({ endpoint, page, count});
    } else if ( cloudType === 'search' && query.pvid ) {
      const { loadSongsFromPlaylistsOfDataAPI, songsFromYoutubePlaylistsInfo } = this.props;
      const endpoint = diff > 0 ? songsFromYoutubePlaylistsInfo.paging.nextPage : songsFromYoutubePlaylistsInfo.paging.prevPage;
      page = forcePage ? forcePage : getNextActionPage(songsFromYoutubePlaylistsInfo.page, count, diff);
      return loadSongsFromPlaylistsOfDataAPI({ endpoint, page, count})
    }
  }

  getContentByNetworkAccessAndErrorCode(status = false, error = 0) {
    const { i18n } = this.props;
    if ( !error ) return;
    if ( !status || error.code === 16000 ) {
      return i18n[i18n.myLang]['list.network.trouble'];
    } else if ( error.code === 11001 ) {
      return i18n[i18n.myLang]['list.server.maintenance'];
    }
  }

  handleSetInit() {
    const { mouseActions } = this.props;
    this.setState({selected: [] });
    mouseActions.removeMove();
  }

  handleItemMouseOver(item) {
    const { mouse } = this.props;
    if ( !mouse.move ) {
      this.setState({vid: item.id, selected: [{item}]})
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
      const selected = this.state.selected.filter( item => item.songid !== action.songid );
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
      const selected = songs.map( item => Object.assign({}, {}, {songid: item.id, source_type: item.sourceType, item}));
      if ( selected.length > 0 ) {
        this.setState({selected });
        mouseActions.addMove();
      }
    } else {
      this.setState({selected: [] });
      mouseActions.removeMove();
    }
  }
}

function mapStateToProps(state, ownProps) {
  const { cloudType } = ownProps.params;
  const { scroll, i18n } = state;
  const {
    system,
    system: { internetAccess },
    entities: {
      songs,
      items,
      collectionItems,
      playlists,
    },
    pagination: {
      songsFromYoutube,
      videosFromYoutube,
      youtubeCategory,
      collectionFromYoutube,
      playlistsFromYoutube,
      songsFromPlaylistOfYoutube,
    }
  } = state;

  const playerOnOff = system.playerOnOff;

  const listInfo = songsFromYoutube['songs'] || { ids: [] };
  const songsInYoutube = listInfo.ids.map(id => songs[id]);
  const videoListsInfo = videosFromYoutube['video'] || { ids: [] };
  const videoFromYoutubeDataAPI = videoListsInfo.ids.map( id => songs[id]);
  const categoryInfo = youtubeCategory['category'] || { ids: [] };
  const listsInCategory = categoryInfo.ids.map(id => items[id]);
  const collectionInfo = collectionFromYoutube['collection'] || { ids: [] };
  const listsInCollection = collectionInfo.ids.map( id => collectionItems[id] );
  const playlistsInfo = playlistsFromYoutube['playlist'] || { ids: [] };
  const playlistsInYoutubeDataAPI = playlistsInfo.ids.map( id => playlists[id]);
  const songsFromYoutubePlaylistsInfo = songsFromPlaylistOfYoutube['songsofpvid'] || { ids: [] };
  const songsInPlaylistsOfYoutubeDataAPI = songsFromYoutubePlaylistsInfo.ids.map( id => songs[id] );

  return {
    playerOnOff,
    internetAccess,
    scroll,
    i18n,
    cloudType,
    listInfo,
    songsInYoutube,
    videoListsInfo,
    videoFromYoutubeDataAPI,
    collectionInfo,
    listsInCollection,
    categoryInfo,
    listsInCategory,
    playlistsInfo,
    playlistsInYoutubeDataAPI,
    songsFromYoutubePlaylistsInfo,
    songsInPlaylistsOfYoutubeDataAPI,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadSongsFromYoutubeCategory: bindActionCreators(loadSongsFromYoutubeCategory, dispatch),
    loadSongsFromCollection: bindActionCreators(loadSongsFromCollection, dispatch),
    loadPlaylistsFromYoutubeDataAPI: bindActionCreators(loadPlaylistsFromYoutubeDataAPI, dispatch),
    loadSongsFromPlaylistsOfDataAPI: bindActionCreators(loadSongsFromPlaylistsOfDataAPI, dispatch),
    loadSongsFromYoutubeDataAPI: bindActionCreators(loadSongsFromYoutubeDataAPI, dispatch),
    postRecommandlistToQueue: bindActionCreators(postRecommandlistToQueue, dispatch),
    postCollectionlistToQueue: bindActionCreators(postCollectionlistToQueue, dispatch),
  };
}

YoutubeContent.contextTypes = {
  router: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(YoutubeContent);
