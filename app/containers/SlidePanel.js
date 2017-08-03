import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import { loadSongsByKeyword, loadArtistsByKeyword, loadSongsByArtist } from '../actions/songslist';
import { search, backToArtists } from '../actions/slide-panel';
import { loadListFromFavorite } from '../actions/favorite';
import { stopPropagation } from '../utils/functions';
import { editScroll } from '../actions/scroll';

import { API_ROOT } from '../constants/Config';
import SearchForm from '../components/SearchForm';
import List from '../components/List';
import ActionPanel from '../components/ActionPanel';
import IMG_DEFAULT from '../assets/images/ic_thumbnail_default.png';
import HELP_IMG from '../assets/images/ic_help.png';
import EMPTY_IMG from '../assets/images/ic_empty_search.png';
import { HOSTURL } from '../constants/Config';

class SlidePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSong: '',
      initState: true,
      selected: []
    };
  }

  render() {
    const { className, slidePanelState, listsInFavorite } = this.props;
    const view = slidePanelState.view;
    const slideContainerClassName = classnames(`SlideContainer`, {
      'isInit': this.state.initState && view === 'search',
      'isTriggeredByModal': view === 'help' && slidePanelState.isTriggeredByModal,
    })

    return (
      <div  className={className} onClick={this.handleGlobalClick.bind(this)}>
        <div className={slideContainerClassName}>
          {this.renderContent(slidePanelState)}
        </div>
      </div>
    );
  }

  renderContent(slidePanelState) {
    const { i18n } = this.props;
    if (slidePanelState.view === 'search') {
      return (
        <div className={`SlideContent SlideContent--search`}>
          <SearchForm options={
              [{
                label: i18n[i18n.myLang]['slidepanel.select.artists'],
                value: 'artist'
              },
              {
                label: i18n[i18n.myLang]['slidepanel.select.songs'],
                value: 'song'
              }]
            }
            onSubmit={this.handleSearch.bind(this)}
            i18n={i18n}
            onhandleSearch={this.setToNotInitState.bind(this)}
            searchButtonClassName={`SearchForm-submit`}
            inputPlaceHolder={i18n[i18n.myLang]['slidepanel.input.placeholder']} />
          {this.renderSearchResult()}
        </div>
      );
    }

    return this.renderHelpMsg();
  }

  renderSearchResult() {
    const { artistsInfo, artistsInSearch, songsInfo, songsInSearch, searchResult } = this.props;
    if (searchResult.searchType === 'song') {
      return this.renderSongs(songsInSearch, songsInfo, searchResult);
    }

    if (searchResult.searchType === 'artist') {
      return this.renderArtists(artistsInSearch, artistsInfo)
    }

    return ;
  }

  renderSongs(songs = [], songsInfo, searchResult) {
    const { i18n } = this.props;
    const i18nNoContent = i18n.myLang ? i18n[i18n.myLang]['songbook.list.nocontent'] : i18n[browserLang]['songbook.list.nocontent'];
    let title = searchResult.step > 1 ? searchResult.keyword.artistName : searchResult.keyword.text;
    return (
      <div className={`SearchResult SearchResult--song`}>
        <div className={`SearchResult-head`}>
          <h2>
            {this.renderBackBtn(searchResult)}
            {title}
          </h2>
          <p>
            {`${i18n[i18n.myLang]['slidepanel.total.prefix']} ${songsInfo.total} ${i18n[i18n.myLang]['slidepanel.total.songs']}`}
          </p>
        </div>
        <div className={`SearchResult-body`}>
          {
            songs.length > 0 ?
            <div className={`List-head`}>
              <div>
                {i18n[i18n.myLang]['list.head.song']}
              </div>
              <div className={`List-head-artists`}>
                {i18n[i18n.myLang]['list.head.artist']}
              </div>
            </div> : null
          }
          <List className={`List--search-songs`}
                items={songs}
                renderItem={this.renderSongsItem.bind(this)}
                renderEmpty={this.renderEmpty.bind(this)}
                isFetching={songsInfo.isFetching}
                onLoadMore={this.loadMoreSongs.bind(this)}
                editScroll={this.props.editScroll}
                i18nNoContent={i18nNoContent} />
        </div>
      </div>
    );
  }

  renderSongsItem(item, index) {
    const { activeSong } = this.state
    const ClassName = classnames('Song Song--search', {
      'is-inQueue': item.inPlaylist
    });

    const ActionPanelClassName = classnames('ActionPanel',{
      'is-selected': activeSong === item.id
    })

    return (
      <div key={index} className={ClassName} onClick={this.handleSongClick.bind(this, item.id)} onMouseOver={() => this.handleItemMouseOver(item)}>
        <div className={`Song-info`}>
          <img className="Song-thumbnail"
              src={`${API_ROOT}/songlist/thumb/${item.id}`}
              onError={this.handleImgError.bind(this)} />
          <span className="Song-title">{item.name}</span>
          <span className="Song-artist">{item.artist}</span>
        </div>
        <ActionPanel
          className={ActionPanelClassName}
          data={{ songId: item.id, songName: item.name, selected: this.state.selected }}
          playerOnOff={this.props.playerOnOff}
          notifyFunc={this.props.toggleNotification.bind(this)} />
      </div>
    );
  }

  handleSongClick(id, evt) {
    const { activeSong } = this.state
    this.setState({
      activeSong: activeSong === id ? '' : id
    })
    stopPropagation(evt)
  }

  handleImgError(e) {
    return e.currentTarget.src = IMG_DEFAULT
  }

  renderBackBtn(searchResult) {
    if (searchResult.step > 1 ) {
      return (
        <button className={`SearchResult-back ic btn_mainpage_backstratum`} onClick={this.handleBack.bind(this)} />
      );
    }
    return ;
  }

  renderArtists(artists, artistsInfo) {
    const { searchResult: { keyword }, i18n } = this.props;
    const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
    const i18nNoContent = i18n.myLang ? i18n[i18n.myLang]['songbook.list.nocontent'] : i18n[browserLang]['songbook.list.nocontent'];
    return (
      <div className={`SearchResult SearchResult--artist`}>
        <div className={`SearchResult-head`}>
          <h2>{keyword.text}</h2>
          <p>
            {`${i18n[i18n.myLang]['slidepanel.total.prefix']} ${artistsInfo.total} ${i18n[i18n.myLang]['slidepanel.total.artists']}`}
          </p>
        </div>
        <List
          className={`List--search-artists`}
          items={artists}
          renderItem={this.renderArtistsItem.bind(this)}
          renderEmpty={this.renderEmpty.bind(this)}
          isFetching={artistsInfo.isFetching}
          onLoadMore={this.loadMoreArtists.bind(this)}
          editScroll={this.props.editScroll}
          i18nNoContent={i18nNoContent} />
      </div>
    );
  }

  renderArtistsItem(item, index) {
    return (
      <div key={index} className={`Artist Artist--search`} onClick={this.handleArtistClick.bind(this, item)}>
        <span>{item.name}</span>
      </div>
    );
  }

  renderEmpty() {
    return (
      <div className={`Empty Empty--search`}>
        <img src={EMPTY_IMG} alt="Empty" />
        <span>No Content</span>
      </div>
    )
  }

  renderHelpMsg() {
    const { i18n } = this.props;
    return (
      <div className={`SlideContent`}>
        <div className={`SlideContent-head`}>
          <img src={HELP_IMG} alt="Help" />
          <h1>
            {i18n[i18n.myLang]['slidepanel.help.title']}
          </h1>
        </div>
        <div className={`SlideContent-body scrollbar-style-1`}>
          <h3>
            {i18n[i18n.myLang]['slidepanel.help.ruleTitle']}
          </h3>
          <hr />
          <div className={`SlideContent-intro`}>
            <p>
              {i18n[i18n.myLang]['slidepanel.help.introduction.part01'] + ' '}
              <a className={`no-link`} onClick={ () => window.open(`${HOSTURL}:8080/filestation`) } target="qnap">File Station</a>
              {' ' + i18n[i18n.myLang]['slidepanel.help.introduction.part02']}
            </p>
            <p>
              {i18n[i18n.myLang]['slidepanel.help.introduction.part03']}
              <br />
              {i18n[i18n.myLang]['slidepanel.help.introduction.part04']}
            </p>
            <div className={`Example`}>
              <div>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.example.part01']}
                </span>
              </div>
              <ul>
                <li>
                  <span>
                    {i18n[i18n.myLang]['slidepanel.help.example.part02']}
                  </span>
                </li>
                <li>
                  <span>
                    {i18n[i18n.myLang]['slidepanel.help.example.part03']}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className={`Doc`}>
            <div className={`Doc-title`}>
              {i18n[i18n.myLang]['slidepanel.help.document.title']}
            </div>
            <div className={`Doc-table Table`}>
              <div className={`Table-head`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.gender']}
                </span>
                <span className={`Table-divider`} />
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.code01']}
                </span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.male']}
                </span>
                <span className={`Table-divider`} />
                <span>M / M / M</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.female']}
                </span>
                <span className={`Table-divider`} />
                <span>F / F / F</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.group']}
                </span>
                <span className={`Table-divider`} />
                <span>G / G / G</span>
              </div>
            </div>
            <div className={`Doc-table Table`}>
              <div className={`Table-head`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.language']}
                </span>
                <span className={`Table-divider`} />
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.code01']}
                </span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.language.mandarin']}
                </span>
                <span className={`Table-divider`} />
                <span>國 / 国 / M</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.language.taiwanese']}
                </span>
                <span className={`Table-divider`} />
                <span>台 / 闽 / T</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.language.cantonese']}
                </span>
                <span className={`Table-divider`} />
                <span>粵 / 粤 / C</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.language.english']}
                </span>
                <span className={`Table-divider`} />
                <span>英 / 英 / E</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.language.japanese']}
                </span>
                <span className={`Table-divider`} />
                <span>日 / 日 / J</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.language.korean']}
                </span>
                <span className={`Table-divider`} />
                <span>韓 / 韩 / K</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.language.spain']}
                </span>
                <span className={`Table-divider`} />
                <span>西 / 西 / S</span>
              </div>
            </div>
            <div className={`Doc-table Table`}>
              <div className={`Table-head`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.voice']}
                </span>
                <span className={`Table-divider`} />
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.code02']}
                </span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.voice.left']}
                </span>
                <span className={`Table-divider`} />
                <span>L</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.voice.right']}
                </span>
                <span className={`Table-divider`} />
                <span>R</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.voice.track01']}
                </span>
                <span className={`Table-divider`} />
                <span>0</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.voice.track02']}
                </span>
                <span className={`Table-divider`} />
                <span>1</span>
              </div>
              <div className={`Table-item`}>
                <span>
                  {i18n[i18n.myLang]['slidepanel.help.document.voice.3d']}
                </span>
                <span className={`Table-divider`} />
                <span>S</span>
              </div>
            </div>
          </div>
        </div>
        <button className={`SlideContent-close ic delete`} onClick={this.removePanel.bind(this)} />
      </div>
    );
  }

  removePanel(evt) {
    const { slidePanelState, toggleView, toggleHeader } = this.props;

    if (!slidePanelState.visible) {
      return ;
    }
    if ( typeof toggleHeader === 'function' ) {
      toggleHeader({pressed:'help'});
    }
    return toggleView('slidePanel', { visible: false });
  }

  handleBack(evt) {
    const { backToArtists } = this.props;
    return backToArtists('artist', 1);
  }

  handleSearch(evt, input) {
    const { loadSongsByKeyword, loadArtistsByKeyword, search } = this.props;
    const { text, select } = input;

    if (text.length === 0) {
      return ;
    }

    search(select, { text }, 1);

    if (select === 'song') {
      return loadSongsByKeyword({ keyword: text });
    }

    return loadArtistsByKeyword({ count: 30, keyword: text });
  }

  handleArtistClick(item, evt) {
    const { loadSongsByArtist, search } = this.props;
    return loadSongsByArtist({ artistId: `${item.id}`, artistName: item.name }).then( result => {
      search('song', { artistId: item.id, artistName: item.name }, 2);
    });
  }

  loadMoreSongs(evt) {
    const { songsInfo, songsInSearch, loadSongsByKeyword, loadSongsByArtist, searchResult } = this.props;
    if (songsInSearch.length >= songsInfo.total) {
      return ;
    }

    if (searchResult.step > 1)  {
      return loadSongsByArtist({ page: songsInfo.page + 1, artistId: searchResult.keyword.artistId.toString(), artistName: searchResult.keyword.artistName, append: true });
    }

    return loadSongsByKeyword({ page: songsInfo.page + 1, keyword: searchResult.keyword.text, append: true });
  }

  loadMoreArtists(evt) {
    const { artistsInfo, artistsInSearch, loadArtistsByKeyword, searchResult } = this.props;

    if (artistsInSearch.length >= artistsInfo.total) {
      return ;
    }

    return loadArtistsByKeyword({ page: artistsInfo.page + 1, count: 30, keyword: searchResult.keyword.text, append: true });
  }

  setToNotInitState() {
    this.setState({initState: false});
  }

  handleItemMouseOver(item) {
    const { isMulti } = this.state;
    if ( !isMulti ) {
      this.setState({songid: item.id, selected: [{item}]})
    }
  }

  handleGlobalClick(e) {
    stopPropagation(e);
  }
}

function mapStateToProps(state) {
  const {
    entities: { artists, songs, lists },
    pagination: { artistsByKeyword, songsByKeyword, songsByArtist, listsElse },
    search,
    views, i18n
  } = state;

  const favoriteInfo = listsElse['favorite'] || { ids: [] };
  const listsInFavorite = favoriteInfo.ids.map(id => lists[id]);
  const slidePanelState = views['slidePanel'];
  const artistsInfo = artistsByKeyword['search'] || { ids: [], page: 0 };
  const artistsInSearch = artistsInfo.ids.map(id => artists[id]);
  const playerOnOff = state.system.playerOnOff;
  let songsInfo, songsInSearch;

  if (search.step > 1) {
    songsInfo = songsByArtist[search.keyword.artistId] || { ids: [], page: 0 };
  } else {
    songsInfo = songsByKeyword['search'] || { ids: [], page: 0 };
  }
  songsInSearch = songsInfo.ids.map(id => songs[id]);

  return {
    searchResult: search,
    artistsInfo,
    artistsInSearch,
    songsInfo,
    songsInSearch,
    slidePanelState,
    listsInFavorite,
    i18n,
    playerOnOff
  };
}

export default connect(mapStateToProps, { loadSongsByKeyword, loadArtistsByKeyword, loadSongsByArtist, search, backToArtists, loadListFromFavorite, editScroll })(SlidePanel);
