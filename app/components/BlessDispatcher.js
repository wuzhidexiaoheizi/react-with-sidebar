import React from 'react';
import AnimationDispatcher from '../prototypes/AnimationDispatcher';
import Constants from '../constants';
import Effect from '../prototypes/Effect';

export default React.createClass({
  displayName: 'BlessDispatcher',

  getInitialState() {
    return {
      unreadCount: 0,
      showAnimations: true,
    };
  },

  componentDidMount() {
    this.animationDispatcher = new AnimationDispatcher(this);
  },

  initDispatcherConfig() {
    const { config } = this.props;
    this.animationDispatcher.initConfig(config);
  },

  insertAnimations(newAnimations) {
    if (!newAnimations.length) return;

    this.initDispatcherConfig();
    this.animationDispatcher.addAnimations(newAnimations);
  },

  playAnimations() {
    const { showCloseBtn } = this.props;

    if (typeof showCloseBtn == 'function') showCloseBtn();
    this.animationDispatcher.playAnimations();
  },

  skipAnimations() {
    this.animationDispatcher.skipAnimations();
  },

  stopAnimations() {
    this.animationDispatcher.stopAnimations();
    this.setState({ showAnimation: false });
  },

  showAnimation(doneeName, animationName, animationDoneCallback) {
    const { playAnimation } = this.props;

    if (typeof playAnimation == 'function') {
      playAnimation(doneeName, animationName, () => {
        this.animationCallback(animationDoneCallback);
      });
    }
  },

  updateUnreadCount() {
    const unreadCount = this.animationDispatcher.getUnreadCount();
    this.setState({ unreadCount });

    if (unreadCount > 0) {
      const { animationBtn } = this.refs;
      this.effect = new Effect(animationBtn, { bottom: '+5px' },
        'flip', 100, null, { effectInterval: 2000 });
    } else {
      if (this.effect) {
        this.effect.stop();
        this.effect = null;
      }
    }
  },

  animationCallback(animationDoneCallback) {
    animationDoneCallback();
    this.updateUnreadCount();

    const animationDone = this.animationDispatcher.animationsIsDone();

    if (animationDone) {
      const { hideCloseBtn } = this.props;

      if (typeof hideCloseBtn == 'function') hideCloseBtn();
    }
  },

  animationDispatcher: null,
  effect: null,

  render() {
    const { UNREAD_GIFT_ICON } = Constants;
    const { unreadCount } = this.state;
    const klass = unreadCount > 0 ? 'shown' : '';

    return (
      <div className={`bless-dispatcher ${klass}`} ref="animationBtn">
        <div className="unread-gifts" onClick={this.playAnimations}>
          <img src={UNREAD_GIFT_ICON} />
          <div className="unread-desc">新礼物</div>
        </div>
      </div>
    );
  },
});
