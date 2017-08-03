import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Cookies from 'js-cookie';

import HELP from '../assets/images/help.png';

export default class Confirm extends Component {
  constructor(props) {
    super(props)

    this._handleModalClose = ::this._handleModalClose
    this._handleShouldModalNeverTip = ::this._handleShouldModalNeverTip
  }

  componentDidMount() {
    const { toggleNotification, type, forceMulti } = this.props;
    const finalType = forceMulti ? 'multi' : type;
  	toggleNotification(finalType);
  }

  render() {
  	const { handlePlayerOnOff, i18n } = this.props;
  	// console.log(`%c i18n = ${i18n.myLang}`,'color: darkcyan; font-weight: bold')
  	return(
  		<div className={`Modal-content--tvplayer-not-open-confirm`}>
  		  <h2 className={`Modal-title Modal-title--tvplayer-not-open-confirm`}>
  		    <img className={`Modal-title-icon`} src={HELP} />
  		    <span>
  		    	{i18n[i18n.myLang]['modal.header.remindYou']}
  		    </span>
  		  </h2>
  		  <div className={`tvplayer-not-open-confirm-content`}>
  		    <div className={`sentences`}>
  		    	{i18n[i18n.myLang]['modal.remindYou.descript01']}
  		    </div>
  		  	<label>
  		  		<input className={`nerver-tip-checkbox`} type="checkbox" ref="nerverTip" />
  		  		{i18n[i18n.myLang]['modal.remindYou.neverTip']}
  		  	</label>
  		  </div>
  		  <form className={`Modal-form`} onSubmit={handlePlayerOnOff}>
  		    <div className={`Modal-confirm`}>
  		      <button onClick={this._handleModalClose}>
  		        {i18n[i18n.myLang]['modal.remindYou.button.iKnew']}
  		      </button>
  		      <button type="submit" onClick={this._handleShouldModalNeverTip}>
  		      	{i18n[i18n.myLang]['modal.remindYou.button.openTvplayer']}
  		      </button>
  		    </div>
  		  </form>
  		</div>
  	);
  }

  _handleModalClose(evt) {
  	this._handleShouldModalNeverTip();
  	this.props.handleModalClose(evt);
  }

  _handleShouldModalNeverTip() {
  	const { nerverTip } = this.refs;
  	const shouldNerverTip = findDOMNode(nerverTip).checked;
  	if (shouldNerverTip) {
	  	Cookies.set('playNeverTip', 0, { expires: 365 }) // 0: 永不提示,  1: 每次提示
	  }
  }
}