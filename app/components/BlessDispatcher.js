import React from 'react';
import AnimationDispatcher from '../prototypes/AnimationDispatcher';
import Constants from '../constants';

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

    // const { animationBtn } = this.refs;
  },

  initDispatcherConfig() {
    const { doneeField, animationNameField, animationFlagField, expireTime } = this.props;
    this.animationDispatcher.initConfig({
      animationNameField,
      animationFlagField,
      expireTime,
      doneeField,
    });
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
