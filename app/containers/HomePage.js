import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import moment from 'moment';
import Notification from '../components/Notification';

import { ROOT, API_ROOT } from '../constants/Config';
import IMG_DEFAULT from '../assets/images/ic_thumbnail_default.png';
import IMG_YOUTUBE_TIP from '../assets/images/function_info.png';
import { loadPlaylist, loadHistory } from '../actions/playlist';
import { loadListFromFavorite } from '../actions/favorite';
import { loadYoutubeCategory } from '../actions/youtube';
import { stopPropagation, getYoutubeLangName } from '../utils/functions'

import Slider from '../components/Slider';
import List from '../components/List';
import ActionPanel from '../components/ActionPanel';
import YoutubeActionPanel from '../components/YoutubeActionPanel';


function loadData(props) {
  const lang = getYoutubeLangName(props.i18n.myLang)
  props.loadListFromFavorite();
  props.loadPlaylist('current');
  props.loadPlaylist('finished');
  props.loadHistory();
  props.loadYoutubeCategory({ lang });
}

class HomePage extends Component {

  constructor(props) {
    super(props);
    this._handleScreenResize = ::this._handleScreenResize;
    this.state = {
      activeSong: '',
      slides: 3,
      selected: [],
      tip: false,
      showYoutube: false
    }
  }

  componentWillMount() {
    const { socket, loadPlaylist, socketio, loadHistory } = this.props;
    socket.removeAllListeners('playlist.change');
    socket.removeAllListeners('favorite.change');
    socket.removeAllListeners('songlist.song.change');
    socket.removeAllListeners('playlist.history.change');
    socket.removeAllListeners('youtube.playlist.change');
    socket.on('favorite.change', this.handleFavoriteChangeEvent.bind(this));
    socket.on('playlist.change', msg => {
      loadPlaylist('current');
      loadPlaylist('finished');
    });
    socket.on('playlist.history.change', msg => {
      loadHistory();
    });
    window.addEventListener('resize', this._handleScreenResize)
    loadData(this.props);
  }

  componentDidMount() {
    const body = document.body
    if (body.scrollWidth < 900 ) {
      this.setState({
        slides: 1
      })
    } else if (body.scrollWidth < 1600 && body.scrollWidth >= 900) {
      this.setState({
        slides: 2
      });
    } else {
      this.setState({
        slides: 3
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleScreenResize)
  }

  componentWillReceiveProps(nextProps) {
    const {
      i18n,
    } = nextProps;

    if ( this.props.i18n.myLang && this.props.i18n.myLang !== i18n.myLang ) {
      const lang = getYoutubeLangName(i18n.myLang)
      nextProps.loadYoutubeCategory({ lang });
    }
  }

  render() {
    const {
      songsInQueue, queueInfo,
      listInFavorites, favoritesInfo,
      songsInHistory, historyInfo,
      footerState, listsInCategory
    } = this.props;
    const { showYoutube } = this.state;
    const ClassName = classnames({
      'Page': true,
      'Page--home': true,
      'is-footer-hidden': !footerState.visible
    });

    const body = document.body
    //if ( this.state.showYoutube ) {
      return (
        <div className={ClassName}>
          <Slider slidesToShow={this.state.slides} showYoutube={showYoutube} handleShowYoutube={this.handleShowYoutube.bind(this)}>
          {this.renderFavorites(listInFavorites, favoritesInfo)}
          {this.renderYoutube(listsInCategory)/*this.renderYoutube(listsInCategory)*/}
          {this.renderSongBook()}
          {this.renderQueue(songsInQueue, queueInfo)}
          {this.renderHistory(songsInHistory, historyInfo)}
          </Slider>
        </div>
      );
    // } else {
    //   return (
    //     <div className={ClassName}>
    //       <Slider slidesToShow={this.state.slides} showYoutube={showYoutube} handleShowYoutube={this.handleShowYoutube.bind(this)}>
    //       {this.renderFavorites(listInFavorites, favoritesInfo)}
    //       {this.renderSongBook()}
    //       {this.renderQueue(songsInQueue, queueInfo)}
    //       {this.renderHistory(songsInHistory, historyInfo)}
    //       </Slider>
    //     </div>
    //   );
    // }
  }

  renderFavorites(listInFavorites = [], favoritesInfo = {}) {
    const { i18n } = this.props;
    return (
      <section className={`Favorite`}>
        <h1>
          <span className={`ic ic_menu_favorite`} />
          <Link className={``} to={`${ROOT}/app/favorite`}>
            {i18n[i18n.myLang]['homepage.title.favor']}
          </Link>
        </h1>
        <List className={`List--favorites`}
              items={listInFavorites.slice(0, 8)}
              renderItem={this.renderListInFavorites.bind(this)}
              isFetching={favoritesInfo.isFetching} />
        <Link className={`Favorite-more`} to={`${ROOT}/app/favorite`}>
          {i18n[i18n.myLang]['homepage.button.more']}
        </Link>
      </section>
    );
  }

  renderListInFavorites(item, index) {
    return (
      <Link key={index} className={`Favorites`} to={{ pathname: `${ROOT}/app/favorite`, query: { favorId: item.id, favorName: item.name } }}>
        <div className={`Favorites-icon`} />
        <span className={`Favorites-name`}>{item.name}</span>
        <span className={`Favorites-count`}>{`${item.nSongs} ${item.nSongs === 1 ? 'song' : 'songs' }`}</span>
      </Link>
    );
  }

  renderSongBook() {
    const { i18n } = this.props;
    return (
      <section className={`Songbook`}>
        <h1>
          <span className={`ic ic_menu_requestbook`} />
          <span className={``}>
            {i18n[i18n.myLang]['homepage.title.songbook']}
          </span>
        </h1>
        <div className={`Songbook-navs`}>
          <Link className={`Songbook-link`} to={{ pathname: `${ROOT}/app/songbook/folders`, query: { path: 'OceanKTV', rt: 'OceanKTV' } }}>
            <div className={`Songbook-link--bgImage-01`}><i/></div>
            <h2>
              {i18n[i18n.myLang]['homepage.button.allsongs']}
            </h2>
          </Link>
          <Link className={`Songbook-link`} to={{ pathname: `${ROOT}/app/songbook/artists`, query: { artistType: `male` } }}>
            <div className={`Songbook-link--bgImage-02`}><i/></div>
            <h2>
              {i18n[i18n.myLang]['homepage.button.artists']}
            </h2>
          </Link>
          <Link className={`Songbook-link`} to={{ pathname: `${ROOT}/app/songbook/songs`, query: { lang: `Mandarin` } }}>
            <div className={`Songbook-link--bgImage-03`}><i/></div>
            <h2>
              {i18n[i18n.myLang]['homepage.button.language']}
            </h2>
          </Link>
        </div>
      </section>
    );
  }

  renderQueue(songsInQueue = [], queueInfo = {}) {
    const { i18n } = this.props;
    const i18nNoContent = i18n[i18n.myLang]['playlist.list.nocurrent']
    return (
      <section className={`Queue`}>
        <h1>
          <span className={`ic ic_menu_requestinglist`} />
          <Link className={``} to={{ pathname: `${ROOT}/app/playlist`, query: { list: 'current' } }}>
            {i18n[i18n.myLang]['homepage.title.playlist']}
          </Link>
        </h1>
        <List
          className={`List--queue`}
          items={songsInQueue.slice(0, 7)}
          renderItem={this.renderSongInQueue.bind(this)}
          isFetching={queueInfo.isFetching}
          i18nNoContent={i18nNoContent} />
        {songsInQueue.length > 0 ? <Link className={`Queue-more`} to={{ pathname: `${ROOT}/app/playlist`, query: { list: 'current' } }}>
        {i18n[i18n.myLang]['homepage.button.more']}
        </Link> : null}
      </section>
    );
  }

  renderSongInQueue(item, index) {
    const { activeSong } = this.state;
    const { toggleNotification } = this.props;
    const ClassName = classnames('Song Song--queue');

    const ActionPanelClassName = classnames('ActionPanel ActionPanel--home', {
      'is-selected': activeSong === item.index
    });
    const thumbSrc = item.sourceType !== 0 ? item.thumb : `${API_ROOT}/songlist/thumb/${item.id}`
    const data = {
      selected: this.state.selected,
      index: item.index,
      songId: item.id,
      songName: item.name,
    };
    return (
      <div key={index} className={ClassName} onMouseOver={() => this.handleItemMouseOver(item)}>
        <div className={`Song-info Song-info--home`}>
          <img className="Song-thumbnail Song-thumbnail--home"
              src={thumbSrc}
              onError={this.handleImgError.bind(this)} />
          <span className={`Song-title`}>{item.name}</span>
          <span className={`Song-artist`}>{item.artist}</span>
        </div>
        {
          item.sourceType === 0 ?
          <ActionPanel
            className={ActionPanelClassName}
            data={data}
            isInQueue={true}
            playerOnOff={this.props.playerOnOff}
            notifyFunc={toggleNotification.bind(this)} />
          :
          <YoutubeActionPanel
            className={ActionPanelClassName}
            data={data}
            isInQueue={true}
            playerOnOff={this.props.playerOnOff}
            notifyFunc={toggleNotification.bind(this)} />
        }
      </div>
    );
  }

  renderHistory(songsInHistory = [], historyInfo = {}) {
    const { i18n } = this.props;
    const i18nNoContent = i18n[i18n.myLang]['songbook.list.nocontent']
    return (
      <section className={`History`}>
        <h1>
          <span className={`ic ic_menu_history`} />
          <Link className={``} to={`${ROOT}/app/history`}>
            {i18n[i18n.myLang]['homepage.title.history']}
          </Link>
        </h1>
        <List
          className={`List--history`}
          items={songsInHistory.slice(0, 7)}
          renderItem={this.renderSongInHistory.bind(this)}
          isFetching={historyInfo.isFetching}
          i18nNoContent={i18nNoContent} />
        {songsInHistory.length > 0 ? <Link className={`History-more`} to={`${ROOT}/app/history`}>
        {i18n[i18n.myLang]['homepage.button.more']}
        </Link> : null}
      </section>
    );
  }

  renderSongInHistory(item, index) {
    const { activeSong } = this.state;
    const { toggleNotification } = this.props;
    const ClassName = classnames('Song Song--history', {
      'is-selected': activeSong === item.historyId
    });

    const ActionPanelClassName = classnames('ActionPanel ActionPanel--home', {
      'is-selected': activeSong === item.historyId
    });

    const data = {
      songId: item.id,
      songName: item.name,
      index: item.index,
      selected: this.state.selected
    };
    const thumbSrc = item.sourceType !== 0 ? item.thumb : `${API_ROOT}/songlist/thumb/${item.id}`
    return (
      <div key={index} className={ClassName} onMouseOver={() => this.handleItemMouseOver(item)}>
        <div className={`Song-info Song-info--home`}>
          <img className="Song-thumbnail Song-thumbnail--home"
              src={thumbSrc}
              onError={this.handleImgError.bind(this)} />
          <span className={`Song-title`}>{item.name}</span>
          <span className={`Song-artist`}>{item.artist}</span>
          <span className={`Song-time`}>{moment.unix(item.date).format('YYYY/MM/DD HH:mm')}</span>
        </div>
        { item.sourceType === 0 ?
          <ActionPanel
            className={ActionPanelClassName}
            data={data}
            playerOnOff={this.props.playerOnOff}
            notifyFunc={toggleNotification.bind(this)}  />
          :
          <YoutubeActionPanel
            className={ActionPanelClassName}
            data={data}
            playerOnOff={this.props.playerOnOff}
            notifyFunc={toggleNotification.bind(this)}  />
        }
      </div>
    );
  }

  renderYoutube(listsInCategory = [], categoryInfo = {} ) {
    const { i18n } = this.props;
    const i18nNoContent = i18n[i18n.myLang]['list.network.trouble'];
    const tipDivClassName = classnames(`HomePage-tip-youtube`, {
      'is-show': this.state.tip
    });
    return (
      <section className={`Youtube`}>
        <h1>
          <span className={`ic ic_youtube`} />
          <Link className={``} to={`${ROOT}/app/youtube`}>
            {i18n[i18n.myLang]['homepage.title.youtube']}
          </Link>
          <img
            onMouseOver={ () => setTimeout( () => this.setState( { tip: true } ), 500)}
            onMouseOut={ () => setTimeout( () => this.setState( { tip: false } ), 500)}
            src={IMG_YOUTUBE_TIP}
            className={`HomePage-head-youtube`}
          />
          <span className="ic_new">NEW</span>
        </h1>
        <div className={tipDivClassName}>
          <div>
            {i18n[i18n.myLang]['modal.header.remindYoutube']}
          </div>
          <div>
            {i18n[i18n.myLang]['modal.remindYoutube.descript01']}
          </div>
        </div>
        <div className={`Songbook-navs`}>
          <Link className={`Songbook-link`} to={{ pathname: `${ROOT}/app/youtube/default`}}>
            <div className={`Songbook-link--bgImage-youtube-hot`}><i/></div>
            <h2>
              {i18n[i18n.myLang]['youtube.category.hot']}
            </h2>
          </Link>
          <Link className={`Songbook-link`} to={{ pathname: `${ROOT}/app/youtube/cloudlink`}}>
            <div className={`Songbook-link--bgImage-youtube-cloudlink`}><i/></div>
            <h2>
              {i18n[i18n.myLang]['youtube.category.cloudlink']}
            </h2>
          </Link>
        </div>
      </section>
       // <List className={`List--favorites`}
        //       items={listsInCategory.slice(0, 8)}
        //       renderItem={this.renderListInYoutube.bind(this)}
        //       isFetching={categoryInfo.isFetching}
        //       i18nNoContent={i18nNoContent}
        //       isNetworkTrouble={listsInCategory.length === 0} />
        // <Link className={`Favorite-more`} to={`${ROOT}/app/youtube`}>
        //   {i18n[i18n.myLang]['homepage.button.more']}
        // </Link>
    );
  }

  renderListInYoutube(item, index) {
    return (
      <Link key={index} className={`Favorites`} to={{ pathname: `${ROOT}/app/youtube`, query: { index: item.id, name: item.name } }}>
        <div className={`Youtube-icon`} />
        <span className={`Favorites-name`}>{item.name}</span>
        <span className={`Favorites-count`}>{`${item.count} ${item.count === 1 ? 'song' : 'songs' }`}</span>
      </Link>
    );
  }

  handleImgError(e) {
    return e.currentTarget.src = IMG_DEFAULT
  }

  _handleScreenResize(e) {
    clearTimeout(this.isResizing)

    this.isResizing = setTimeout( () => {
      const body = document.body
      if (body.scrollWidth < 900 ) {
        this.setState({
          slides: 1
        })
      } else if (body.scrollWidth < 1600) {
        this.setState({
          slides: 2
        })
      } else {
        this.setState({
          slides: 3
        })
      }
    }, 0)
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

  handleFavoriteChangeEvent(msg) {
    const { loadListFromFavorite, listInfo, favorId } = this.props;
    loadListFromFavorite();
  }

  handleShowYoutube(value) {
    this.setState( { showYoutube: value || !this.state.showYoutube });
  }
}

function mapStateToProps(state, ownProps) {
  const {
    pagination: { songsFromPlaylist, listsElse, youtubeCategory },
    entities: { songsByCurrent, songsByHistoryId, lists, items },
    views, i18n, socketio
  } = state;

  const favoritesInfo = listsElse['favorite'] || { ids: [] };
  const listInFavorites = favoritesInfo.ids.map(id => lists[id]);
  const queueInfo = songsFromPlaylist['current'] || { ids: [], page: 0 };
  const songsInQueue = queueInfo.ids.map(id => songsByCurrent[id]);
  const historyInfo = songsFromPlaylist['history'] || { ids: [], page: 0 };
  const songsInHistory = historyInfo.ids.map(id => songsByHistoryId[id]);
  const footerState = views['footer'];
  const playerOnOff = state.system.playerOnOff;
  const categoryInfo = youtubeCategory['category'] || { ids: [] };
  const listsInCategory = categoryInfo.ids.map(id => items[id]);

  return {
    favoritesInfo,
    listInFavorites,
    queueInfo,
    historyInfo,
    songsInQueue,
    songsInHistory,
    footerState,
    i18n,
    socketio,
    playerOnOff,
    categoryInfo,
    listsInCategory
  };
}

export default connect(mapStateToProps, { loadPlaylist, loadHistory, loadListFromFavorite, loadYoutubeCategory })(HomePage);
