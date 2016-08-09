import React, { Component } from 'react';
import Constants from '../constants';
import Confirm from './Confirm';
import { formatCurrency } from '../helper';
import Effect from '../prototypes/Effect';

export default class Envelope extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfirm: false,
    };
  }

  componentDidMount() {
    const { envelopContent } = this.refs;
    const { clientHeight } = envelopContent;
    envelopContent.style.marginTop = `-${clientHeight}px`;

    /*eslint-disable */
    new Effect(envelopContent, { marginTop: '30px' }, 'easeOutExpo', '300ms');
    /*eslint-enable */
  }

  drawEnvelope() {
    const { withdrawUrl, withdrew } = this.props;

    if (+withdrew == 0 && withdrawUrl) window.location.href = withdrawUrl;
  }

  closeEnvelope() {
    const { envelopContent } = this.refs;
    const { clientHeight } = envelopContent;

    /*eslint-disable */
    new Effect(envelopContent, { marginTop: `-${clientHeight}px` }, 'easeOutExpo', '300ms', () => {
      const { onClose } = this.props;

      if (typeof onClose == 'function') onClose();
    });
    /*eslint-enable */
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
    const currency = formatCurrency(withdrawable);

    return (
      <div className="envelope-modal">
        <div className="envelope-overlayer" onClick={this.closeEnvelope.bind(this)}></div>
        <div className="envelope-content">
          <div className="container">
            <div className="row">
              <div className="envelope" onClick={this.showConfirm.bind(this)} ref="envelopContent">
                <img src={bgImage} className="envelope-image"/>
                <div className="cake-image">
                  <img src={cakeImage} />
                </div>
                <div className="envelope-amount">
                  <div className="amount">
                    <span className="currency">￥</span>{currency}
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
