import React, { Component } from 'react';

export default class GiftAnimation extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { autoDismiss } = this.props;

    if (autoDismiss) {
      this.animationEnd = this.autoDismissInAnimationDone.bind(this);
      this.attachAnimationEndEvent();
    }
  }

  componentWillUnmount() {
    const { autoDismiss } = this.props;

    if (autoDismiss) {
      this.detachAnimationEndEvent();
    }
  }

  attachAnimationEndEvent() {
    const { animationElement } = this.refs;

    animationElement.addEventListener('webkitAnimationEnd', this.animationEnd, false);
    animationElement.addEventListener('oAnimationEnd', this.animationEnd, false);
    animationElement.addEventListener('animationend', this.animationEnd, false);
  }

  detachAnimationEndEvent() {
    const { animationElement } = this.refs;

    animationElement.removeEventListener('webkitAnimationEnd', this.animationEnd, false);
    animationElement.removeEventListener('oAnimationEnd', this.animationEnd, false);
    animationElement.removeEventListener('animationend', this.animationEnd, false);
  }

  autoDismissInAnimationDone() {
    this.closeAnimation();

    const { animationCallback } = this.props;

    if (typeof animationCallback == 'function') animationCallback();
  }

  closeAnimation() {
    const { onCloseAnimation } = this.props;
    if (typeof onCloseAnimation == 'function') onCloseAnimation();
  }

  render() {
    const { doneeName, animationName, autoDismiss } = this.props;
    
    return (
      <div className="anim-container">
        <div className="donee-name">
          <div className="name">{doneeName}</div>
          赠送
        </div>
        <div className={`anim ${animationName}`} ref="animationElement">
        </div>
        { !autoDismiss && <button className="anim-close" onClick={ this.closeAnimation.bind(this) }>X</button> }
      </div>
    );
  }
}
