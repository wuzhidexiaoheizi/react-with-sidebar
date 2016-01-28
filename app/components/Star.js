import React, {Component} from 'react';
// import TransitionGroup from 'react-addons-css-transition-group';

export default class Star extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: props.rating,
    };
  }

  getStar(rating = 0) {
    const {num, starSize} = this.props;
    const stars = [];

    for (let i = 1; i <= num; i++) {
      const style = {
        fontSize: starSize,
        color: i <= rating ? '#ff2b2b' : '#DDD',
        transition: 'all 500ms',
        verticalAlign: 'middle',
      };
      stars.push(<span key={`star-${i}`} onClick={this.handleClick.bind(this, i)} style={style}>★</span>);
    }

    return stars.map(star => star);
  }

  handleClick(rating) {
    const {starClick, name, disable} = this.props;
    if (disable) return;
    this.setState({rating});
    starClick(name, rating);
  }

  captionStyle() {
    const {starSize, captionSize, captionColor} = this.props;
    return {
      color: captionColor,
      lineHeight: starSize,
      fontSize: captionSize,
      verticalAlign: 'middle',
    };
  }

  render() {
    const {rating} = this.state;
    return (
      <div>
        <span style={this.captionStyle()}>{this.props.caption}:&nbsp;</span>
        {this.getStar(rating)}
      </div>
    );
  }
}

Star.defaultProps = {
  starClick() {},
  rating: 0,
  name: 'star',
  captionColor: '#333',
  captionSize: '1.6rem',
  starSize: '3rem'
};
