import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import { ROOT, API_ROOT } from '../constants/Config';
import IMG_DEFAULT from '../assets/images/ic_thumbnail_default.png';

import List from '../components/List';
import SideNav from '../components/SideNav';
import Pager from '../components/Pager';
import ActionPanel from '../components/ActionPanel';
import Notification from '../components/Notification';

import * as favorActions from '../actions/favorite';
import { putSongArrayToQueue, postSongArrayToQueue, postFavoriteToQueue } from '../actions/playlist';
import { stopPropagation, getNextActionPage } from '../utils/functions';

function loadData(props) {
  return props.favorActions.loadListFromFavorite();
}

class FavoritePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      songid: ''
    }
  }

  componentWillMount() {
    const { mouseActions, socket, favorId, favorActions } = this.props;
    socket.removeAllListeners('playlist.change');
    socket.removeAllListeners('favorite.change');
    socket.removeAllListeners('songlist.song.change');
    socket.removeAllListeners('playlist.history.change');
    socket.removeAllListeners('youtube.playlist.change');
    mouseActions.removeMove();
    socket.on('favorite.change', this.handleFavoriteChangeEvent.bind(this));
    socket.on('playlist.change', this.handleSocketIoEvent.bind(this));
    loadData(this.props);
    if ( favorId ) {
      favorActions.loadSongsFromFavorite(favorId, 1, 15);
    }
  }

  handleSocketIoEvent(msg){
    const { fetchPlaylistInfo, favorActions, listInfo, favorId } = this.props;
    fetchPlaylistInfo();
    favorActions.loadSongsFromFavorite(favorId, listInfo.page, 15);
  }

  handleFavoriteChangeEvent(msg) {
    const { favorActions, listInfo, favorId } = this.props;
    favorActions.loadListFromFavorite();
    favorActions.loadSongsFromFavorite(favorId, listInfo.page, 15);
  }

  componentWillReceiveProps(nextProps) {
    const { mouseActions, mouse, songsInFavorite } = this.props;
    if ( !nextProps.favorId && nextProps.listsInFavorite.length !== 0 ) {
      this.setState({selected:[] });
      return this.context.router.push(`${ROOT}/app/favorite?favorId=${nextProps.listsInFavorite[0].id}&favorName=${nextProps.listsInFavorite[0].name}`);
    }
    if ( nextProps.favorId !== this.props.favorId ) {
      this.setState({selected:[] });
      mouseActions.removeMove();
      return nextProps.favorActions.loadSongsFromFavorite(nextProps.favorId, 1, 15);
    } else if ( songsInFavorite.length === 0 && mouse.move ) {
      this.setState({selected:[] });
      return mouseActions.removeMove();
    }
  }

  render() {
    const {
      favorId,
      favorName,
      favoriteInfo,
      listsInFavorite,
      listInfo,
      songsInFavorite,
      footerState,
      i18n,
      toggleNotification,
      mouse,
      putSongArrayToQueue,
      postSongArrayToQueue,
      postFavoriteToQueue,
      toggleView,
      sidenav,
      mouseActions
    } = this.props;

    const ClassName = classnames({
      'Page': true,
      'Page--favorite': true,
      'is-footer-hidden': !footerState.visible
    });

    const i18nNoContent = i18n[i18n.myLang]['songbook.list.nocontent'];

    const ActionPanelClassName = classnames('ActionPanel-inmulti', {
      'is-show': mouse.move,
      'is-selected': true
    });

    const data = {
      selected: this.state.selected,
      multiMode: true,
      favorId
    };
    const mouseTop = mouse && mouse.move ? (mouse.pageY - 20) + 'px' : '-20%';
    return (
      <div className={ClassName}>
        <SideNav
          toggleNotification={toggleNotification}
          i18n={i18n}
          sidenav={sidenav} />
        {this.renderTabs(listsInFavorite)}
        <div className={`Page-content`}>
          {/*<Filter
            isInFavorite={true}
            data={{ favorId: favorId, selected: this.state.selected, multiMode: true }}
            notifyFunc={this.props.toggleNotification.bind(this)}
            isDisable={isDisableFilterButton}
            handleMultiMode={this._handleMultiMode.bind(this)}
            isMulti={this.state.isMulti}
            afterSuccess={this._setStateInit.bind(this)}
            onHandleSelectAll={this._selectAll.bind(this)}
            onHandleClearAll={this._clearAll.bind(this)} />*/}
          <section className={`Page-main`}>
            {/*<h1 className={`Page-title`}>
              {favorName}
              <span className="ic ic_submenu_rename SideTab-link--listview-edit" onClick={ (event) => this._openEditModal(event, favorId, favorName) } />
              <span className={`Page-total`}>{`${i18n[i18n.myLang][this.state.isMulti ? 'pager.total.selected.prefix' : 'pager.total.prefix']}: ${this.state.isMulti ? this.state.selected.length : (listInfo.total === undefined ? 0 : listInfo.total)} ${i18n[i18n.myLang][this.state.isMulti ? 'pager.total.item' : 'pager.total.songs']}`}</span>
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
              myPage={listInfo.page}
              total={listInfo.total}
              title={favorName}
              history={history}
              isInFavorite={true}
              data={{ favorId, favorName, selected: this.state.selected, multiMode: true }}
              firstNum={listInfo.total === 0 ? 0 : (listInfo.page - 1) * 15 + 1}
              lastNum={listInfo.page * 15 >= listInfo.total ? listInfo.total : listInfo.page * 15}
              openEditModal={this._openEditModal.bind(this)}
              notifyFunc={this.props.toggleNotification.bind(this)}
              onLoadData={this.loadSongs.bind(this)}
              selectedCount={mouse.move ? this.state.selected.length : 0}
              playerOnOff={this.props.playerOnOff}
              toggleView={toggleView}
              mouseActions={mouseActions}
              isFetching={listInfo.isFetching} >
            </Pager>
            <div className={`Favorite Favorite--w620`}>
              {
                listInfo.total === 0 ? null :
                <div className={`Favorite-head--folder-multimode`}>
                  <input
                    className={`Song-info-checkbox-folder-multimode`}
                    checked={this.state.selected.length === songsInFavorite.length && this.state.selected.length !== 0 && mouse.move}
                    type="checkbox"
                    onChange={(evt) => this._handleSelectAll(evt, songsInFavorite)} />
                  <div className={`Songname-multimode`}>
                    {i18n[i18n.myLang]['list.head.song']}
                  </div>
                  <div className="Favorite-head-artists Artistsname-multimode">
                    {i18n[i18n.myLang]['list.head.artist']}
                  </div>
                </div>
              }
              <List
                className={`List--favorite Favorite-body`}
                items={songsInFavorite}
                renderItem={this.renderListItem.bind(this)}
                isFetching={listInfo.isFetching}
                i18nNoContent={i18nNoContent} />
            </div>
          </section>
          {/* <Pager currentLen={songsInFavorite.length} totalLen={listInfo.total} pageCount={20} messageKey={`pager.total.songs`} /> */}
        </div>
        <div className={`ActionPanel-multi`} style={{'top': mouseTop}}>
          <ActionPanel
            className={ActionPanelClassName}
            isMultiMode={this.state.songid}
            data={data}
            parentState={`multi`}
            isInFavorite={true}
            notifyFunc={this.props.toggleNotification.bind(this)}
            playerOnOff={this.props.playerOnOff}
            onRemoveFromFavorite={this.handleSetInit.bind(this)}
            onAddToQueue={this.handleSetInit.bind(this)}
            onInsertToQueue={this.handleSetInit.bind(this)} />
        </div>
      </div>
    );
  }

  renderTabs(listsInFavorite) {
    const length = listsInFavorite.length;
    const { i18n } = this.props;
    return (
      <div className={`SideTab`}>
        <div className={`SideTab-link SideTab-link--add-favor`} onClick={ (evt) => this._openAddNewFavorModal(evt) } >
          <span className={`SideTab--add-favor ic ic_controlbar_plus`} />
          <span>{i18n[i18n.myLang]['sidetab.button.addnewfavor']}</span>
        </div>
        {listsInFavorite.map(this.renderTabItem.bind(this, length))}
      </div>
    );
  }

  renderTabItem(length, item, index) {
    const openEditIconClass = classnames('ic ic_submenu_rename', {
      'SideTab-edit': length > 1,
      'SideTab-delete': length === 1
    })
    return (
      <Link key={index} className={`SideTab-link SideTab-link--favorite`} to={{ pathname: `${ROOT}/app/favorite`, query: { favorId: item.id, favorName: item.name } }} activeClassName={`is-current`}>
        <span>{`${item.name}`}</span>
        <span className={`SideTab-total`}>{ `(${item.nSongs})`}</span>
        <span className={`${openEditIconClass}`} onClick={ (evt) => this._openEditModal(evt, item.id, item.name) } />
        {
          length === 1 ? null : <span className="ic ic_action_remove SideTab-delete" onClick={ (evt) => this._openDeleteModal(evt, item.id, item.name) } />
        }
      </Link>
    );
  }

  renderListItem(item, index) {
    const { favorId, favorActions, mouse } = this.props;
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
      'is-selected': !this.state.selected.every(elem => elem.songid !== item.id) && mouse.move
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
      favorId,
      songId: item.id,
      songName: item.name,
      flow: item.flow
    };
    return (
      <label htmlFor={`favoriteMultiMode${item.id}`} key={index} className={LabelMultiModeClassName} onMouseOver={() => this.handleItemMouseOver(item)}>
        <div className={`Song-info`}>
          <input
            id={`favoriteMultiMode${item.id}`}
            className={`Song-info-checkbox`}
            type="checkbox"
            checked={!this.state.selected.every(elem => elem.songid !== item.id) && mouse.move}
            onChange={(evt) => this._handleSelectItem(evt, { songid: item.id, flow: item.flow, item })} />
          <img className="Song-thumbnail"
              src={`${API_ROOT}/songlist/thumb/${item.id}`}
              onError={this.handleImgError.bind(this)} />
          <span className="Song-title">{item.name}</span>
          <span className={`Song-artist ${MultiModeClassName}`}>{item.artist}</span>
        </div>
        <ActionPanel
          className={ActionPanelClassName}
          isMultiMode={this.state.songid}
          data={data}
          onRemoveFromFavorite={this.handleSetInit.bind(this)}
          isInFavorite={true}
          playerOnOff={this.props.playerOnOff}
          notifyFunc={this.props.toggleNotification.bind(this)} />
      </label>
    );
  }

  handleSetInit() {
    const { mouseActions } = this.props;
    this.setState({selected: [] });
    mouseActions.removeMove();
  }


  handleImgError(e) {
    return e.currentTarget.src = IMG_DEFAULT;
  }

  loadSongs(evt, count, diff, forcePage) {
    const { favorId, favorActions, listInfo, mouseActions } = this.props;
    const page = forcePage ? forcePage : getNextActionPage( listInfo.page, count ,diff );
    this.setState({ selected: [] });
    mouseActions.removeMove();
    favorActions.loadSongsFromFavorite(favorId, page, count);
  }

  _openEditModal(evt, favorId, favorName) {
    const { toggleView, toggleHeader } = this.props;
    stopPropagation(evt);
    toggleView('moreSettingPanel', { visible: false, view: 'more' })
    toggleHeader({ pressed: 'more', forceHidden: true });
    toggleView('slidePanel', { visible: false, view: 'search' });
    toggleView('modal', { visible: true, type: 'favorEdit', data: { favorId, favorName }})
  }

  _openDeleteModal(evt, favorId, favorName) {
    const { toggleView, toggleHeader } = this.props;
    stopPropagation(evt)
    toggleView('moreSettingPanel', { visible: false, view: 'more' })
    toggleHeader({ pressed: 'more', forceHidden: true });
    toggleView('slidePanel', { visible: false, view: 'search' });
    toggleView('modal', { visible: true, type: 'favorDelete', data: { favorId, favorName }})
  }

  _openAddNewFavorModal(evt) {
    const { toggleView, toggleHeader } = this.props;
    stopPropagation(evt)
    toggleView('moreSettingPanel', { visible: false, view: 'more' })
    toggleHeader({ pressed: 'more', forceHidden: true });
    toggleView('slidePanel', { visible: false, view: 'search' });
    toggleView('modal', { visible: true, type: 'favorAdd'});
  }

  onRemoveFromFavorite(evt, data, deleteSongFromFavorite) {
    const { favorActions } = this.props;
    const { favorId, songId, songName } = data;
    deleteSongFromFavorite(favorId, songId, songName).then ( (result) => {
      favorActions.loadSongsFromFavorite(favorId);
      favorActions.loadListFromFavorite();
    })
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
      const selected = songs.map( item => Object.assign({}, {}, {songid: item.id, flow: item.flow, item}));
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
}

function mapStateToProps(state, ownProps) {
  const { query: { favorId, favorName } } = ownProps.location;
  const {
    pagination: { listsElse, songsFromFavorite },
    entities: { lists, songs },
    views, i18n
  } = state;

  const favoriteInfo = listsElse['favorite'] || { ids: [], page: 0 };
  const listsInFavorite = favoriteInfo.ids.map(id => lists[id]);
  const listInfo = songsFromFavorite[favorId] || { ids: [] };
  const songsInFavorite = listInfo.ids.map(id => songs[id]);
  const footerState = views['footer'];
  const playerOnOff = state.system.playerOnOff;

  return {
    favorId,
    favorName,
    favoriteInfo,
    listsInFavorite,
    listInfo,
    songsInFavorite,
    footerState,
    i18n,
    playerOnOff
  };
}

function mapDispatchToProps(dispatch) {
  return {
    favorActions: bindActionCreators(favorActions, dispatch),
    putSongArrayToQueue: bindActionCreators(putSongArrayToQueue, dispatch),
    postSongArrayToQueue: bindActionCreators(postSongArrayToQueue, dispatch),
    postFavoriteToQueue: bindActionCreators(postFavoriteToQueue, dispatch)
  }
}

FavoritePage.contextTypes = {
  router: React.PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage);
