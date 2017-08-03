
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import unzip from 'lodash/unzip';
import chunk from 'lodash/chunk';

import { ROOT, API_ROOT } from '../constants/Config';
import IMG_DEFAULT from '../assets/images/ic_thumbnail_default.png';
import IMG_FOLDER from '../assets/images/ic_folder.png';

import { putSongArrayToQueue, postSongArrayToQueue, postFavoriteToQueue } from '../actions/playlist';
import { loadSongsByArtist, loadSongsByLang, loadArtistsByArtistType, loadSongsByFolder } from '../actions/songslist';
import { editScroll } from '../actions/scroll';
import { stopPropagation, truncatePath, getNextActionPage } from '../utils/functions'

import List from '../components/List';
import Pager from '../components/Pager';
import ActionPanel from '../components/ActionPanel';

function checkSongbookType(songbookType) {
  switch (songbookType) {
    case 'songs':
    case 'artists':
    case 'folders':
      return true;
    default:
      return false;
  }
}

function checkLang(lang) {
  switch (lang) {
    case 'Mandarin':
    case 'Taiwanese':
    case 'Cantonese':
      return true;
    default:
      return false;
  }
}

function loadData(props) {
  const { query, artistsInfo, songsInfo } = props;
  const { artistType, artistId, lang, stroke, rt, path } = query;
  if (artistId) {
    return props.loadSongsByArtist({ artistId, page: songsInfo && songsInfo.page !== 0  ? songsInfo.page : 1 });
  }

  if (artistType) {
    return props.loadArtistsByArtistType({ artistType, page: artistsInfo && artistsInfo.page !== 0 ? artistsInfo.page : 1});
  }

  if (checkLang(lang) && stroke) {
    return props.loadSongsByLang({ lang, nsongs: stroke, page: songsInfo && songsInfo.page !== 0 ? songsInfo.page : 1 });
  } else if (checkLang(lang)) {
    return ;
  }

  if (lang) {
    return props.loadSongsByLang({ lang, page: songsInfo && songsInfo.page !== 0 ? songsInfo.page : 1 });
  }

  if (path || rt) {
    return props.loadSongsByFolder({ path: path || rt, page: songsInfo && songsInfo.page !== 0 ? songsInfo.page : 1 });
  }
}

class SongbookContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      songid: ''
    }
  }

  componentWillMount() {
    const { mouseActions, socket } = this.props;
    mouseActions.removeMove();
    socket.removeAllListeners('playlist.change');
    socket.removeAllListeners('songlist.song.change');
    socket.removeAllListeners('playlist.history.change');
    socket.removeAllListeners('youtube.playlist.change');
    loadData(this.props);
    socket.on('playlist.change', this.handleSocketIoPlaylistEvent.bind(this));
    socket.on('songlist.song.change', this.handleSocketIoSonglistEvent.bind(this));
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
      songbookType,
      query,
      loadSongsByFolder,
      loadArtistsByArtistType,
      loadSongsByArtist,
      loadSongsByLang,
      mouseActions,
      songsInfo,
      artistsInfo
    } = nextProps;

    let page;
    let path;

    if (songbookType === 'artists' && query.artistType && (query.artistType !== this.props.query.artistType)) {
      this.setState({ selected: [] });
      mouseActions.removeMove();
      page = artistsInfo.page ? artistsInfo.page : 1;
      return loadArtistsByArtistType({ artistType: query.artistType, page });
    }

    if (songbookType === 'artists' && query.artistId && (query.artistId !== this.props.query.artistId)) {
      this.setState({ selected: [] });
      mouseActions.removeMove();
      return loadSongsByArtist({
        artistId: query.artistId,
        artistName: query.artistName
      });
    }

    if (songbookType === 'folders' && ( query.path || query.rt ) && ( query.path !== this.props.query.path || query.rt !== this.props.query.rt ) ) {
      this.setState({ selected: [] });
      mouseActions.removeMove();
      page = songsInfo.page ? songsInfo.page : 1;
      path = query.path ? query.path : query.rt;
      return loadSongsByFolder({ path, page })
    }

    if (query.stroke && query.stroke !== this.props.query.stroke) {
      this.setState({ selected: [] });
      mouseActions.removeMove();
      return loadSongsByLang({
        lang: query.lang,
        nsongs: query.stroke
      });
    }

    if (checkLang(query.lang) && query.lang !== this.props.query.lang) {
      this.setState({ selected: [] });
      mouseActions.removeMove();
      return ;
    }

    if (query.lang && query.lang !== this.props.query.lang) {
      this.setState({ selected: [] });
      mouseActions.removeMove();
      return loadSongsByLang({ lang: query.lang });
    }
  }

  componentDidMount() {
  }

  render() {
    return this.renderContent(this.props);
  }

  renderContent(props) {
    const {
      songbookType, query,
      songsInfo, songsInSongbook,
      artistsInfo, artistsInSongbook
    } = props;

    if ( songbookType === 'artists' && query.artistType && query.artistId ) {
      return this.renderSongsContent(songsInSongbook, songsInfo, query);
    }

    if ( songbookType === 'artists' && query.artistType ) {
      const artistsDist = unzip(chunk(artistsInSongbook, 3));
      return this.renderArtistsContent(artistsDist, artistsInfo, artistsInSongbook.length, query);
    }

    if ( songbookType === 'songs' && checkLang(query.lang) && typeof query.stroke === 'undefined' ) {
      return this.renderStrokeOptions();
    }



    if (!checkSongbookType(songbookType)) {
      return (
        <div className={`Page-content`}>
          <h1>NOTHING HERE!!</h1>
        </div>
      );
    }

    return this.renderSongsContent(songsInSongbook, songsInfo, query);
  }

  renderStrokeOptions() {
    const { i18n } = this.props;
    const { query: { lang } } = this.props;
    const title = mapToI18n(lang, i18n);
    const strokes = [{
      label: i18n[i18n.myLang]['songbook.title.stroke01'],
      value: 1
    }, {
      label: i18n[i18n.myLang]['songbook.title.stroke02'],
      value: 2
    }, {
      label: i18n[i18n.myLang]['songbook.title.stroke03'],
      value: 3
    }, {
      label: i18n[i18n.myLang]['songbook.title.stroke04'],
      value: 4
    }, {
      label: i18n[i18n.myLang]['songbook.title.stroke05'],
      value: 5
    }, {
      label: i18n[i18n.myLang]['songbook.title.stroke06'],
      value: 6
    }, {
      label: i18n[i18n.myLang]['songbook.title.stroke07'],
      value: 7
    }, {
      label: i18n[i18n.myLang]['songbook.title.stroke08'],
      value: 8
    }, {
      label: i18n[i18n.myLang]['songbook.title.allsongs'],
      value: 0
    }];

    return (
      <div className={`Page-content`}>
        <section className={`Page-main`}>
          <h1 className={`Page-title`}>
            {title + ' ' + i18n[i18n.myLang]['songbook.title.stroke']}
          </h1>
          <div className={`Songbook Songbook--w60`}>
          <List
            className={`List--stroke Songbook-body`}
            items={strokes}
            renderItem={this.renderStrokeOption.bind(this)} />
          </div>
        </section>
      </div>
    );
  }

  renderStrokeOption(item, index) {
    const { query: { lang } } = this.props;
    const queryData = { lang, stroke: item.value };
    return (
      <Link key={index} className={`Stroke`} to={{ pathname: `${ROOT}/app/songbook/songs`, query: queryData }}>
        {item.label}
      </Link>
    );
  }

  renderSongsContent(songs = [], songsInfo, query) {
    const { lang, stroke, artistId, artistName, path } = query;
    const { history, songbookType, i18n, mouse, putSongArrayToQueue, postSongArrayToQueue, postFavoriteToQueue } = this.props;
    const i18nNoContent = i18n[i18n.myLang]['songbook.list.nocontent']
    let title;
    let helpButton;
    let pagerType = 'songs'
    if ( artistId ) {
      title = artistName;
    } else if ( stroke ) {
      title = mapToI18n(stroke, this.props.i18n);
    } else if ( lang ) {
      title = mapToI18n(lang, this.props.i18n);
    } else if ( path ) {
      title = truncatePath(path, 2);
      pagerType = 'item';
    } else {
      title = i18n[i18n.myLang]['songbook.title.all']
    }
    const ListClass = classnames({
      'Songbook': true,
      'Songbook--w620': true,
      'Songbook--byfolder': path !== undefined && !mouse.move
    });
    const backStratumClass = checkLang(lang) || songbookType === 'artists' || ( path && path.indexOf('/') !== -1 ) ? 'Songbook-goback ic btn_mainpage_backstratum' : '';
    const gobackClass = checkLang(lang) || songbookType === 'artists' ? 'Songbook-goback-header' : '';

    const ActionPanelClassName = classnames('ActionPanel-inmulti',{
      'is-show': mouse.move,
      'is-selected': true
    });

    const data = {
      selected: this.state.selected,
      multiMode: true,
      onAddToFavorite: this.handleSetInit.bind(this)
    };
    const mouseTop = mouse && mouse.move ? (mouse.pageY - 80) + 'px' : '-20%';

    return (
      <div className={`Page-content`}>
        <section className={`Page-main`}>
          <Pager
            i18n={i18n}
            putSongArrayToQueue={putSongArrayToQueue}
            postSongArrayToQueue={postSongArrayToQueue}
            postFavoriteToQueue={postFavoriteToQueue}
            pagerType={pagerType}
            pageCount={15}
            className={gobackClass}
            backStratumClass={backStratumClass}
            myPage={songsInfo.page}
            total={songsInfo.total}
            title={title}
            history={history}
            notifyFunc={this.props.notifyFunc.bind(this)}
            isInFavorite={false}
            firstNum={songsInfo.total === 0 ? 0 : (songsInfo.page - 1) * 15 + 1}
            lastNum={songsInfo.page * 15 >= songsInfo.total ? songsInfo.total : songsInfo.page * 15}
            playerOnOff={this.props.playerOnOff}
            selectedCount={mouse.move ? this.state.selected.length : 0}
            onLoadData={this.loadSongs.bind(this)}
            isFetching={songsInfo.isFetching} >
          </Pager>
          {helpButton}
          <div className={`${ListClass}`}>
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
                <div className={`Songbook-head-artists Artistsname-multimode`}>
                  {path ? '' : i18n[i18n.myLang]['list.head.artist']}
                </div>
              </div>
            }
            <List
              className={`List--song Songbook-body`}
              items={songs}
              renderItem={this.renderSong.bind(this)}
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
            handleSuccess={this._handleActionPanelSuccess.bind(this)}
            onAddToQueue={this.handleSetInit.bind(this)}
            onInsertToQueue={this.handleSetInit.bind(this)} />
        </div>
      </div>
    );
  }

  renderSong(item, index) {
    const { query, mouse } = this.props;
    const { selected } = this.state;
    const multiModeActiveActionPanel = selected.length ? selected[selected.length - 1].songid === item.id : false;
    const ClassName = classnames('Song', {
      'is-inQueue': item.inPlaylist,
      'is-selected': multiModeActiveActionPanel
    });
    const LabelMultiModeClassName = classnames({
      'Song': !mouse.move,
      'Song-multi': mouse.move,
      'is-inQueue': item.inPlaylist,
      'is-selected': !this.state.selected.every(elem => elem.songid !== item.id)
    });
    const ActionPanelClassName = classnames('ActionPanel', {
      'is-selected': multiModeActiveActionPanel,
      'is-unselected': !multiModeActiveActionPanel
    });
    const MultiModeClassName = classnames({
      'is-multimode': true
    })
    const isInFolderList = item.type === 1;
    const data = {
      selected: this.state.selected,
      multiMode: false,
      songId: item.id,
      songName: item.name,
      flow: item.flow
    };

    let page;
    let path;

    if ( query.path || query.rt ) { // In folder list
      if ( item.type === 1 ) { // File
        return (
          <label htmlFor={`songbookMultiMode${item.id}`} key={index} className={LabelMultiModeClassName} onMouseOver={() => this.handleItemMouseOver(item)}>
            <div className={`Song-info`}>
              <input
                id={`songbookMultiMode${item.id}`}
                className={`Song-info-checkbox`}
                type="checkbox"
                checked={!this.state.selected.every(elem => elem.songid !== item.id)}
                onChange={(evt) => this._handleSelectItem(evt, { songid: item.id, flow: item.flow, item })} />
              <img
                className="Song-thumbnail"
                alt={`thumb`}
                src={`${API_ROOT}/songlist/thumb/${item.id}`}
                onError={this.handleImgError.bind(this)} />
              <span className="Song-title">{item.name}</span>
              <span className={`Song-artist ${MultiModeClassName}`}>{item.artist}</span>
            </div>
            <ActionPanel
              className={ActionPanelClassName}
              isMultiMode={true}
              isInFolderList={isInFolderList}
              data={data}
              playerOnOff={this.props.playerOnOff}
              notifyFunc={this.props.notifyFunc.bind(this)} />
          </label>
        );
      } else { // Folder
        page = this.props.songsInfo.page;
        path = query.path ? query.path : query.rt;
        return (
          <Link
            key={index}
            className={ClassName}
            to={{ pathname: `${ROOT}/app/songbook/folders`, query: { rt: query.rt, path: path + '/' + item.name } }}>
            <div className={`Song-info`}>
              <input
                className={`Song-info-checkbox is-hidden`}
                type="checkbox" />
              <img
                className="Song-thumbnail"
                alt={`thumb`}
                src={IMG_FOLDER}
                onError={this.handleImgError.bind(this)} />
              <span className="Song-title">{item.name}</span>
              <span className="Song-artist"></span>
            </div>
          </Link>
        );
      }
    } else { // Not in folder list
      return (
        <label htmlFor={`multiMode${item.id}`} key={index} className={LabelMultiModeClassName} onMouseOver={() => this.handleItemMouseOver(item)}>
          <div className={`Song-info`}>
            <input
              id={`multiMode${item.id}`}
              checked={!this.state.selected.every(elem => elem.songid !== item.id)}
              className={`Song-info-checkbox`}
              type="checkbox"
              onChange={(evt) => this._handleSelectItem(evt, { songid: item.id, flow: item.flow, item })} />
            <img
              data-layzr="image/source"
              className="Song-thumbnail"
              alt={`thumb`}
              src={`${API_ROOT}/songlist/thumb/${item.id}`}
              onError={this.handleImgError.bind(this)} />
            <span className="Song-title">{item.name}</span>
            <span className={`Song-artist ${MultiModeClassName}`}>{item.artist}</span>
          </div>
          <ActionPanel
            className={ActionPanelClassName}
            isMultiMode={true}
            data={data}
            playerOnOff={this.props.playerOnOff}
            notifyFunc={this.props.notifyFunc.bind(this)} />
        </label>
      );
    }
  }

  handleClickSong(item, evt) {
    const { selected } = this.state;
    stopPropagation(evt)
    this.setState({
      selected: selected.length === 1 && selected[0].songid === item.id ? [] : [{ songid: item.id, flow: item.flow, item}]
    });
  }

  handleImgError(e) {
    return e.currentTarget.src = IMG_DEFAULT
  }

  renderArtistsContent(artists = [], artistsInfo, currentLen, query) {
    const { artistType } = query;
    const { i18n } = this.props;
    const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
    const i18nNoContent = i18n.myLang ? i18n[i18n.myLang]['songbook.list.noartists'] : i18n[browserLang]['songbook.list.noartists'];
    const artistTitle = mapToI18n(artistType, this.props.i18n);
    return (
      <div className={`Page-content`}>
        <section className={`Page-main`}>
          {/*<h1 className={`Page-title`}>
            <span>{mapToI18n(artistType, this.props.i18n)}</span>
            <span className={`Page-total`}>{`${i18n[i18n.myLang]['pager.total.prefix']}: ${artistsInfo.total === undefined ? 0 : artistsInfo.total} ${i18n[i18n.myLang]['pager.total.artists']}`}</span>
          </h1>*/}
          <Pager
            i18n={i18n}
            pagerType={`artists`}
            pageCount={60}
            className={``}
            backStratumClass={``}
            myPage={artistsInfo.page}
            total={artistsInfo.total}
            title={artistTitle}
            history={history}
            isInFavorite={false}
            firstNum={(artistsInfo.page - 1) * 60 + 1}
            lastNum={artistsInfo.page * 60 >= artistsInfo.total ? artistsInfo.total : artistsInfo.page * 60}
            onLoadData={this.loadArtists.bind(this)}>
          </Pager>
          <div className={`Songbook`}>
          <List
            className={`List--artist`}
            items={artists}
            renderItem={this.renderArtist.bind(this)}
            isFetching={artistsInfo.isFetching}
            editScroll={this.props.editScroll}
            scroll={this.props.scroll}
            i18nNoContent={i18nNoContent} />
          </div>
        </section>
        {/* <Pager currentLen={currentLen} totalLen={artistsInfo.total} pageCount={60} messageKey={`pager.total.artists`} /> */}
      </div>
    );
  }

  renderArtist(item, index) {
    const { query } = this.props;
    return (
      <div key={index} className={`List-col`}>
        {item.map((subItem, subIndex) => {
          if (typeof subItem === 'undefined') {
            return <a key={subIndex} className={`Artist Artist--empty`} />;
          }
          return (
            <Link key={subIndex} className={`Artist`} to={{ pathname: `${ROOT}/app/songbook/artists`, query: { artistType: query.artistType, artistName: subItem.name, artistId: subItem.id } }}>
              {subItem.name}
            </Link>
          );
        })}
      </div>
    );
  }

  loadSongs(evt, count, diff, forcePage) {
    const { query, songsInfo, songsInSongbook, loadSongsByLang, loadSongsByArtist, loadSongsByFolder, mouseActions } = this.props;
    const { lang, stroke, artistId, artistName, path, rt } = query;
    const page = forcePage ? forcePage : getNextActionPage(songsInfo.page, count, diff);
    if (artistId) {
      this.setState({ selected: [] });
      mouseActions.removeMove();
      return loadSongsByArtist({ page, artistId, artistName, count });
    }
    if( lang ) {
      if ( stroke ) {
        this.setState({ selected: [] });
        mouseActions.removeMove();
        return loadSongsByLang({ page, lang, nsongs: stroke, count });
      } else {
        this.setState({ selected: [] });
        mouseActions.removeMove();
        return loadSongsByLang({ page, lang, count })
      }
    }

    if (path || rt) {
      this.setState({ selected: [] });
      mouseActions.removeMove();
      return loadSongsByFolder({page, path: path || rt, count});
    }
  }

  loadArtists(evt, count , diff, forcePage) {
    const { query, artistsInfo, artistsInSongbook, loadArtistsByArtistType } = this.props;
    const { artistType } = query
    const page = forcePage ? forcePage : getNextActionPage(artistsInfo.page, count, diff);
    if ( artistsInSongbook.length * artistsInfo.page > artistsInfo.total && diff !== 0 ) {
      return ;
    }

    return loadArtistsByArtistType({ page, artistType, count });
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
      const selected = songs
      .filter( item => item.type === undefined || item.type === 1 )
      .map( item => Object.assign({songid: item.id, flow: item.flow, item}));
      if ( selected.length > 0 ) {
        this.setState({selected });
        mouseActions.addMove();
      }
    } else {
      this.setState({selected: [] });
      mouseActions.removeMove();
    }
  }

  _handleActionPanelSuccess() {
    const { mouseActions } = this.props;
    this.setState({selected: [] });
    mouseActions.removeMove();
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

function mapToI18n(name, i18n) {
  if ( isNaN(name) ) {
    return i18n[i18n.myLang]['songbook.title.' + name.toLowerCase()]
  } else {
    return i18n[i18n.myLang]['songbook.title.stroke0' + name]
  }
}

function mapStateToProps(state, ownProps) {
  const { query } = ownProps.location;
  const { songbookType } = ownProps.params;
  const {
    entities: { songs, artists },
    pagination: { artistsByType, songsByLang, songsByArtist, songsByFolder },
    scroll, i18n
  } = state
  const playerOnOff = state.system.playerOnOff;

  let songsInfo = { ids: [], page: 0 };
  if (query.artistId) {
    songsInfo = songsByArtist[query.artistId] || { ids: [], page: 0 };
  } else if (query.lang) {
    songsInfo = songsByLang[query.lang] || { ids: [], page: 0 };
  } else if ( query.path ) {
    songsInfo = songsByFolder[query.path]||{ ids: [], page: 0 };
  } else if ( query.rt ) {
    songsInfo = songsByFolder[query.rt]||{ ids: [], page: 0 };
  }

  const songsInSongbook = songsInfo.ids.map(id => songs[id]);
  const artistsInfo = artistsByType[query.artistType] || { ids: [], page: 0 };
  const artistsInSongbook = artistsInfo.ids.map(id => artists[id]);

  return {
    query,
    songbookType,
    songsInfo,
    artistsInfo,
    songsInSongbook,
    artistsInSongbook,
    scroll,
    i18n,
    playerOnOff
  };
}

SongbookContent.contextTypes = {
  router: React.PropTypes.object
};

const actionCreators = {
  loadSongsByArtist,
  loadSongsByLang,
  loadArtistsByArtistType,
  loadSongsByFolder,
  editScroll,
  putSongArrayToQueue,
  postSongArrayToQueue,
  postFavoriteToQueue
};

export default connect(mapStateToProps, actionCreators)(SongbookContent);
