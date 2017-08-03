import React, { Component, PropTypes } from 'react';
import jwplayer from 'jwplayer';

export default class Player extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { src } = this.props;

    if (typeof src === 'string') {
      this.jw = jwplayer('Jwplayer')
      this.jw.setup({
        file: src,
        type: 'flv',
        autostart: true,
        width: '100%',
        aspectratio: '16:9',
        skin: {
          name: 'glow'
        }
      })
    }
  }

  render() {
    const { src } = this.props
    if (!src || typeof src !== 'string') {
      return <h2 style={{ color: 'red' }}>Expected video source property to be a string.</h2>;
    }

    return (
      <div id={`Jwplayer`}>

      </div>
    )
  }
}

Player.propTypes = {
  src: PropTypes.string.isRequired
}
