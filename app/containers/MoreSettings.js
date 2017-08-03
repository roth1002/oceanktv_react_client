import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { loadPlayState } from '../actions/player';
import { selectLanguage } from '../actions/i18n';
import { stopPropagation } from '../utils/functions'

class MoreSettingPanel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { className,moreSettingPanelState, i18n } = this.props;
    const langData=[
      {
        id: 0,
        text: i18n[i18n.myLang]['more.button.language.auto'],
        checked: !i18n.myLang,
        name: (navigator.language || navigator.userLanguage).toLowerCase()
      },
      {
        id: 1,
        text: i18n[i18n.myLang]['more.button.language.english'],
        checked: i18n.myLang && i18n.myLang.includes('en'),
        name: 'en'
      },
      {
        id: 2,
        text: i18n[i18n.myLang]['more.button.language.cn'],
        checked: i18n.myLang && i18n.myLang === 'zh-cn',
        name: 'zh-cn'
      },
      {
        id: 3,
        text: i18n[i18n.myLang]['more.button.language.zhtw'],
        checked: i18n.myLang && i18n.myLang === 'zh-tw',
        name: 'zh-tw'
      }
    ];
    return (
      <div className={className}>
        {this.renderContent(moreSettingPanelState)}
        {this.renderLangPanel(langData)}
      </div>);
  }
  renderContent(moreSettingPanelState){
    const { i18n } = this.props;
    const moreList = [
      {
        id: 0,
        selected: 'appInstall',
        children: i18n[i18n.myLang]['more.button.install'],
        disable: false,
        className: 'MoreSettingContent-btn',
        useIcon: false,
        haveUnderLine: false
      },
      {
        id: 1,
        selected: 'lang',
        children: i18n[i18n.myLang]['more.button.language'],
        disable: false,
        className: 'MoreSettingContent-btn',
        useIcon:true,
        haveUnderLine: false
      },
      {
        id: 2,
        selected: 'setting',
        children: i18n[i18n.myLang]['more.button.setting'],
        disable: false,
        className: 'MoreSettingContent-btn',
        useIcon:false,
        haveUnderLine: true
      },
      { id: 3,
        selected: 'tutorial',
        children: i18n[i18n.myLang]['more.button.tutorial'],
        disable: false,
        className: 'MoreSettingContent-btn',
        useIcon:false,
        haveUnderLine: false
      },
      {
        id: 4,
        selected: 'help',
        children: i18n[i18n.myLang]['more.button.help'],
        disable: false,
        className: 'MoreSettingContent-btn',
        useIcon:false,
        haveUnderLine: true
      },
      {
        id: 5,
        selected: 'about',
        children: i18n[i18n.myLang]['more.button.about'],
        disable: false,
        className: 'MoreSettingContent-btn',
        useIcon:false,
        haveUnderLine: false
      },
      {
        id: 6,
        selected: 'terms',
        children: i18n[i18n.myLang]['more.button.terms'],
        disable: false,
        className: 'MoreSettingContent-btn',
        useIcon:false,
        haveUnderLine: false
      }
    ];
    if (moreSettingPanelState.view === 'more') {
      return (
        <ul className={`MoreSettingContent`}>
          {this.renderMoreSettings(moreList)}
        </ul>
      );
    }
    return;
  }
  handleToggle(select, evt){
    const { menuLang } = this.refs;
    const { toggleView, toggleHeader, headerState, loadPlayState, mouseActions, langSettingPanelState } = this.props;
    mouseActions.removeMove();
    switch(select){
      case 'lang':
        toggleView('langSettingPanel', { visible: !langSettingPanelState.visible });
        break;
      case 'setting':
        toggleView('modal', { visible: true, type: 'setting' });
        toggleHeader({pressed:'audio'});
        break;
      case 'tutorial':
        toggleView('modal', { visible: true, type: 'tutorial' });
        toggleHeader({pressed:headerState.pressed});
        break;
      case 'help':
        toggleView('slidePanel', { visible: true, view: 'help' });
        toggleView('langSettingPanel', { visible: false });
        toggleHeader({pressed:'help'});
        break;
      case 'about':
        toggleView('modal', { visible: true, type: 'about' });
        toggleHeader({pressed:headerState.pressed});
        break;
      case 'appInstall':
        window.open('https://www.qnap.com/mobileapp/oceanktv', '_blank');
        toggleHeader({pressed:headerState.pressed});
        break;
      case 'terms':
        toggleView('modal', { visible: true, type: 'termOfServive' });
        toggleHeader({pressed:headerState.pressed});
      default:
        break;
    }

    if ( select !== 'lang' ) {
      toggleView('moreSettingPanel', { visible: false });
    }
    stopPropagation(evt)
  }
  renderMoreSettings(moreList) {
    return moreList.map((data) => (
      <div
        key={data.id}
        className={data.disable?'disable':data.className}
        onClick={this.handleToggle.bind(this,data.selected)}>
        {
          data.children
        }
        {
          data.useIcon ? <span className={`ic btn_page_next MoreSettingContent-next-icon`}></span> : null
        }
        {
          data.haveUnderLine ?
          <div className="MoreSettingContent-btn MoreSettingContent-split-line" /> : ''
        }
      </div>
    ));
  }
  renderLangPanel(langData){
    const { langSettingPanelState } = this.props;
    const menuLangClassName = classnames('menuLang',{
      'is-visible': langSettingPanelState.visible
    });
    return (
      <div className={menuLangClassName}>
        <div className={`MoreSettingContent`}>
          {
            langData.map( (data) => (
                <div key={data.id} className={`MoreSettingContent-btn MoreSettingContent-btn--lang`} onClick={ (event) => this._handleLanguageChange(event, data.name) } >
                  {
                    data.checked ? <span className={`ic ic_topbar_selected MoreSettingContent-checked-icon`} /> : null
                  }
                  {
                    data.text
                  }
                </div>
              )
            )
          }
        </div>
      </div>);
  }

  _handleLanguageChange(evt, lang) {
    const { selectLanguage } = this.props;
    selectLanguage(lang);
    if ( global.localStorage ) {
      localStorage.setItem('myLang', lang)
    }
    stopPropagation(evt)
  }
}

function mapStateToProps(state) {
  const { views, i18n, system: { audioOutput } } = state;
  const moreSettingPanelState = views['moreSettingPanel'];
  const langSettingPanelState = views['langSettingPanel'];
  return {
    moreSettingPanelState,
    langSettingPanelState,
    audioOutput,
    i18n
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadPlayState: bindActionCreators(loadPlayState, dispatch),
    selectLanguage: bindActionCreators(selectLanguage, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MoreSettingPanel);
