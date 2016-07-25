import React, { Component } from 'react';
import Effect from '../prototypes/Effect';

export default class BlessPhase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bless: '',
      hasChanged: false,
      showError: false,
    };
  }

  componentDidMount() {
    const { blessContent } = this.refs;

    /*eslint-disable */
    new Effect(blessContent, { marginTop: '50px'}, 'easeOutExpo', '300ms');
    /*eslint-enable */
  }

  onCancel() {
    const { blessContent } = this.refs;
    const { clientHeight } = blessContent;

    /*eslint-disable */
    new Effect(blessContent, { marginTop: `-${clientHeight + 30}px`}, 'easeOutExpo', '300ms', () => {
      const { onClose } = this.props;

      if (typeof onClose == 'function') onClose();
    });
    /*eslint-enable */
  }

  onConfirm(e) {
    e.preventDefault();

    const { bless } = this.state;
    const { partyId, updatePartyMessage } = this.props;

    if (!bless.length) {
      this.setState({ showError: true });
      return;
    }

    updatePartyMessage(partyId, bless, this.onCancel.bind(this));
  }

  blessChanged(e) {
    const bless = e.target.value;
    this.setState({ bless, hasChanged: true, showError: !bless.length });
  }

  render() {
    const { message } = this.props;
    const { hasChanged, showError } = this.state;
    let { bless } = this.state;

    if (!bless.length && !hasChanged) {
      bless = message;
    }

    return (
      <div className="bless-phase-modal">
        <div className="phase-overlayer" onClick={this.onCancel.bind(this)}></div>
        <div className="bless-container">
          <div className="container">
            <div className="row">
              <div className="bless-content" ref="blessContent">
                <div className="bless-panel">
                  <div className="bless-header">
                    设置生日趴标题
                    { showError && <div className="error-tip">请输入生日趴标题</div> }
                  </div>
                  <div className="bless-body">
                    <textarea className="form-control bless-textarea" value={bless}
                      onChange={this.blessChanged.bind(this)} resizable="false" />
                  </div>
                  <div className="bless-footer">
                    <button className="btn btn-cancel" onClick={this.onCancel.bind(this)}>取消</button>
                    <button className="btn btn-confirm" onClick={this.onConfirm.bind(this)}>确认</button>
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
