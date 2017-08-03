import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import List from './List'
import { stopPropagation, removeFromArray } from '../utils/functions'

export default class FavoritesCollection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      select: {},
      songs: [],
      step: 0
    }
    if (props.data.multiMode) {
      this.state.step = 1
      this.state.songs = props.data.selected
    }
  }

  componentDidMount() {
    this.props.favorActions.loadListFromFavorite();
  }

  render() {
    const { select, step } = this.state;
    const { i18n } = this.props;
    return (
      <div className={`Modal-content`}>
        <h2 className={`Modal-title`}>
          {i18n[i18n.myLang]['modal.header.addFavor']}
        </h2>
        {this.renderContent(select, step, i18n)}
      </div>
    )
  }

  renderContent(select, step, i18n) {
    return this.renderSelectList(select, i18n);
    /*
    switch (step) {
      case 2:
        return this.renderCart()
      case 0:
      case 1:
      default:
        return this.renderSelectList(select, i18n)
    }*/
  }

  renderSelectList(select, i18n) {
    return (
      <form className={`Modal-form`} onSubmit={this.handleSubmit.bind(this)}>
        <List className={`List--modal Modal-list Modal-list-favor`}
              items={this.props.listInFavorites}
              renderItem={this.renderListInFavorites.bind(this)}
              isFetching={false} />
        <div className={`Modal-confirm`}>
          <button type="submit" disabled={!select.id}>
            {i18n[i18n.myLang]['modal.button.confirm']}
          </button>
          <button type="button" onClick={this.props.handleModalClose}>
            {i18n[i18n.myLang]['modal.button.cancel']}
          </button>
        </div>
      </form>
    )
  }

  renderListInFavorites(item, index) {
    const { select } = this.state
    const className = classnames({
      'Favorites Favorites--modal': true,
      'is-selected': select.id === item.id
    })

    return (
      <div key={index} className={className} onClick={this.handleSelect.bind(this, item)}>
        {item.name}
      </div>
    )
  }

  /*
  renderCart() {
    const { i18n } = this.props
    const { songs } = this.state
    return (
      <div>
        <Cart
          className={`Modal-form`} items={songs}
          cancelText={i18n[i18n.myLang]['cart.button.previous']}
          submitText={i18n[i18n.myLang]['cart.button.submit']}
          onItemRemove={::this.handleSongRemove}
          onCancel={::this.handleCartCancel}
          onSubmit={::this.handleCartSubmit} />
      </div>
    )
  }

  handleSongRemove(item, index) {
    const { songs } = this.state
    this.setState({
      songs: removeFromArray(songs, index)
    })
  }

  handleCartCancel(e) {
    this.setState({
      step: 1
    })
  }

  handleCartSubmit(e) {
    const { toggleView, favorActions, toggleNotification } = this.props
    const { songs, select } = this.state
    const data = songs.map( item => ({ songid: item.item.id, flow: item.item.flow }) )

    favorActions.putSongArrayToFavorite(select.id, data).then(result => {
      toggleView('modal', { visible: false });
      toggleNotification();
      favorActions.loadSongsFromFavorite(select.id.toString());
      favorActions.loadListFromFavorite();
    });
  }*/

  handleSelect(item, e) {
    const { select } = this.state
    const { id, name } = item
    if (select.id === id) {
      return ;
    }

    this.setState({
      select: { id, name }
    })
  }


  handleSubmit(e) {
    const { data, toggleView, favorActions, toggleNotification, isNeedTip } = this.props;
    e.preventDefault()
    stopPropagation(e);
    const { select } = this.state

    if (!select.id) {
      return ;
    }

    if ( data.multiMode ) {
      /* Deprecate Cart
      this.setState({
        step: 2
      })*/
      const { songs, select } = this.state;
      const dataList = songs.map( item => ({ songid: item.item.id, flow: item.item.flow }) )

      favorActions.putSongArrayToFavorite(select.id, dataList).then(result => {
        toggleView('modal', { visible: false });
        if ( typeof data.onAddToFavorite === 'function') {
          data.onAddToFavorite();
        }
        if ( isNeedTip ) {
          toggleView('modal', { visible: true, type: 'favoriteTip' });
        }
        toggleNotification('multi');
        favorActions.loadSongsFromFavorite(select.id.toString());
        favorActions.loadListFromFavorite();
      });
    } else {
      favorActions.putSongToFavorite(select.id, data.songId, data.songName, select.name, data.flow).then(result => {
        toggleView('modal', { visible: false });
        if ( isNeedTip ) {
          toggleView('modal', { visible: true, type: 'favoriteTip' });
        }
        toggleNotification('single');
        favorActions.loadSongsFromFavorite(select.id.toString());
        favorActions.loadListFromFavorite();
      });
    }
  }
}

FavoritesCollection.propTypes = {
  data: PropTypes.object.isRequired,
  favorActions: PropTypes.object
}
