import React, { Component, PropTypes } from 'react';

export default class BulletItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: 0,
    };
  }

  componentDidMount() {
    this.initPos();
  }

  componentWillUnmount() {
    clearTimeout(this.flyTimeout);
  }

  pause() {
    const { bulletItem } = this.refs;
    const { left } = bulletItem;

    bulletItem.style.transition = '';

    this.setState({ left });
  }

  fly() {
    const { bulletItem } = this.refs;
    const destPos = -bulletItem.clientWidth;
    const displayTime = (this.srcPos - destPos) / this.speed;
    bulletItem.style.transition = `left ${displayTime}s linear 0s`;
    bulletItem.style.left = `${destPos}px`;
    this.flyTimeout = setTimeout(this.bulletFlyFinish.bind(this), displayTime * 1000);
  }

  bulletFlyFinish() {
    const { bulletItem } = this.refs;

    if (bulletItem) {
      bulletItem.style.transition = '';
      bulletItem.style.display = 'none';
      this.initPos();
      bulletItem.style.display = 'block';
      this.fly();
    }
  }

  initPos() {
    const { bulletItem } = this.refs;
    const width = bulletItem.parentNode.clientWidth;
    const { bulletIndex, bulletLengthes } = this.props;
    let offset = 0;

    for (let i = bulletIndex; i < bulletLengthes.length; i++) {
      offset += bulletLengthes[i];
    }

    const left = offset + width;
    this.srcPos = left;
    bulletItem.style.left = `${left}px`;
  }

  render() {
    const { bullet, textField } = this.props;
    const text = bullet[textField];

    return (
      <div className="bullet-item" ref="bulletItem">
        {text}
      </div>
    );
  }
}

BulletItem.defaultProps = {
  speed: 200,
};

BulletItem.propTypes = {
  speed: PropTypes.number,
};
