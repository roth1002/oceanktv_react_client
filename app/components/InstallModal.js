import React, { Component, PropTypes } from 'react'
import QRCODE_IMG_01 from '../assets/images/qrcode.png'
import AUCIO_BOX_IMG_O1 from '../assets/images/audiobox_01.png';
import AUCIO_BOX_IMG_O2 from '../assets/images/audiobox_02.png';

export default class InstallModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: 'download'
    }
  }

  render() {
    const { i18n, handleModalClose } = this.props
    return (
      <div className={`Modal-content Modal-content--install`}>
        <h2 className={`Modal-title Modal-title--install`}>
          {i18n[i18n.myLang]['landing.button.market']}
        </h2>
        <div className={`Modal-tabs`}>
          <a className={`Modal-tab ${this.state.modal === 'download' ? 'is-active' : ''}`} onClick={ () => this.setState({modal: 'download'})}>
            {i18n[i18n.myLang]['modal.market.tab.download']}
          </a>
          <a className={`Modal-tab ${this.state.modal === 'shopping' ? 'is-active' : ''}`} onClick={ () => this.setState({modal: 'shopping'})}>
            {i18n[i18n.myLang]['modal.market.tab.shopping']}
          </a>
        </div>
        {this.renderBody()}
      </div>
    )
  }

  renderBody() {
    const { modal } = this.state

    switch (modal) {
      case 'download':
        return this.renderDownloadContent()
      case 'shopping':
        return this.renderShoppingContent()
      default:
        return
    }
  }

  renderDownloadContent() {
    const { i18n, handleModalClose } = this.props
    return (
      <div className={`Modal-body Modal-body--install`}>
        <p>
          {i18n[i18n.myLang]['modal.market.download.descript01']}
        </p>
        <p>
          {i18n[i18n.myLang]['modal.market.download.descript02']}
        </p>
        <div className={`QRcodes`}>
          <div>
            <img src={QRCODE_IMG_01} alt="QR Code" />
            <a className={`QRcode-tip`} href="https://www.qnap.com/mobileapp/oceanktv" target="qnap">
              {i18n[i18n.myLang]['modal.market.download.QRcode.tip']}
            </a>
          </div>
        </div>
        <div className={`Modal-confirm Modal-confirm--install`}>
          <button className={``} onClick={handleModalClose}>
            {i18n[i18n.myLang]['modal.button.confirm']}
          </button>
        </div>
      </div>
    )
  }

  renderShoppingContent() {
    const { i18n, handleModalClose } = this.props
    return (
      <div className={`Modal-body Modal-body--install`}>
        <div className={`QRcodes`}>
          <div>
            <img src={AUCIO_BOX_IMG_O1} />
            <div>QNAP Audio Box</div>
            <span>
              {i18n[i18n.myLang]['modal.installapp.audiobox.descript01']}
            </span>
          </div>
          {/*<div>
            <img src={AUCIO_BOX_IMG_O2} />
            <div>QNAP Audio Box</div>
            <span>
              {i18n[i18n.myLang]['modal.installapp.audiobox.descript01']}
            </span>
          </div>*/}
        </div>
        <div className={`Modal-confirm Modal-confirm--install`}>
          <button className={``} onClick={() => window.open('https://www.qnap.com/solution/ocean-ktv')}>
            {i18n[i18n.myLang]['modal.button.productinfo']}
          </button>
          <button className={``} onClick={handleModalClose}>
            {i18n[i18n.myLang]['modal.button.close']}
          </button>
        </div>
      </div>
    )
  }
}
