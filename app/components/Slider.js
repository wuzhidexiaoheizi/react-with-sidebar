import React, {Component} from 'react';

// onTouchEnd
// onTouchMove
// onTouchStart
// onTouchCancel

export default class extends Component {
  constructor(props) {
    super(props);
    this.touchStartX = 0;
    this.sliderX = 0;
    this.translateX = 0;
    this.screenWidth = window.screen.width;
    this.imgNum = this.props.images && (this.props.images.length || 0);
    this.sliderWidth = this.screenWidth * this.imgNum;
    this.sliderMaxX = -this.screenWidth * (this.imgNum - 1);
  }

  getStyle() {
    this.imgNum = this.props.images && (this.props.images.length || 0);
    this.sliderWidth = this.screenWidth * this.imgNum;
    this.sliderMaxX = -this.screenWidth * (this.imgNum - 1);
    return {
      container: {
        widht: '100%',
        position: 'relative',
        overflow: 'hidden',
      },
      sliderContainer: {
        width: this.sliderWidth + 'px',
      },
      imgWrap: {
        display: 'inline-block',
      },
      img: {
        width: this.screenWidth + 'px',
      }
    };
  }

  handleOnTouchStart(e) {
    e.preventDefault();
    const {slider} = this.refs;
    slider.style.transition = null;
    slider.style.webkitTransition = null;

    this.touchStartX = e.touches[0].pageX;
  }

  handleOnTouchMove(e) {
    const {slider} = this.refs;
    const {pageX} = e.touches[0];

    const diffX = pageX - this.touchStartX;

    if (diffX + this.sliderX < 50) {
      if (diffX + this.sliderX > this.sliderMaxX - 50) {
        this.translateX = diffX + this.sliderX;
      } else {
        this.translateX = this.sliderMaxX - 50;
      }
    } else {
      this.translateX = 50;
    }

    slider.style.transform = `translateX(${this.translateX}px)`;
  }

  handleOnTouchEnd() {
    const {slider} = this.refs;
    const index = (this.translateX / this.screenWidth).toFixed(0);
    slider.style.transition = 'all 500ms';
    slider.style.webkitTransition = 'all 500ms';

    slider.style.transform = `translateX(${index * this.screenWidth}px)`;
    this.sliderX = index * this.screenWidth;
  }

  render() {
    const {images} = this.props;

    return (
      <div style={this.getStyle().container}>
        <div
          ref="slider"
          style={this.getStyle().sliderContainer}
          onTouchEnd={this.handleOnTouchEnd.bind(this)}
          onTouchMove={this.handleOnTouchMove.bind(this)}
          onTouchStart={this.handleOnTouchStart.bind(this)}
        >
        {
          images && images.map(url =>
            <div key={url} style={this.getStyle().imgWrap}>
              <img style={this.getStyle().img} src={url}/>
            </div>
          )
        }
        </div>
      </div>
    );
  }
}
