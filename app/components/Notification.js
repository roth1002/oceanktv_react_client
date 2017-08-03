import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

class Notification extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, className, notifications, i18n, notificationState } = this.props;
    const ClassName = classnames(`Notification is-hidden`, {
      'is-visible': notificationState.visible
    });
    const i18nMessage = i18n[i18n.myLang][notifications.message] + (notifications.songName ? ' : ' + notifications.songName : '') + (notifications.favorName ? ' : ' + notifications.favorName : '') + (notifications.hotplugdevice ? ' ' + notifications.hotplugdevice + ' ' + i18n[i18n.myLang]['notify.hotplug.action.content'] : '' );
    const isControlBar = notificationState && notificationState.view === 'control';
    const isSingleAction = notificationState && notificationState.view ===  'single';
    const isAllAction = notificationState && notificationState.view === 'multi';
    const controlClassName = classnames(`Notification-btn ic ic_message_control`,{
      'is-visible': notificationState.visible
    });
    const singleClassName = classnames(`Notification-btn ic ic_message_songaction`,{
      'is-visible': notificationState.visible
    });
    const multiClassName = classnames(`Notification-btn`,{
      'is-visible': notificationState.visible
    });

    return (
      <div className={ClassName}>
        {this._renderBtn(isControlBar, { className: controlClassName, children: `${i18nMessage}` })}
        {this._renderBtn(isSingleAction, { className: singleClassName, children: `${i18nMessage}` })}
        {this._renderBtn(isAllAction, { className: multiClassName, children: `${i18nMessage}` })}
      </div>
    );
  }

  _renderBtn(display, props) {
    if (!display) {
      return ;
    }

    return (
      <div {...props}></div>
    );
  }
}

Notification.propTypes = {
  isControlBar: PropTypes.bool,
  isSingleAction: PropTypes.bool,
  isAllAction: PropTypes.bool
};

export default Notification;
