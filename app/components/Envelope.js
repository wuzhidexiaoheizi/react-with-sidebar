import React, { Component } from 'react';
import Constants from '../constants';
import Confirm from './Confirm';

export default class Envelope extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfirm: false,
    };
  }

  drawEnvelope() {
    const { withdrawUrl, withdrew } = this.props;

    if (+withdrew == 0 && withdrawUrl) window.location.href = withdrawUrl;
  }

  closeEnvelope() {
    const { onClose } = this.props;

    if (typeof onClose == 'function') onClose();
  }

  showConfirm() {
    this.setState({ showConfirm: true });
  }

  hideConfirm() {
    this.setState({ showConfirm: false });
  }

  render() {
    const { ENVELOPE_LG_LIGHT_IMG, ENVELOPE_LG_GRAY_IMG } = Constants;
    const { cakeImage, withdrew, withdrawable } = this.props;
    const hasDrawEnvelope = +withdrew > 0;
    const bgImage = hasDrawEnvelope ? ENVELOPE_LG_GRAY_IMG : ENVELOPE_LG_LIGHT_IMG;
    const title = '领取红包提示';
    const message = '领取红包后，将不能再获得后续好友送出的祝福产生的返现。现在确认领取吗？';

    return (
      <div className="envelope-modal">
        <div className="envelope-overlayer" onClick={this.closeEnvelope.bind(this)}></div>
        <div className="envelope-content">
          <div className="container">
            <div className="row">
              <div className="envelope" onClick={this.showConfirm.bind(this)}>
                <img src={bgImage} className="envelope-image"/>
                <div className="cake-image">
                  <img src={cakeImage} />
                </div>
                <div className="envelope-amount">
                  <div className="amount">
                    <span className="currency">￥</span>{withdrawable}.00
                  </div>
                  { !hasDrawEnvelope && <div className="envelope-desc">当前返现金额</div> }
                </div>
              </div>
            </div>
          </div>
          { this.state.showConfirm && <Confirm title={title} message={message}
            onCancel={this.hideConfirm.bind(this)} onConfirm={this.drawEnvelope.bind(this)} /> }
        </div>
      </div>
    );
  }
}
