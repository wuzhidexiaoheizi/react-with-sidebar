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
    this.animationDispatcher.playAnimations();
  },

  displayAllAnimations() {
    this.animationDispatcher.playAll();
  },

  skipAnimations(animations) {
    this.animationDispatcher.skipAnimations(animations);
  },

  stopAnimations() {
    this.animationDispatcher.stopAnimations();
    this.setState({ showAnimation: false });
  },

  showAnimation(animations, animationDoneCallback) {
    const { playAnimation } = this.props;

    if (typeof playAnimation == 'function') playAnimation(animations, animationDoneCallback);
  },

  updateUnreadCount() {
    const unreadCount = this.animationDispatcher.getUnreadCount();
    this.setState({ unreadCount });

    if (unreadCount > 0) {
      const { animationBtn } = this.refs;
      this.effect = new Effect(animationBtn, { bottom: '+=5px' },
        'flip', 100, null, { effectInterval: 2000 });
    } else {
      if (this.effect) {
        this.effect.stop();
        this.effect = null;
      }
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
        <div className="unread-container">
          <div className="unread-gifts" onClick={this.playAnimations}>
            <img src={UNREAD_GIFT_ICON} />
            <div className="unread-desc">新礼物</div>
          </div>
        </div>
      </div>
    );
  },
});
