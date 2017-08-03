import React, { Component, PropTypes } from 'react';
import chunk from 'lodash/chunk';

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }

  render() {
    const { children, slidesToShow, dots, showYoutube } = this.props;
    const { current } = this.state;
    const slides = chunk(children, slidesToShow);
    return (
      <div className={`Slider`}>
        {this.renderPreviousBtn(current, showYoutube)}
        {this.renderNextBtn(current, slides.length)}
        <div className={`Slider-list`}>
          {slides[current]}
        </div>
        {dots ? this.renderDots(slides) : null}
      </div>
    )
  }

  renderPreviousBtn(current, showYoutube) {
    if ( current > 0 ) {
      return (
        <div className={`Slider-previousBtn ic btn_page_previous`} onClick={this.handlePrevious.bind(this, current)} />
      );
    } else {
      return null;
    }
  }

  handlePrevious(current) {
    const { handleShowYoutube } = this.props;
    let previous = current - 1;
    if (previous < 0) {
      previous = 0;
    }
    handleShowYoutube();
    this.setState(Object.assign(this.state, { current: previous }));
  }

  renderNextBtn(current, length) {
    return current === length - 1 ? null : <div className={`Slider-nextBtn ic btn_page_next`} onClick={this.handleNext.bind(this, current, length)}></div> ;
  }

  handleNext(current, length) {
    const { handleShowYoutube } = this.props;
    let next = current + 1;
    const final = length - 1;
    if (next > final) {
      next = final;
    }
    handleShowYoutube(true);
    this.setState(Object.assign(this.state, { current: next }));
  }

  renderDots(slides) {
    return (
      <div className={`Slider-dots`}>
        {slides.map(this.renderDot.bind(this))}
      </div>
    );
  }

  renderDot(item, index) {
    const { current } = this.state;
    const className = index === current ? `Slider-dot is-current` : `Slider-dot`;
    return <div key={index} className={className} onClick={ evt => this.setState({ current: index })}></div>
  }
}

Slider.propTypes = {
  children: PropTypes.array.isRequired,
  slidesToShow: PropTypes.number.isRequired,
  dots: PropTypes.bool
};

Slider.defaultProps = {
  slidesToShow: 1,
  dots: true
};

export default Slider;
