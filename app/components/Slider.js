/* 
 * @parmas images arrary
 * @parmas autoTime number
 * @parmas auto bool
 */

// 没有使用 react 的事件系统, 直接获取 dom 元素 使用原生的事件系统

import React, { Component } from 'react';

export default class Slider extends Component {
  static defaultProps = {
    index: 0,
    auto: false,
    autoTime: 3000,
    images: [],
    rate: 0.5,
  };

  style = {
    container: {
      position: 'relative',
      overflow: 'hidden',
      cursor: '-webkit-grab',
    },
    indicateBox: {
      position: 'absolute',
      width: '100%',
      bottom: '0',
      textAlign: 'center'
    },
    indicateDot: {
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,.5)',
      margin: '10px 5px',
      transition: 'all .5s',
      WebkitTransition: 'all .5s',
    },
    scroller: {
      whiteSpace: 'nowrap',
      transition: 'transform .5s',
      WebkitTransition: 'transform .5s',
    },
    img: {
      width: '100%',
      display: 'inline-block',
    }
  };

  moveInfo = {
    active: false,
    startX: 0,
    diffX: 0,
    translateX: 0,
    endX: 0,
    startTime: 0,
    endTime: 0,
    max: 0,
    min: 0,
  };

  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }

  componentDidMount() {
    const {
      refs: { container },
      props: { auto }
    } = this;

    this.initData();

    this._onResize = this.onResize.bind(this);

    window.addEventListener('resize', this._onResize, false);

    // touch
    this._onMoveStart = this.onMoveStart.bind(this);
    this._onMove = this.onMove.bind(this);
    this._onMoveEnd = this.onMoveEnd.bind(this);

    if ("ontouchstart" in window) {
      container.addEventListener('touchstart', this._onMoveStart, false);
      container.addEventListener('touchmove', this._onMove, false);
      container.addEventListener('touchend', this._onMoveEnd, false);
    } else {
      // mouse
      container.addEventListener('mousedown', this._onMoveStart, false);
      container.addEventListener('mousemove', this._onMove, false);
      container.addEventListener('mouseleave', this._onMoveEnd, false);
      container.addEventListener('mouseup', this._onMoveEnd, false);
    }

    if (auto) this.autoScroll();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { state, props } = this;

    if (state.index !== nextState.index ||
      props.auto !== nextProps.auto ||
      props.autoTime !== nextProps.autoTime ||
      props.images != nextProps.images
    ) return true;

    return false;
  }

  componentWillUnmount() {
    const {
      refs: { container },
    } = this;

    if (this.intervel) {
      clearInterval(this.intervel);
      this.intervel = null;
    }

    window.removeEventListener('resize', this._onResize, false);

    if ("ontouchstart" in window) {
      container.removeEventListener('touchstart', this._onMoveStart, false);
      container.removeEventListener('touchmove', this._onMove, false);
      container.removeEventListener('touchend', this._onMoveEnd, false);
    } else {
      // mouse
      container.removeEventListener('mousedown', this._onMoveStart, false);
      container.removeEventListener('mousemove', this._onMove, false);
      container.removeEventListener('mouseleave', this._onMoveEnd, false);
      container.removeEventListener('mouseup', this._onMoveEnd, false);
    }
  }

  onResize() {
    this.initData();
    this.onMoveEnd();
  }

  onMoveStart(e) {
    let x;

    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].pageX;
    } else {
      x = e.pageX;
    }

    const { container, scroller } = this.refs;
    this.moveInfo.startX = x;
    this.moveInfo.active = true;
    this.moveInfo.startTime = Date.now();
    container.style.cursor = '-webkit-grabbing';
    scroller.style.transition = 'none';
    scroller.style.webkitTransition = 'none';
  }

  onMove(e) {
    e.preventDefault();

    const { pageX } = e;

    const { scroller } = this.refs;
    const { startX, endX, minX, maxX, active } = this.moveInfo;

    if (!active) return;

    this.moveInfo.diffX = startX - pageX;
    let _translateX = endX - this.moveInfo.diffX;

    if (_translateX > minX) {
      _translateX = minX;
    } else {
      _translateX = _translateX < maxX ? maxX : _translateX;
    }

    this.moveInfo.translateX = _translateX;
    scroller.style.transform = `translate(${_translateX}px)`;
    scroller.style.webkitTransform = `translate(${_translateX}px)`;
  }

  onMoveEnd() {
    const {
      state: { index },
      props: { rate },
      refs: { container, scroller },
      moveInfo: {
        containerWidth,
        translateX,
        startTime,
        picNum,
        diffX,
        minX,
        maxX,
      }
    } = this;

    this.moveInfo.active = false;
    container.style.cursor = '-webkit-grab';

    let _index;
    const diffTime = Date.now() - startTime;

    if (Math.abs(diffX / diffTime) > rate && translateX < minX && translateX > maxX) {
      if (diffX > 0) {
        if (index != picNum - 1) {
          _index = index + 1;
        }
      } else {
        if (index !== 0) {
          _index = index - 1;
        }
      }
    } else {
      _index = Number(Math.abs(translateX / containerWidth).toFixed(0));
    }

    this.moveInfo.endX = -1 * _index * containerWidth;
    this.setState({ index: _index });
    scroller.style.transition = 'transform .5s';
    scroller.style.webkitTransition = 'transform .5s';
    scroller.style.transform = `translateX(${this.moveInfo.endX}px)`;
    scroller.style.webkitTransform = `translateX(${this.moveInfo.endX}px)`;

    this.moveInfo.diffX = 0;
  }

  initData() {
    const { container } = this.refs;
    this.moveInfo.containerWidth = container.offsetWidth;
    this.moveInfo.picNum = this.props.images.length;

    // TODO 自定义
    this.moveInfo.maxX = -(this.moveInfo.containerWidth * (this.moveInfo.picNum - 1) + 20);
    this.moveInfo.minX = 20;
  }

  autoScroll() {
    const {
      props: { autoTime },
      moveInfo: { containerWidth, picNum, active },
      refs: { scroller }
    } = this;

    this.intervel = setTimeout(() => {
      if (active) return this.autoScroll();
      let _index = this.state.index + 1;

      _index = _index > picNum - 1 ? 0 : _index;
      this.setState({ index: _index });
      this.moveInfo.endX = -1 * _index * containerWidth;
      scroller.style.transform = `translateX(${this.moveInfo.endX}px)`;
      scroller.style.webkitTransform = `translateX(${this.moveInfo.endX}px)`;

      this.autoScroll();
    }, autoTime);
  }

  render() {
    const {
      style,
      state: { index },
      props: { images },
    } = this;

    return (
      <div style={style.container} ref="container">
        <div style={style.scroller} ref="scroller">
          {
            images.map((src, i) =>
              <img key={i} style={style.img} src={src} />
            )
          }
        </div>
        <div style={style.indicateBox}>
          {
            images.map((_, i) => {
              const activeStyle = Object.assign({}, style.indicateDot, { background: 'rgba(255,255,255,.9)' });
              return <span key={i} style={i === index ? activeStyle : style.indicateDot }></span>;
            })
          }
        </div>
      </div>
    );
  }
}

