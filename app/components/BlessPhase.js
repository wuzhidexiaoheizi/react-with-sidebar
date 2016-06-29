import React, { Component } from 'react';

export default class BlessPhase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bless: ''
    };
  }

  onCancel() {
    const { onClose } = this.props;

    if (typeof onClose == 'function') onClose();
  }

  onConfirm(e) {
    e.preventDefault();

    const { bless } = this.state;
    const { partyId, updatePartyMessage } = this.props;

    updatePartyMessage(partyId, bless, this.onCancel.bind(this));
  }

  blessChanged(e) {
    this.setState({ bless: e.target.value });
  }

  render() {
    const { message } = this.props;
    const bless = this.state.bless || message;

    return (
      <div className="bless-phase-modal">
        <div className="phase-overlayer" onClick={this.onCancel.bind(this)}></div>
        <div className="bless-container">
          <div className="container">
            <div className="row">
              <div className="bless-content">
                <div className="bless-panel">
                  <div className="bless-header">
                    设置生日趴标题
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
