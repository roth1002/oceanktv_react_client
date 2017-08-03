import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { ROOT } from '../constants/Config';
import HELP from '../assets/images/help.png';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { stopPropagation } from '../utils/functions';

export default class FavorEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      favorEditInput: '',
      inputTip: false
    }
  }

	render() {
		const { action } = this.props;
    switch (action) {
      case 'post':
        return (
          <div>
            {this.renderAddContent()}
          </div>
        )
      case 'put':
        return (
          <div>
            {this.renderEditContent()}
          </div>
        )
      case 'delete':
      case 'deleteYoutube':
        return (
          <div>
            {this.renderDeleteContent()}
          </div>
        )
      case 'postYoutube':
        return (
          <div>
            {this.renderAddCollectionContent()}
          </div>
        )
      default:
        return null;
    }
	}

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.favorEditInput !== nextState.favorEditInput;
  }

	renderEditContent() {
		const { i18n, data } = this.props
		const tipInputInvalidClass = this.state.inputTip ? 'is-invalid' : '';
    const modalInputTipClass = this.state.inputTip ? 'is-visible' : '';
    const re = /^\s+/;
		return (
      <div className={`Modal-content`}>
        <h2 className={`Modal-title Modal-title--favor-edit`}>
          {i18n[i18n.myLang]['modal.header.rename']}
        </h2>
        <form className={`Modal-form Modal-form--favor-edit`} onSubmit={this.handleFavorEdit.bind(this)}>
          <input ref={ref => this.favorEditInput = ref} className={`Modal-input ${tipInputInvalidClass}`} type="text"
                placeholder={data.favorName}
                onChange={this.handleInputChange.bind(this)} />
          <div className={`Modal-confirm Modal-confirm--favor-edit`}>
            <button type="submit" disabled={this.state.favorEditInput.length <= 0 || re.exec(this.state.favorEditInput) !== null }>
              {i18n[i18n.myLang]['modal.button.confirm']}
            </button>
            <button type="button" onClick={this.handleModalClose.bind(this)}>
              {i18n[i18n.myLang]['modal.button.cancel']}
            </button>
          </div>
        </form>
        <div className={`Modal-input-tip ${modalInputTipClass}`}>
          {i18n[i18n.myLang]['modal.rename.input.tip']}
        </div>
      </div>
    );
	}

	renderAddContent() {
		const { i18n, data } = this.props
		const tipInputInvalidClass = this.state.inputTip ? 'is-invalid' : '';
    const modalInputTipClass = this.state.inputTip ? 'is-visible' : '';
    const re = /^\s+/;
		return (
      <div className={`Modal-content`}>
        <h2 className={`Modal-title Modal-title--favor-edit`}>
          {i18n[i18n.myLang]['sidetab.button.addnewfavor']}
        </h2>
        <form
        	className={`Modal-form Modal-form--favor-edit`}
          onSubmit={this.handleFavorEdit.bind(this)}>
          <input
          	ref={ref => this.favorEditInput = ref}
          	className={`Modal-input ${tipInputInvalidClass}`}
          	type="text"
            onChange={this.handleInputChange.bind(this)} />
          <div className={`Modal-confirm Modal-confirm--favor-edit`}>
            <button type="button" onClick={throttle(this.handleFavorEdit.bind(this), 3000, true)} disabled={this.state.favorEditInput.length <= 0 || re.exec(this.state.favorEditInput) !== null }>
              {i18n[i18n.myLang]['modal.button.confirm']}
            </button>
            <button type="button" onClick={this.handleModalClose.bind(this)}>
              {i18n[i18n.myLang]['modal.button.cancel']}
            </button>
          </div>
        </form>
        <div className={`Modal-input-tip ${modalInputTipClass}`}>
          {i18n[i18n.myLang]['modal.rename.input.tip']}
        </div>
      </div>
    );
	}

  renderAddCollectionContent() {
    const { i18n, data } = this.props
    const tipInputInvalidClass = this.state.inputTip ? 'is-invalid' : '';
    const modalInputTipClass = this.state.inputTip ? 'is-visible' : '';
    const re = /^\s+/;
    return (
      <div className={`Modal-content`}>
        <h2 className={`Modal-title`}>
          {i18n[i18n.myLang]['modal.header.addcollection']}
        </h2>
        <div className={`Modal-body`}>
          <div className={`Modal-description Modal-description--stepUseYoutube`}>
            <span>
              {i18n[i18n.myLang]['modal.content.addcollection']}
            </span>
          </div>
        </div>
        <form
          className={`Modal-form Modal-form--favor-edit`}
          onSubmit={this.handleFavorEdit.bind(this)}>
          <input
            style={{width: '98%'}}
            ref={ref => this.favorEditInput = ref}
            className={`Modal-input ${tipInputInvalidClass}`}
            type="text"
            onChange={this.handleInputChange.bind(this)} />
          <div className={`Modal-confirm Modal-confirm--favor-edit`}>
            <button type="button" onClick={throttle(this.handleFavorEdit.bind(this), 3000, true)} disabled={this.state.favorEditInput.length <= 0 || re.exec(this.state.favorEditInput) !== null }>
              {i18n[i18n.myLang]['modal.button.confirm']}
            </button>
            <button type="button" onClick={this.handleModalClose.bind(this)}>
              {i18n[i18n.myLang]['modal.button.cancel']}
            </button>
          </div>
        </form>
        <div className={`Modal-input-tip ${modalInputTipClass}`}>
          {i18n[i18n.myLang]['modal.rename.input.tip']}
        </div>
      </div>
    );
  }

  renderDeleteContent() {
    const { i18n, data } = this.props
    const tipInputInvalidClass = this.state.inputTip ? 'is-invalid' : '';
    const modalInputTipClass = this.state.inputTip ? 'is-visible' : '';
    const re = /^\s+/;
    return (
      <div className={`Modal-content`}>
        <h2 className={`Modal-title Modal-title--favor-edit`}>
          <img src={HELP} />
          <span>
            {i18n[i18n.myLang]['modal.delete.confirm.tip']}
          </span>
        </h2>
        <form
          className={`Modal-form Modal-form--favor-edit`}
          onSubmit={this.handleFavorEdit.bind(this)}>
          <div
            className={`Modal-delete--context`}
            type="text">
          </div>
          <div className={`Modal-confirm Modal-confirm--favor-edit`}>
            <button type="submit">
              {i18n[i18n.myLang]['modal.button.confirm']}
            </button>
            <button type="button" onClick={this.handleModalClose.bind(this)}>
              {i18n[i18n.myLang]['modal.button.cancel']}
            </button>
          </div>
        </form>
        <div className={`Modal-input-tip ${modalInputTipClass}`}>
          {i18n[i18n.myLang]['modal.rename.input.tip']}
        </div>
      </div>
    );
  }

  handleFavorEdit(evt) {
    const {
      action,
      favorActions,
      history,
      location: { query },
      state: { data },
      toggleView,
      toggleNotification
    } = this.props;
    let input;

    switch (action) {
      case 'put':
        evt.preventDefault();
        stopPropagation(evt);
        input = this.getFavorEditInput();
        if (!input || input.length <= 0) {
          return false
        }
  	    return favorActions.postNameToFavorite(data.favorId, input)
  	    .then(() => favorActions.loadListFromFavorite())
  	    .then(() => {
  	      const favorName = query.favorName === data.favorName ? input : query.favorName;
  	      const favorId = query.favorId === data.favorId ? data.favorId : query.favorId
  	      this.context.router.push(`${ROOT}/app/favorite?favorId=${favorId}&favorName=${favorName}`);
          toggleView('modal', { visible: false });
  	    })
        break;
	    case 'post':
        evt.preventDefault();
        input = this.getFavorEditInput();
        if (!input || input.length <= 0) {
          return false;
        }
  	  	favorActions.postNewFavoriteName(input)
  	  	.then( () => toggleView('modal', { visible: false }));
        break;
  	  case 'delete':
        evt.preventDefault();
        stopPropagation(evt);
        return favorActions.deleteFavoriteName(data.favorId)
        .then( () => favorActions.loadListFromFavorite() )
        .then( () => {
          toggleView('modal', { visible: false })
          this.context.router.push(`${ROOT}/app/favorite`)
        });
        break;
      case 'postYoutube':
        evt.preventDefault();
        input = this.getFavorEditInput();
        if (!input || input.length <= 0) {
          return false;
        }
        favorActions.postNewCollection({ sharelink: input, link_type: 'url' })
        .then( () => {
          toggleView('modal', { visible: false })
          toggleNotification('control');
        });
        break;
      case 'deleteYoutube':
        evt.preventDefault();
        stopPropagation(evt);
        return favorActions.deleteFromCollection({ id: data.pvid })
        .then( () => {
          toggleView('modal', { visible: false })
          this.context.router.push(`${ROOT}/app/youtube?rType=default`)
        });
        break;
      default:
        break;
    }
  }

 	getFavorEditInput() {
    return findDOMNode(this.favorEditInput).value;
  }

  handleInputChange(evt) {
    const re = /^(\s+)\S/;
    let match;
    if ( ( match = re.exec(evt.currentTarget.value)) !== null ) {
      this.favorEditInput.value = '';
    }
    this.setState({
      favorEditInput: evt.currentTarget.value,
      inputTip: match !== null
    });
  }

  handleModalClose(evt, type) {
    const { state, toggleView } = this.props;
    this.setState({
      inputTip: false,
      favorEditInput: ''
    });
    toggleView('modal', { visible: false });
    evt.preventDefault();
  }
}

FavorEdit.contextTypes = {
  router: React.PropTypes.object
}