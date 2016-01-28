import React, {Component} from 'react';

// onTouchEnd
// onTouchMove
// onTouchStart
// onTouchCancel

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };

    this.touchStartX = 0;
    this.sliderX = 0;
    this.translateX = 0;
    this.screenWidth = window.screen.width;
    this.imgNum = this.props.images.length;
    this.sliderWidth = this.screenWidth * this.imgNum;
    this.sliderMaxX = -this.screenWidth * (this.imgNum - 1);
  }

  getStyle() {
    this.imgNum = this.props.images.length;
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
      },
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
    this.setState({index});
  }

  renderNav() {
    const navStyle = {
      textAlign: 'center',
      width: '100%',
      position: 'absolute',
      bottom: '30px',
      zIndex: '3'
    };
    const spanStyle = {
      width: '10px',
      height: '10px',
      display: 'inline-block',
      borderRadius: '50%',
      margin: '5px',
      border: '1px solid #EEE',
      transition: 'all 500ms',
    };
    const lightStyle = Object.assign({
      backgroundColor: 'rgba(255, 255, 255, 1)',
    }, spanStyle);
    const darkStyle = Object.assign({
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    }, spanStyle);
    return (
      <nav style={navStyle}>
      {
        this.props.images.map((_, index) => {
          if (this.state.index == -index) {
            return <span key={`navSpan-${index}`} style={lightStyle}></span>;
          }
          return <span key={`navSpan-${index}`} style={darkStyle}></span>;
        })
      }
      </nav>
    );
  }

  render() {
    const {images} = this.props;

    return (
      <div style={this.getStyle().container}>
        {this.renderNav()}
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

Slider.defaultProps = {
  images: [],
};
