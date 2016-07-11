import React, {Component} from 'react';

export default class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      posY: '50%',
    };
  }

  componentDidMount() {
    this.adjustPosition();
  }

  close() {
    const { onCancel } = this.props;

    if (typeof onCancel == 'function') onCancel();
  }

  confirm() {
    this.setState({ disabled: true });

    const { onConfirm } = this.props;

    if (typeof onConfirm == 'function') onConfirm();
  }

  adjustPosition() {
    const { confirmContent } = this.refs;

    if (confirmContent) {
      const { clientHeight } = confirmContent;
      const { innerHeight } = window;
      const posY = (innerHeight - clientHeight) / 2;

      this.setState({
        posY,
      });
    }
  }

  render() {
    const { title, message } = this.props;
    const { posY } = this.state;

    return (
      <div className="confirm-modal">
        <div className="confirm-overlayer" onClick={this.close.bind(this)}></div>
        <div className="confirm-content">
          <div className="container">
            <div className="row">
              <div className="confirm-panel" ref="confirmContent" style={{ top: posY }}>
                <div className="confirm-header">
                  {title}
                </div>
                <div className="confirm-body">
                  {message}
                </div>
                <div className="confirm-footer">
                  <button className="btn btn-cancel" onClick={this.close.bind(this)}>取消</button>
                  <button className="btn btn-confirm" disabled={this.state.disabled}
                    onClick={this.confirm.bind(this)}>确认</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
