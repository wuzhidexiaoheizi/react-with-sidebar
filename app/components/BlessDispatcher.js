import React from 'react';
import AnimationDispatcher from '../prototypes/AnimationDispatcher';

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
    this.animationDispatcher.playAnimations();
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
  },

  animationDispatcher: null,

  render() {
    return (
      <div className="bless-dispatcher">
        <span className="unread-tip">
          {this.state.unreadCount}个未播放的礼物动画
        </span>
      </div>
    );
  },
});
