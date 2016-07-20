import React, { Component } from 'react';

export default class GiftAnimation extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { autoDismiss, isValidAnimation } = this.props;

    if (autoDismiss) {
      this.animationEnd = this.autoDismissInAnimationDone.bind(this);

      if (isValidAnimation) {
        this.attachAnimationEndEvent();
      } else {
        setTimeout(this.animationEnd, 2000);
      }
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
    const { animationFun, bless } = this.props;
    const { animationElement } = this.refs;

    if (typeof animationFun == 'function') {
      animationFun(animationElement, bless, () => {
        this.closeAnimation();
        const { animationCallback } = this.props;

        if (typeof animationCallback == 'function') animationCallback();
      });
    }
  }

  closeAnimation() {
    const { onCloseAnimation } = this.props;
    if (typeof onCloseAnimation == 'function') onCloseAnimation();
  }

  render() {
    const {
      animationBlesses,
      autoDismiss,
      isValidAnimation,
    } = this.props;

    const bless = animationBlesses[0];
    const { virtual_present: { name }, sender: { nickname, login } } = bless;
    const doneeName = nickname || login;

    return (
      <div className="anim-container">
        <div className="donee-name">
          <div className="name">{doneeName}</div>
          赠送
        </div>

        <div className={`anim ${name}`} ref="animationElement">
          { !isValidAnimation &&
            <div className="invalid">
              无效动画
            </div>}
        </div>
        { !autoDismiss && <button className="anim-close" onClick={ this.closeAnimation.bind(this) }>X</button> }
      </div>
    );
  }
}
