import React, { Component } from 'react';
import PresentGroup from '../components/PresentGroup';
import Constants from '../constants';
import DismissTip from '../prototypes/DismissTip';
import Effect from '../prototypes/Effect';

export default class BlessDistribute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      message: '',
      virtual_present_id: null,
      showPresentErr: false,
      showMessageErr: false,
      disabled: false,
    };
  }

  componentDidMount() {
    const { fetchVirtualPresent } = this.props;

    fetchVirtualPresent();
  }

  changeMessage(e) {
    const message = e.target.value;
    this.setState({ message, showMessageErr: !message.length });
  }

  pickPresent(id) {
    this.setState({ virtual_present_id: id, showPresentErr: !id });
  }

  sendBless() {
    const { partyId, sendBless } = this.props;
    const { message, virtual_present_id } = this.state;
    let hasError = false;

    if (message.length == 0) {
      this.setState({ showMessageErr: true });
      hasError = true;
    }

    if (!virtual_present_id) {
      this.setState({ showPresentErr: true});
      hasError = true;
    }

    if (hasError) return;

    const params = {
      bless: {
        birthday_party_id: partyId,
        message,
        virtual_present_id
      }
    };

    sendBless(partyId, params, this.blessSendSuccess.bind(this), this.showResponseError.bind(this));
  }

  show() {
    this.setState({ isShow: true });
    const { distributeContent } = this.refs;

    /*eslint-disable */
    new Effect(distributeContent, { marginTop: '50px'}, 'easeOutExpo', '300ms');
    /*eslint-enable */
  }

  showResponseError(errors) {
    const { blessDistribute } = this.refs;
    /*eslint-disable */
    new DismissTip(blessDistribute, 'error', errors);
    /*eslint-enable */

    this.setState({
      disabled: false,
    });
  }

  hide() {
    const { distributeContent } = this.refs;
    const { clientHeight } = distributeContent;
    /*eslint-disable */
    new Effect(distributeContent, { marginTop: - (clientHeight + 50) + 'px'}, 'easeOutExpo', '300ms', () => {
      this.setState({
        isShow: false,
        message: '',
        virtual_present_id: null,
        showPresentErr: false,
        showMessageErr: false,
        disabled: false,
      });
    });
    /*eslint-enable */
  }

  blessSendSuccess(paid, callbackUrl) {
    if (paid) {
      this.hide();
    } else {
      window.location.href = callbackUrl;
    }
  }

  render() {
    const { presents } = this.props;
    const { isShow } = this.state;
    const klass = isShow ? '' : 'hide';
    const { PICK_PRESENT_LABEL_IMG, MESSAGE_LABEL_IMG } = Constants;

    return (
      <div className={`bless-distribute-modal ${klass}`} ref="blessDistribute">
        <div className="distribute-overlayer" onClick={this.hide.bind(this)}></div>
        <div className="distribute-container">
          <div className="container">
            <div className="row">
              <div className="distribute-content" ref="distributeContent">
                <div className="distribute-panel">
                  <div className="distribute-header">
                    <div className="header-label">
                      <img src={PICK_PRESENT_LABEL_IMG} />
                      { this.state.showPresentErr && <span className="err-tip">请挑选礼物！</span>}
                    </div>
                    <div className="present-list clearfix">
                      <PresentGroup presents={presents} onSelectChanged={this.pickPresent.bind(this)} />
                    </div>
                  </div>
                  <div className="distribute-body">
                    <div className="body-label">
                      <img src={MESSAGE_LABEL_IMG} />
                      { this.state.showMessageErr && <span className="err-tip">请输入您的祝福！</span> }
                    </div>
                    <div className="textarea-container">
                      <textarea value={this.state.message} className="form-control message-textarea"
                        onChange={this.changeMessage.bind(this)} resizable="false" />
                    </div>
                  </div>
                  <div className="distribute-footer">
                    <button className="btn btn-cancel" onClick={this.hide.bind(this)}>取消</button>
                    <button className="btn btn-confirm" onClick={this.sendBless.bind(this)}
                      disabled={this.state.disabled}>确认送出</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
