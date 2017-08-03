import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classnames from 'classnames'
import _ from 'lodash'

import SlidePanel from '../containers/SlidePanel';
import { toggleView } from '../actions/views'
import ModalContent from '../components/ModalContent'
import { ROOT } from '../constants/Config'
import QNAP_LOGO from '../assets/images/qnap_logo.png'
import LOGO from '../assets/images/logo.png'
import INTRO_N from '../assets/images/introduction_normal.png'
import INTRO_H from '../assets/images/introduction_hover.png'
import ENTER_N from '../assets/images/enter_normal.png'
import ENTER_H from '../assets/images/enter_hover.png'
import MARKET_N from '../assets/images/market_normal.png'
import MARKET_H from '../assets/images/market_hover.png'
import HELP_N from '../assets/images/help_normal.png'
import HELP_H from '../assets/images/help_hover.png'

class ImgBtn extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { className, text, to, onClick, target, inApp } = this.props

    const classes = classnames('ImgBtn', className)

    if (typeof onClick === 'function') {
      return (
        <a className={classes} onClick={onClick}>
          <div className={`ImgBtn-img`} />
          <span className={`ImgBtn-text`}>{text}</span>
        </a>
      )
    }

    if (inApp) {
      return (
        <Link className={classes} to={to}>
          <div className={`ImgBtn-img`} />
          <span className={`ImgBtn-text`}>{text}</span>
        </Link>
      )
    }

    return (
      <a className={classes} href={to} target={ target ? target : '_self' }>
        <div className={`ImgBtn-img`} />
        <span className={`ImgBtn-text`}>{text}</span>
      </a>
    )
  }
}

ImgBtn.propTypes = {
  text: PropTypes.string,
  img: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func
}

class Landing extends Component {
  constructor(props) {
    super(props)

    this.handleIntroClick = ::this.handleIntroClick
    this.handleMarketClick = ::this.handleMarketClick
  }

  render() {
    const { modalState, i18n, toggleView, slidePanelState } = this.props
    const bgImgs = ['bg-1', 'bg-2'];
    const slidePanelClassName = classnames({
      'SlidePanel': true,
      'is-visible': slidePanelState.visible,
      'is-footer-hidden': true,
      'is-header-hidden': true
    });

    return (
      <div className={`Landing ${bgImgs[Math.floor(Math.random() * 2)]}`}>
        <header className={`Landing-header`}>
          <div className={``}>
            <a href={`https://www.qnap.com`} target="qnap">
              <img src={QNAP_LOGO} alt="QNAP" />
            </a>
          </div>
          <div className={``}></div>
        </header>
        <div className={`Landing-page`}>
          <section className={`Landing-main`}>
            <img className={`Landing-logo`} src={LOGO} alt="OceanKTV" />
            <p className={`Landing-intro`}>
              {i18n[i18n.myLang]['landing.main.intro']}
            </p>
          </section>
          <div className={`Landing-btns`}>
            <ImgBtn className={`ImgBtn--intro`} text={i18n[i18n.myLang]['more.button.tutorial']} onClick={this.handleIntroClick} />
            <ImgBtn className={`ImgBtn--enter`} text={i18n[i18n.myLang]['landing.button.enter']} to={`${ROOT}/app`} inApp={true} />
            <ImgBtn className={`ImgBtn--market`} text={i18n[i18n.myLang]['landing.button.market']} to={`${ROOT}/`} onClick={this.handleMarketClick} />
            <ImgBtn className={`ImgBtn--help`} text={i18n[i18n.myLang]['landing.button.help']} to={`https://www.qnap.com/solution/ocean-ktv`} target="qnap" />
          </div>
        </div>
        <ModalContent state={modalState} toggleView={toggleView} i18n={i18n}  />
        <SlidePanel
          className={slidePanelClassName}
          toggleView={toggleView} />
      </div>
    )
  }

  handleIntroClick(e) {
    const { toggleView } = this.props
    toggleView('modal', { visible: true, type: 'tutorial'})
  }

  handleMarketClick(e) {
    const { toggleView } = this.props
    toggleView('modal', { visible: true, type: 'appInstall'})
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleView: bindActionCreators(toggleView, dispatch),
  }
}

function mapStateToProps(state) {
  const { views, i18n } = state;

  const modalState = views['modal'];
  const slidePanelState = views['slidePanel'];

  return {
    modalState,
    i18n,
    slidePanelState
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
