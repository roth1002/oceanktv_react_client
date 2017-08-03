import React, { Component, PropTypes } from 'react';
import { stopPropagation } from '../utils/functions';
import { Link } from 'react-router';
import { HOSTURL } from '../constants/Config';

import IMG_ConnectToNAS from '../assets/images/audiobox_connection.png';
import IMG_ImportFolders from '../assets/images/img_quicktutorial_p3.png';
import IMG_EditNames from '../assets/images/img_quicktutorial_p5.png';
import IMG_UseYoutube from '../assets/images/img_quicktutorial_youtube.png';

export default class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0
    };
    this.stepsInfo = [
      { description: 'start tutorial',            render: ::this.renderStep_Start },
      { description: 'use youtube',               render: ::this.renderStep_UseYoutube },
      { description: 'microphone connect to NAS', render: ::this.renderStep_ConnectToNAS },
      { description: 'order songs on mobile',     render: ::this.renderStep_OrderSongs },
      { description: 'import source folders',     render: ::this.renderStep_ImportFolders },
      { description: 'edit name of songs',        render: ::this.renderStep_EditNames },
    ];
  }

  render() {
    const { step } = this.state
    return this.stepsInfo[step].render(step)
  }

  renderStep_Start(index) {
    const { i18n } = this.props;
    const chineseCharsets = [ 'zh-cn' ];
    return (
      <div className={`Modal-content Modal-content--tutorial`}>
        <div className={`Modal-body Modal-body--tutorial`}>
          <img
            className={`Modal-img Modal-img--stepStart`}
            src={require(chineseCharsets.indexOf(i18n.myLang) > -1  ? '../assets/images/img_quicktutorial_p1_chs.png' : '../assets/images/img_quicktutorial_p1_en.png')}
            alt={`OceanKTV`} />
          <div className={`Modal-description Modal-description--stepStart`}>
            <span>
              {i18n[i18n.myLang]['modal.tutorial.stepStart.descript01']}
            </span>
            <span>
              {i18n[i18n.myLang]['modal.tutorial.stepStart.descript02']}
            </span>
            <span>
              {i18n[i18n.myLang]['modal.tutorial.stepStart.descript03']}
            </span>
          </div>
          <div className={`Modal-confirm Modal-confirm--tutorial`}>
            <button className={``} onClick={this.handleNext.bind(this)}>
              {i18n[i18n.myLang]['modal.button.startTutorial']}
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderStep_ConnectToNAS(index) {
    const { i18n } = this.props;
    const chineseCharsets = [ 'zh-cn' ];
    return (
      <div className={`Modal-content Modal-content--tutorial`}>
        <h2 className={`Modal-title  Modal-title--tutorial`}>
          {i18n[i18n.myLang]['modal.header.tutorialStepConnectToNAS']}
        </h2>
        <div className={`Modal-body Modal-body--tutorial`}>
          <div className={`Modal-description Modal-description--stepConnect`}>
            <ol>
              <li>
                {i18n[i18n.myLang]['modal.tutorial.stepConnectToNAS.descript01']}
              </li>
              <li>
                {i18n[i18n.myLang]['modal.tutorial.stepConnectToNAS.descript02']}
              </li>
            </ol>
          </div>
          <img className={`Modal-img Modal-img--w100`} src={IMG_ConnectToNAS} alt={`OceanKTV`} />
          <div className={`Modal-confirm`}>
            <button className={``} onClick={this.handlePrevious.bind(this)}>
              {i18n[i18n.myLang]['modal.button.previous']}
            </button>
            <button className={``} onClick={this.handleNext.bind(this)}>
              {i18n[i18n.myLang]['modal.button.next']}
            </button>
          </div>
          <div className={`Modal-progress`}>
            <div style={{width: `calc(100% * ${index} / ${this.stepsInfo.length - 1})`}}/>
          </div>
        </div>
      </div>
    )
  }

  renderStep_OrderSongs(index) {
    const { i18n } = this.props;
    const chineseCharsets = [ 'zh-cn' ];
    return (
      <div className={`Modal-content Modal-content--tutorial`}>
        <h2 className={`Modal-title  Modal-title--tutorial`}>
          {i18n[i18n.myLang]['modal.header.tutorialStepOrderSongs']}
        </h2>
        <div className={`Modal-body Modal-body--tutorial`}>
          <div className={`Modal-description Modal-description--stepOrderSongs`}>
            <span>
              {i18n[i18n.myLang]['modal.tutorial.stepOrderSongs.descript01']}
            </span>
          </div>
          <img className={`Modal-img Modal-img--w100`} src={require(chineseCharsets.indexOf(i18n.myLang) > -1 ? '../assets/images/img_quicktutorial_p2_chs.png' : '../assets/images/img_quicktutorial_p2_en.png')} alt={`OceanKTV`} />
          <div className={`Modal-confirm`}>
            <button className={``} onClick={this.handlePrevious.bind(this)}>
              {i18n[i18n.myLang]['modal.button.previous']}
            </button>
            <button className={``} onClick={this.handleNext.bind(this)}>
              {i18n[i18n.myLang]['modal.button.next']}
            </button>
          </div>
          <div className={`Modal-progress`}>
            <div style={{width: `calc(100% * ${index} / ${this.stepsInfo.length - 1})`}}/>
          </div>
        </div>
      </div>
    )
  }

  renderStep_ImportFolders(index) {
    const { i18n } = this.props;
    return (
      <div className={`Modal-content Modal-content--tutorial`}>
        <h2 className={`Modal-title Modal-title--tutorial`}>
          {i18n[i18n.myLang]['modal.header.tutorialStepImportFolders']}
        </h2>
        <div className={`Modal-body Modal-body--tutorial`}>
          <div className={`Modal-description`}>
            <span>
              {i18n[i18n.myLang]['modal.tutorial.stepImportFolders.descript01']}
            </span>
            <ol>
              <li>
                {i18n[i18n.myLang]['modal.tutorial.stepImportFolders.descript02.part01']}
                {i18n[i18n.myLang]['modal.tutorial.stepImportFolders.descript02.part02']}
              </li>
              <li>
                {i18n[i18n.myLang]['modal.tutorial.stepImportFolders.descript03']}
              </li>
              <div className={`Modal-body--tutorial-notice`}>
                {' ' + i18n[i18n.myLang]['modal.tutorial.stepImportFolders.descript04.part04']}
              </div>
            </ol>
          </div>
          <img className={`Modal-img Modal-img--w100`} src={IMG_ImportFolders} alt={`OceanKTV`} />
          <div className={`Modal-confirm`}>
            <button className={``} onClick={this.handlePrevious.bind(this)}>
              {i18n[i18n.myLang]['modal.button.previous']}
            </button>
            <button className={``} onClick={this.handleNext.bind(this)}>
              {i18n[i18n.myLang]['modal.button.next']}
            </button>
          </div>
          <div className={`Modal-progress`}>
            <div style={{width: `calc(100% * ${index} / ${this.stepsInfo.length - 1})`}}/>
          </div>
        </div>
      </div>
    )
  }

  renderStep_EditNames(index) {
    const { i18n } = this.props;
    return (
      <div className={`Modal-content Modal-content--tutorial`}>
        <h2 className={`Modal-title Modal-title--tutorial`}>
          {i18n[i18n.myLang]['modal.header.tutorialStepEditNames']}
        </h2>
        <div className={`Modal-body Modal-body--tutorial`}>
          <div className={`Modal-description Modal-description--stepEditNames`}>
            <span>
              {i18n[i18n.myLang]['modal.tutorial.stepEditNames.descript01']}
            </span>
          </div>
          <img className={`Modal-img Modal-img--w100`} src={IMG_EditNames} alt={`OceanKTV`} />
          <div className={`Modal-confirm`}>
            <button className={``} onClick={this.handlePrevious.bind(this)}>
              {i18n[i18n.myLang]['modal.button.previous']}
            </button>
            <button className={``} onClick={this.handleNext.bind(this)}>
              {i18n[i18n.myLang]['modal.button.startSing']}
            </button>
          </div>
          <div className={`Modal-progress`}>
            <div style={{width: `calc(100% * ${index} / ${this.stepsInfo.length - 1})`}}/>
          </div>
        </div>
      </div>
    )
  }

  renderStep_UseYoutube(index) {
    const { i18n } = this.props;
    return (
      <div className={`Modal-content Modal-content--tutorial`}>
        <h2 className={`Modal-title Modal-title--tutorial`}>
          {i18n[i18n.myLang]['modal.header.tutorialStepUseYoutube']}
        </h2>
        <div className={`Modal-body Modal-body--tutorial`}>
          <div className={`Modal-description Modal-description--stepUseYoutube`}>
            <span>
              {i18n[i18n.myLang]['modal.tutorial.stepUseYoutube.descript01']}
            </span>
          </div>
          <img className={`Modal-img Modal-img--w100`} src={IMG_UseYoutube} alt={`OceanKTV`} />
          <div className={`Modal-confirm`}>
            <button className={``} onClick={this.handlePrevious.bind(this)}>
              {i18n[i18n.myLang]['modal.button.previous']}
            </button>
            <button className={``} onClick={this.handleNext.bind(this)}>
              {i18n[i18n.myLang]['modal.button.next']}
            </button>
          </div>
          <div className={`Modal-progress`}>
            <div style={{width: `calc(100% * ${index} / ${this.stepsInfo.length - 1})`}}/>
          </div>
        </div>
      </div>
    )
  }

  handlePrevious(e) {
    const { step } = this.state
    if (step <= 0) {
      return ;
    }

    this.setState({
      step: step - 1
    })
  }

  handleNext(e) {
    const { handleModalClose } = this.props
    const { step } = this.state
    if (step >= this.stepsInfo.length - 1 ) {
      return handleModalClose(e);
    }

    this.setState({
      step: step + 1
    })
  }

}
