import React from 'react';
import Curtain from '../prototypes/Curtain';

export default React.createClass({
  displayName: 'BulletCurtain',

  getInitialState() {
    return {
      isShow: true
    };
  },

  componentDidMount() {
    const {
      config: { color, fontSize, fontWeight, speed, alpha, lineSpacing, trackCount, loop, stopOnHover },
    } = this.props;

    const screenNode = this.refs.bulletContainer;
    const width = screenNode.clientWidth;
    const height = trackCount * window.parseInt(fontSize) + ( trackCount - 1) * lineSpacing;
    screenNode.style.height = `${height}px`;

    this.curtainInstance = new Curtain(screenNode, {
      width,
      color,
      fontSize,
      fontWeight,
      speed,
      alpha,
      lineSpacing,
      trackCount,
      loop,
    });

    // 赋值
    this.assignmentData();

    if (stopOnHover) this.addMouseEvents();
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.bullets != this.props.bullets;
  },

  componentDidUpdate() {
    this.curtainInstance.clear();
    this.assignmentData();
  },

  componentWillUnmount() {
    this.curtainInstance.clear();
    this.curtainInstance = null;

    const { stopOnHover } = this.props;

    if (stopOnHover) this.removeMouseEvents();
  },

  addMouseEvents() {
    const { bulletScreen } = this.refs;
    this.onMouseEnnter = this.mouseEnterHandler;
    this.onMouseLeave = this.mouseLeaveHandler;

    bulletScreen.addEventListener('mouseenter', this.onMouseEnnter, false);
    bulletScreen.addEventListener('mouseleave', this.onMouseLeave, false);
  },

  removeMouseEvents() {
    const { bulletScreen } = this.refs;
    bulletScreen.removeEventListener('mouseenter', this.onMouseEnnter, false);
    bulletScreen.removeEventListener('mouseleave', this.onMouseLeave, false);
  },

  mouseEnterHandler() {
    if (this.curtainInstance) this.curtainInstance.stop();
  },

  mouseLeaveHandler() {
    if (this.curtainInstance) this.curtainInstance.resume();
  },

  curtainInstance: null,

  assignmentData() {
    const { bullets, textFieldName } = this.props;

    if (!bullets.length) return;

    bullets.forEach((bullet) => {
      this.curtainInstance.addChild({
        text: bullet[textFieldName]
      });
    });

    this.curtainInstance.play();
  },

  toggleShow() {
    const { isShow } = this.state;
    const { bulletScreen } = this.refs;
    bulletScreen.style.display = isShow ? 'none' : 'block';

    this.setState({ isShow: !isShow });
  },

  render() {
    return (
      <div className="bullet-screen" ref="bulletScreen">
        <div className="screen-content" ref="bulletContainer"></div>
      </div>
    );
  }
});
