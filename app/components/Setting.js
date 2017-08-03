import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';
import Select from 'react-select';

import List from './List';
import Modal from './Modal';
import Tree from './UiTree';

import { stopPropagation } from '../utils/functions'
import { setTimeoutPromise } from '../utils/functions';
import { AUDIO_OUT_PUT_TYPE } from '../constants/Config';
import BG_THUMB_01 from '../assets/images/bg_01_thumbnail.png';
import BG_THUMB_02 from '../assets/images/bg_02_thumbnail.png';
import BG_THUMB_03 from '../assets/images/bg_03_thumbnail.png';
import BG_THUMB_04 from '../assets/images/bg_04_thumbnail.png';
import BG_THUMB_05 from '../assets/images/bg_05_thumbnail.png';
import HELP from '../assets/images/help.png';
import WARN from '../assets/images/warning.png';

export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioOutSelect: '',
      audioInSelect: '',
      themeSelect: '',
      modal: {
        location: 'audio',
        step: {
          type: 'get',
          value: 0
        }
      },
      sharedFolder: [],
      folderSource: [],
      selected: [], // Folder source multi selected for use.
      active: null,
      processing: true,
      audioOutData: [],
      audioInData: []
    }
  }

  componentDidMount() {
    const { systemActions } = this.props;
    systemActions.loadMyAudioOutput()
    .then( () => this.setState({ processing: false }));
  }

  loadShareFolderInfo() {
    const { systemActions } = this.props;
    systemActions.fetchShareFolderDynamic().then( result => {
      let finalResult = [];
      let i;
      for ( i in result.response.shareFolder ) {
        finalResult.push({
          module: result.response.shareFolder[i],
          sharepath: result.response.shareFolder[i],
          collapsed: true,
          children: []
        })
      }

      if ( finalResult.length > 0 ) {
        this.setState({
          folderSource: {
            module: 'Nas',
            collapsed: false,
            children: [
              {
                module: 'MyDisk',
                collapsed: false,
                children: finalResult
              }
            ]
          },
          processing: false
        });
      } else {
        this.setState({
          folderSource: {
            module: 'Nas',
            collapsed: false,
            children: [
              {
                module: 'MyDisk',
                collapsed: false
              }
            ]
          },
          processing: false
        });
      }
    });
  }

  loadSharedFolderInfo() {
    const { systemActions } = this.props;
    systemActions.fetchSharedFolder().then( result => {
      let finalResult = [];
      let i;
      for ( i in result.response ) {
        finalResult.push(result.response[i])
      }
      this.setState({
        sharedFolder: finalResult,
        processing: false
      });
    });
  }

  render() {
    const { playerState, systemConfig, i18n } = this.props;
    const { modal, audioInSelect, audioOutSelect, themeSelect, processing } = this.state;
    const isInAddFolder = modal.location === 'folder' && modal.step.type === 'add';
    const isInDeleteConfirm = modal.location === 'folder' && modal.step.type === 'delete' && modal.step.value === 1;
    const isTreeModalOpen = isInAddFolder;
    const isDeleteModalOpen = isInDeleteConfirm;
    const showExitOrCancel = modal.location === 'folder' ? 'modal.button.exit' : 'modal.button.cancel';
    const isSubmitDisable = audioInSelect === '' && audioOutSelect === '' && themeSelect === '' || processing;
    return (
      <div className={`Modal-content--setting`}>
        <h2 className={`Modal-title Modal-title--install`}>
          {i18n[i18n.myLang]['modal.header.setting']}
        </h2>
        <div className={`Modal-tabs`}>
          <a
            className={`Modal-tab ${modal.location === 'audio' ? 'is-active' : ''}`}
            onClick={ () => this.refreshAudioComponent() }>
            {i18n[i18n.myLang]['modal.setting.audio.title']}
          </a>
          <a
            className={`Modal-tab ${modal.location === 'mic' ? 'is-active' : ''}`}
            onClick={ () => this.refreshMicComponent() }>
            {i18n[i18n.myLang]['modal.setting.mic.title']}
          </a>
          <a
            className={`Modal-tab ${modal.location === 'theme' ? 'is-active' : ''}`}
            onClick={ () => this.refreshThemeComponent() }>
            {i18n[i18n.myLang]['modal.setting.theme.title']}
          </a>
          <a
            className={`Modal-tab ${modal.location === 'folder' ? 'is-active' : ''}`}
            onClick={ () => this.refreshFolderComponent() }>
            {i18n[i18n.myLang]['modal.setting.folder.title']}
          </a>
        </div>
        <form className={`Modal-form`} onSubmit={this.handleSubmit.bind(this)}>
          {this.renderBody()}
          <div className={`Modal-confirm`}>
            {
              modal.location === 'folder' ? null :
              <button type="submit" disabled={isSubmitDisable}>
                {i18n[i18n.myLang]['modal.button.confirm']}
              </button>
            }
            <button onClick={this.handleCancel.bind(this)}>
              {i18n[i18n.myLang][showExitOrCancel]}
            </button>
          </div>
        </form>
        <Modal isOpen={isTreeModalOpen} handle='.tree-modal'>
          <button className={`Modal-close ic delete`} onClick={(evt) => this.handleCloseTreeModel(evt)}></button>
          {this.renderTreeViewModalContent()}
        </Modal>
        <Modal isOpen={isDeleteModalOpen} handle='.delete-modal'>
          <button className={`Modal-close ic delete`} onClick={(evt) => this.handleCloseTreeModel(evt)}></button>
          {this.renderConfirmDeleteModalContent()}
        </Modal>
      </div>
    )
  }

  renderTreeViewModalContent() {
    const { processing } = this.state;
    const { i18n } = this.props;
    const spinnerClassName = classnames('Spnnier loader', {
      'Spinner-hidden': !processing
    });
    return (
      <div className={`Modal-content--setting--addfolder`}>
        <div className={`Modal-title Modal-title--about tree-modal`}>
          {i18n[i18n.myLang]['modal.header.addfolder']}
        </div>
        <div className={`Modal-content--treeview`}>
          {
            processing ? (
            <div className={`Modal-audio`}>
              <div>
                <div className={spinnerClassName} />
              </div>
            </div>
            ) : (
            <Tree
              treeData={this.state.folderSource}
              handleSelected={this.onClickNode.bind(this)}
              systemActions={this.props.systemActions}
              onChange={this.handleChange.bind(this)} >
            </Tree>
            )
          }
        </div>
        <form className={`Modal-form`} onSubmit={this.handleSubmitFolder.bind(this)}>
          <div className={`Modal-confirm`}>
            <button type="submit">
              {i18n[i18n.myLang]['modal.button.confirm']}
            </button>
            <button onClick={(evt) => this.handleCloseTreeModel(evt)}>
              {i18n[i18n.myLang]['modal.button.cancel']}
            </button>
          </div>
        </form>
      </div>
    );
  }

  renderConfirmDeleteModalContent() {
    const { i18n } = this.props;
    return (
      <div className={`Modal-content--setting--addfolder`}>
        <div className={`Modal-title Modal-title--favor-edit delete-modal`}>
          <img src={HELP} />
          <span>
            {i18n[i18n.myLang]['modal.delete.confirm.tip']}
          </span>
        </div>
        <form className={`Modal-form`} onSubmit={this.handleSubmitFolder.bind(this)}>
          <div className={`Modal-confirm`}>
            <button type="submit">
              {i18n[i18n.myLang]['modal.button.confirm']}
            </button>
            <button onClick={(evt) => this.handleCloseTreeModel(evt)}>
              {i18n[i18n.myLang]['modal.button.cancel']}
            </button>
          </div>
        </form>
      </div>
    );
  }

  handleChange(tree) {
    this.setState({
      folderSource: tree
    });
  }

  onClickNode(node) {
    this.setState({
      active: node
    });
  }

  renderBody() {
    const { modal } = this.state;

    switch (modal.location) {
      case 'audio':
        return this.renderAudioComponent();
      case 'mic':
        return this.renderMicrophoneComponent();
      case 'theme':
        return this.renderThemeComponent();
      case 'folder':
        return this.renderFolderComponent(modal.step);
      default:
        return
    }
  }

  renderAudioComponent() {
    const { processing } = this.state;
    const { i18n, systemConfig } = this.props;
    const spinnerClassName = classnames('Spnnier loader', {
      'Spinner-hidden': !processing
    });
    return processing ? (
      <div className={`Modal-audio`}>
        <div>
          <div className={spinnerClassName} />
        </div>
      </div>
      ) : (
      <div className={`Modal-audio`}>
        <h5>
          {i18n[i18n.myLang]['modal.setting.header.audio']}
        </h5>
        {systemConfig.audioOutput.map(this.renderAudioItem.bind(this))}
        <div
          className={`Modal-audio-refresh ic ic_topbar_refresh`}
          onClick={this.refreshAudioComponent.bind(this)} />
      </div>
    )
  }

  renderMicrophoneComponent() {
    const { i18n } = this.props;
    const { audioInSelect, audioInData, processing } = this.state;
    const { systemConfig } = this.props;
    const spinnerClassName = classnames('Spnnier loader', {
      'Spinner-hidden': !processing
    });
    const selectedData = systemConfig.audioInput.filter( item => item.select === true )
    const selectedValue = selectedData.length === 1 ? selectedData[0].value : '';
    return processing ? (
      <div className={`Modal-audio`}>
        <div>
          <div className={spinnerClassName} />
        </div>
      </div>
      ) : ( systemConfig.audioInput.length > 0 ?
        (
          <div className={`Modal-mic`}>
            <div className={`Modal-mic--column`}>
              <div className={`Modal-mic--item`}>{`${i18n[i18n.myLang]['modal.setting.mic.select.prefix']}：`}</div>
              <Select className={`Modal-mic--select`} name="audioInOption" value={audioInSelect ? audioInSelect : selectedValue} options={systemConfig.audioInput} onChange={this.handleSelect.bind(this)} searchable={false} clearable={false} />
            </div>
            <div className={`Modal-folder--header-tip Modal-mic--item`}>
              {i18n[i18n.myLang]['modal.setting.mic.tip']}
            </div>
          </div>
        ) :
        (
          <div className={`Modal-mic`}>
            <div className={`Modal-mic--column`}>
              <img className={`Modal-mic--warn-img`} src={WARN} />
              <div className={`Modal-mic--item Modal-mic--item--warn`}>
                {i18n[i18n.myLang]['modal.setting.mic.warn']}
              </div>
            </div>
          </div>
        )
      )
  }

  renderThemeComponent() {
    const { themeSelect, processing } = this.state;
    const { i18n, systemConfig: { theme } } = this.props;
    const spinnerClassName = classnames('Spnnier loader', {
      'Spinner-hidden': !processing
    });
    return processing ? (
      <div className={`Modal-audio`}>
        <div>
          <div className={spinnerClassName} />
        </div>
      </div>
      ) : (
      <div className={`Modal-themes`}>
        <h5>
          {i18n[i18n.myLang]['modal.setting.theme.title']}
        </h5>
        <label className={`u-theme-thumb`} htmlFor="themeA">
          <input name="theme" id="themeA" ref="themeA" type="radio" value="A" onChange={this.handleThemeRadio.bind(this)}
                checked={themeSelect === 'A' || ( !themeSelect && theme === 'A' )} />
          <img src={BG_THUMB_01} alt={`Theme`} onClick={this.handleImgClickForIE11.bind(this,'themeA')}/>
          <span className={`Modal-themes-context`}>
            {i18n[i18n.myLang]['modal.setting.themeA']}
          </span>
        </label>
        <label className={`u-theme-thumb`} htmlFor="themeB">
          <input name="theme" id="themeB" ref="themeB" type="radio" value="B" onChange={this.handleThemeRadio.bind(this)}
                checked={themeSelect === 'B' || ( !themeSelect && theme === 'B' )} />
          <img src={BG_THUMB_02} alt={`Theme`} onClick={this.handleImgClickForIE11.bind(this,'themeB')}/>
          <span className={`Modal-themes-context`}>
            {i18n[i18n.myLang]['modal.setting.themeB']}
          </span>
        </label>
        <label className={`u-theme-thumb`} htmlFor="themeC">
          <input name="theme" id="themeC" ref="themeC" type="radio" value="C" onChange={this.handleThemeRadio.bind(this)}
                checked={themeSelect === 'C' || ( !themeSelect && theme === 'C' )} />
          <img src={BG_THUMB_03} alt={`Theme`} onClick={this.handleImgClickForIE11.bind(this,'themeC')}/>
          <span className={`Modal-themes-context`}>
            {i18n[i18n.myLang]['modal.setting.themeC']}
          </span>
        </label>
        <label className={`u-theme-thumb`} htmlFor="themeD">
          <input name="theme" id="themeD" ref="themeD" type="radio" value="D" onChange={this.handleThemeRadio.bind(this)}
                checked={themeSelect === 'D' || ( !themeSelect && theme === 'D' )} />
          <img src={BG_THUMB_04} alt={`Theme`} onClick={this.handleImgClickForIE11.bind(this,'themeD')}/>
          <span className={`Modal-themes-context`}>
            {i18n[i18n.myLang]['modal.setting.themeD']}
          </span>
        </label>
        <label className={`u-theme-thumb`} htmlFor="themeE">
          <input name="theme" id="themeE" ref="themeE" type="radio" value="E" onChange={this.handleThemeRadio.bind(this)}
                checked={themeSelect === 'E' || ( !themeSelect && theme === 'E' )} />
          <img src={BG_THUMB_05} alt={`Theme`} onClick={this.handleImgClickForIE11.bind(this,'themeE')}/>
          <span className={`Modal-themes-context`}>
            {i18n[i18n.myLang]['modal.setting.themeE']}
          </span>
        </label>
      </div>
    )
  }

  renderFolderComponent(step) {
    const { i18n } = this.props;
    const { sharedFolder, processing } = this.state;
    const spinnerClassName = classnames('Spnnier loader', {
      'Spinner-hidden': !processing
    });
    switch(step.type) {
      case 'get':
      case 'add':
      case 'delete':
        return processing ? (
          <div className={`Modal-audio`}>
            <div>
              <div className={spinnerClassName} />
            </div>
          </div>
          ) : (
          <div className={`Modal-themes`}>
            <h5>
              {i18n[i18n.myLang]['modal.setting.header.folder']}
            </h5>
            <h5 className={`Modal-folder--header-tip`}>
              {i18n[i18n.myLang]['modal.setting.header.folder.tip']}
            </h5>
            <div className={`Modal-list-filter`}>
              <button
                className={`Modal-folder--header-btn`}
                onClick={this.handleOpenTreeModal.bind(this)}>
                {i18n[i18n.myLang]['modal.button.add']}
              </button>
              <button
                className={`Modal-folder--header-btn`}
                disabled={this.state.selected.length === 0}
                onClick={this.handleOpenDeleteConfirmModal.bind(this)}>
                {i18n[i18n.myLang]['modal.button.delete']}
              </button>
            </div>
            <div className={`Folder-head`} >
              <input
                id={`folderListHeader`}
                className={`Modal-input-header is-hidden`}
                type="checkbox"
                checked={sharedFolder.filter( item => item !== 'OceanKTV' && item !== 'OceanKTV/').length === this.state.selected.length}
                onChange={(evt) => this.handleSelectAll(evt)} />
              <span>{i18n[i18n.myLang]['modal.list.header.path']}</span>
            </div>
            <List
              className={`List--modal List--modal--folder Modal-list`}
              items={sharedFolder}
              renderItem={this.renderSharedFolderList.bind(this)}
              isFetching={false} />
          </div>
        );
      default:
        return;
    }
  }

  renderSharedFolderList(item, index) {
    const { selected } = this.state;
    const className = classnames({
      'Favorites Favorites--modal': true,
      'is-selected': selected.indexOf(item) !== -1
    });
    const itemClass = classnames('Modal-input-item', {
      'is-hidden': item === 'OceanKTV' || item === 'OceanKTV/'
    })

    const isItemChecked = selected.indexOf(item) !== -1;
    return (
      <label htmlFor={`folderListItem${index}`} key={index} className={className}>
        <input
          id={`folderListItem${index}`}
          className={itemClass}
          type="checkbox"
          checked={isItemChecked}
          onChange={(evt) => this.handleSelectItem(evt, item) } />
        <span>{item}</span>
      </label>
    );
  }

  renderAudioItem(item, index) {
    const { audioOutSelect } = this.state;
    const { i18n } = this.props;
    const iconClassName = AUDIO_OUT_PUT_TYPE[item.type];
    const displayName = item.isConnected ? item.display : i18n[i18n.myLang]['modal.setting.audio.unconnected'];
    const displayClassName = classnames('Modal-audio-item', {
      'is-not-connected': !item.isConnected
    })
    return (
      <label key={index} htmlFor={item.type}>
        <input
          name={item.hwValue}
          id={item.hwValue}
          type="radio"
          value={item.hwValue}
          onChange={this.handleAudioRadio.bind(this)}
          disabled={!item.isConnected}
          checked={item.hwValue === audioOutSelect || ( audioOutSelect === '' && item.select === true )} />
        <span className={`ic ${iconClassName}`} />
        <span className={displayClassName}>{displayName}</span>
      </label>
    );
  }

  handleAudioRadio(evt) {
    this.setState({
      audioOutSelect: evt.currentTarget.value
    });
  }

  handleThemeRadio(evt) {
    const { toggleView } = this.props;

    toggleView('theme', { preview: evt.currentTarget.value })
    this.setState({
      themeSelect: evt.currentTarget.value
    })
  }

  handleCancel(evt) {
    const { handleModalClose, toggleView } = this.props;
    handleModalClose(evt);
  }

  handleSubmit(evt) {
    const { systemActions, systemConfig, toggleView, fetchMenuInfo } = this.props;
    const { audioOutSelect, audioInSelect, themeSelect, modal, active } = this.state;
    evt.preventDefault()
    switch(modal.location) {
      case 'audio':
        this.setState({processing: true});
        return systemActions.setMyAudioOutput(audioOutSelect)
        .then(() => {
          this.setState({processing: false});
          toggleView('modal', { visible: false })
          setTimeoutPromise(() => toggleView('app', { disabled: false }), 5000)
        });
      case 'theme':
        return systemActions.setMyTheme(themeSelect)
          .then(() => toggleView('modal', { visible: false }));
      case 'mic':
        this.setState({processing: true});
        return systemActions.setMyAudioInput(audioInSelect)
        .then(() => {
          this.setState({processing: false});
          toggleView('modal', { visible: false })
          setTimeoutPromise(() => toggleView('app', { disabled: false }), 5000)
        });
      default:
        return;
    }
  }

  handleSubmitFolder(evt) {
    const { modal, active } = this.state;
    const { systemActions, fetchMenuInfo } = this.props;
    evt.preventDefault();
    if ( modal.step.type === 'add' && active ) {
      return systemActions.postSharedFolder(active.sharepath + '/')
      .then(() => {
        fetchMenuInfo();
        this.loadSharedFolderInfo();
        this.setState({
          modal: {
            location: 'folder',
            step: {
              type: 'get',
              value: 0
            }
          }
        });
      });
    } else if ( modal.step.type === 'delete' && this.state.selected.length > 0 ) {
      return systemActions.deleteSharedFolder(this.state.selected[0])
      .then(() => {
        fetchMenuInfo();
        this.loadSharedFolderInfo();
        this.setState({
          selected: [],
          modal: {
            location: 'folder',
            step: {
              type: 'get',
              value: 0
            }
          }
        });
      });
    }
  }

  handleSelectItem(evt, item) {
    const { selected } = this.state;
    if ( item === 'OceanKTV/' ) {
      return
    }
    if ( evt.target.checked ) {
      this.setState({ selected: [item], 'modal': {location: 'folder', step: {type: 'delete', value: 0} } });
    } else {
      this.setState({ selected: selected.filter( it => it !== item ), 'modal': {location: 'folder', step: {type: 'get', value: 0} } });
    }
  }

  handleSelectAll(evt) {
    const { selected, sharedFolder } = this.state;
    if ( evt.target.checked ) {
      this.setState({ selected: sharedFolder.filter( item => item !== 'OceanKTV' && item !== 'OceanKTV/') })
    } else {
      this.setState({ selected: [] });
    }
  }

  handleOpenTreeModal(evt) {
    stopPropagation(evt);
    this.setState({
      'modal': {
        location: 'folder',
        step: {
          type: 'add',
          value: 0
        }
      },
      processing: true
    });
    this.loadShareFolderInfo();
  }

  handleCloseTreeModel(evt) {
    stopPropagation(evt)
    evt.preventDefault();
    this.setState({
      'modal': {
        location: 'folder',
        step: {
          type: 'get',
          value: 0
        }
      }
    });
  }

  handleOpenDeleteConfirmModal(evt) {
    stopPropagation(evt)
    this.setState({
      'modal': {
        location: 'folder',
        step: {
          type: 'delete',
          value: 1
        }
      }
    })
  }

  handleCloseDeleteComfirmModel(evt) {
    stopPropagation(evt)
    evt.preventDefault();
    this.setState({
      'modal': {
        location: 'folder',
        step: {
          type: 'delete',
          value: 0
        }
      }
    });
  }

  handleImgClickForIE11(refName) {
    findDOMNode(this.refs[refName]).click();
  }

  handleSelect(newVal) {
    this.setState({
      audioInSelect: newVal.value
    });
  }

  refreshAudioComponent() {
    const { systemActions } = this.props;
    this.setState({
      processing: true,
      modal: {
        location: 'audio',
        step: {
          type: 'get',
          value: 0
        }
      },
      selected: [],
      audioOutSelect: '',
      audioInSelect: '',
      themeSelect: ''
    });
    systemActions.loadMyAudioOutput()
    .then( () => {
      this.setState({ processing: false });
    });
  }

  refreshMicComponent() {
    const { systemActions } = this.props;
    this.setState({
      processing: true,
      modal: {
        location: 'mic',
        step: {
          type: 'get',
          value: 0
        }
      },
      selected: [],
      audioOutSelect: '',
      audioInSelect: '',
      themeSelect: ''
    });
    systemActions.loadMyAudioInput()
    .then( () => {
      this.setState({ processing: false });
    });
  }

  refreshThemeComponent() {
    const { systemActions, systemConfig: { theme }, toggleView } = this.props;
    this.setState({
      processing: true,
      modal: {
        location: 'theme',
        step: {
          type: 'get',
          value: 0
        }
      },
      selected: [],
      audioOutSelect: '',
      audioInSelect: '',
      themeSelect: ''
    });
    systemActions.loadMyTheme()
    .then( () => {
      this.setState({ processing: false });
      toggleView('theme', { preview: theme });
    });
  }

  refreshFolderComponent() {
    this.setState({
      processing: true,
      modal: {
        location: 'folder',
        step: {
          type: 'get',
          value: 0
        }
      },
      selected: [],
      audioOutSelect: '',
      audioInSelect: '',
      themeSelect: ''
    });
    this.loadSharedFolderInfo()
    setTimeoutPromise( () => this.setState({ processing: false }), 200);
  }
}

Setting.propTypes = {
  playerState: PropTypes.object
};
