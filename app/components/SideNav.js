import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ROOT } from '../constants/Config';

export default class SideNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { i18n, sidenav } = this.props;
    const isShowCurrentTotal = sidenav !== undefined && sidenav.current !== 0 && sidenav.current !== undefined;
    return (
        <aside className={`SideNav`}>
          <div className={`SideNav-up`}>
            <Link className={`SideNav-link`} to={`${ROOT}/app/favorite`} activeClassName={`is-current`}>
              <span className={`ic ic_menu_favorite`} />
              <p>
                {i18n[i18n.myLang]['sidenav.button.favorite']}
              </p>
            </Link>
            <Link className={`SideNav-link`} to={`${ROOT}/app/youtube`} activeClassName={`is-current`}>
              <span className={`ic ic_youtube`} />
              <p>
                {i18n[i18n.myLang]['homepage.title.youtube']}
              </p>
            </Link>
            <Link className={`SideNav-link`} to={`${ROOT}/app/songbook`} activeClassName={`is-current`}>
              <span className={`ic ic_menu_requestbook`} />
              <p>
                {i18n[i18n.myLang]['sidenav.button.songbook']}
              </p>
            </Link>
            <Link className={`SideNav-link`} to={`${ROOT}/app/playlist`} activeClassName={`is-current`}>
              <span className={`ic ic_menu_requestinglist`} />
              <p>
                {i18n[i18n.myLang]['sidenav.button.playlist']}
              </p>
              { isShowCurrentTotal ?
                <div className={`SideNav-bagging`}>{sidenav.current >= 1000 ? '999+' : sidenav.current}</div> : null
              }
            </Link>
            <Link className={`SideNav-link`} to={`${ROOT}/app/history`} activeClassName={`is-current`}>
              <span className={`ic ic_menu_history`} />
              <p>
                {i18n[i18n.myLang]['sidenav.button.history']}
              </p>
            </Link>
          </div>
          <Link className={`SideNav-link SideNav-link--home`} to={`${ROOT}/app`}>
            <span className={`ic ic_menu_back`} />
            <p>
              {i18n[i18n.myLang]['sidenav.button.homepage']}
            </p>
          </Link>
        </aside>
    );
  }
}
