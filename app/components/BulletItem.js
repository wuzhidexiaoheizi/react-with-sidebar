import React, { Component, PropTypes } from 'react';

export default class BulletItem extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initPos();
  }

  componentWillUnmount() {
    clearTimeout(this.flyTimeout);
  }

  pause() {
    const { bulletItem } = this.refs;
    bulletItem.style.transition = '';
    this.srcPos = bulletItem.style.left;
  }

  fly() {
    const { bulletItem } = this.refs;
    const { speed } = this.props;
    const destPos = -bulletItem.clientWidth;
    const displayTime = (this.srcPos - destPos) / speed;
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

    for (let i = bulletIndex + 1; i < bulletLengthes.length; i++) {
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
