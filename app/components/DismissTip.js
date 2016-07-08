import React, { Component } from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import { getTipImage } from '../helper';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';

export default class DismissTip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posY: '50%',
      type: '',
      message: '',
      showTip: false
    };
  }

  componentDidMount() {
    this.adjustPosition();
  }

  resetTypeAndMessage(type, message) {
    this.setState({
      type,
      message,
      showTip: true
    }, () => {
      this.adjustPosition();
    });

    setTimeout(() => {
      this.setState({ showTip: false });
    }, 4000);
  }

  adjustPosition() {
    const tipModal = this.refs.tipModal;

    if (tipModal) {
      const { clientHeight } = tipModal;
      const { innerHeight } = window;
      const posY = (innerHeight - clientHeight) / 2;

      this.setState({
        posY,
      });
    }
  }

  render() {
    const { message, type, showTip } = this.state;
    const tipImage = getTipImage(type);
    const { posY } = this.state;
    const elements = showTip ? (<VelocityTransitionGroup enter={{animation: 'transition.bounceIn'}}
      leave={{animation: 'transition.bounceOut'}} component="div" className="dismiss-tip-modal"
      defaults={{ duration: 2000 }}>
        <div className="dismiss-tip-content">
          <div className="dismiss-tip-body" ref="tipModal" style={{ marginTop: posY }}>
            <div className="tip-icon"><img src={tipImage} /></div>
            <div className="tip-msg">{message}</div>
          </div>
        </div>
      </VelocityTransitionGroup>) : null;

    return (
      <div>
        { elements }
      </div>
    );
  }
}
