import React, {Component} from 'react';
import DateSelect from './DateSelect';
import blessImage from '../images/bless.jpg';
import errPNG from '../images/err.png';
import Constants from '../constants';
import { serializeParams } from '../helper';

export default class BlessCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      doneeName: '',
      bless: '生日快乐，幸福健康！',
      address: '',
      contact: '',
      birthday: new Date(),
      disabled: false,
      showDoneeNameErr: false,
      showAddressErr: false,
      showContactErr: false,
      showBlessErr: false,
    };
  }

  setDoneeName(e) {
    const doneeName = e.target.value;

    this.setState({
      doneeName,
      showDoneeNameErr: !doneeName.length
    });
  }

  setContact(e) {
    const contact = e.target.value;
    const exp = /^((\d{3,4}-\d{7,8}(-\d+)?)|((\+?86)?1\d{10}))$/;

    this.setState({
      contact,
      showContactErr: !contact.length || !exp.test(contact)
    });
  }

  atLatestChanged(date) {
    this.setState({ birthday: date });
  }

  atEarliestChanged(date) {
    this.setState({ delieveryDate: date });
  }

  changeBless(e) {
    const bless = e.target.value;

    this.setState({
      bless,
      showBlessErr: !bless.length
    });
  }

  changeAddress(e) {
    const address = e.target.value;

    this.setState({
      address,
      showAddressErr: !address.length
    });
  }

  checkInputs() {
    const { doneeName, bless, address, contact } = this.state;
    const exp = /^((\d{3,4}-\d{7,8}(-\d+)?)|((\+?86)?1\d{10}))$/;

    const doneeNameValid = doneeName.length > 0;
    const blessValid = bless.length > 0;
    const addressValid = address.length > 0;
    const contactValid = contact.length > 0 && exp.test(contact);

    this.setState({
      showDoneeNameErr: !doneeNameValid,
      showAddressErr: !addressValid,
      showContactErr: !contactValid,
      showBlessErr: !blessValid,
    });

    return doneeNameValid && addressValid && contactValid && blessValid;
  }

  confirmOrder() {
    if (!this.checkInputs()) return;

    this.setState({ disabled: true });

    const { cakeId } = this.props;
    const { doneeName, bless, address, contact, birthday } = this.state;
    const href = encodeURIComponent(window.location.href);
    const params = {
      order: {
        cake_id: cakeId,
        contact_phone: contact,
        road: address,
        birthday_party_attributes: {
          message: bless,
          birthday_person: doneeName,
          birth_day: birthday
        }
      },
      goto_onemoney: true,
      callback_url: href
    };

    const { DOMAIN, CAKE_ORDER_URL } = Constants;
    const url = `${DOMAIN}${CAKE_ORDER_URL}`;
    const query = serializeParams(params);
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${url}?${query}`;
    form.submit();
  }

  close() {
    const { onClose } = this.props;

    if (typeof onClose == 'function') onClose();
  }

  render() {
    return (
      <div className="donee-modal">
        <div className="donee-overlayer" onClick={this.close.bind(this)}></div>
        <div className="donee-container">
          <div className="container">
            <div className="row">
              <div className="donee-content">
                <div className="donee-card">
                  <div className="donee-header">
                    <img src={blessImage} />
                  </div>
                  <div className="donee-body">
                    <div className="paragraph salutation">
                      <div className="input-container">
                        <input type="text" onChange={this.setDoneeName.bind(this)} className="donee-name" />
                        { this.state.showDoneeNameErr && <span className="err-tip">
                          请填写收货人
                          <img src={errPNG} />
                        </span> }
                      </div>
                      <span className="salutation-label">(先生/女士)</span>
                    </div>
                    <div className="paragraph">
                      <DateSelect onChanged={this.atLatestChanged.bind(this)} />
                    </div>
                    <div className="paragraph sentence">
                      是您的生日。愿所有的快乐，幸福，好运围绕在你的身边！我们将在您生日当天前将生日蛋糕送至&nbsp;耒阳市
                    </div>
                    <div className="paragraph">
                      <div className="input-container">
                        <input type="text" className="address" value={this.state.address}
                          onChange={this.changeAddress.bind(this)} placeholder="详细地址"/>
                        { this.state.showAddressErr && <span className="err-tip">
                          请填写详细地址
                          <img src={errPNG} />
                        </span> }
                      </div>
                    </div>
                    <div className="paragraph contact">
                      <span className="contact-label">联系电话：</span>
                      <div className="input-container">
                        <input type="text" value={this.state.contact} onChange={this.setContact.bind(this)}/>
                        { this.state.showContactErr && <span className="err-tip">
                          请填写正确的联系方式
                          <img src={errPNG} />
                        </span> }
                      </div>
                    </div>
                    { /*
                      <div className="paragraph">
                        我们将在<DateSelect at_latest={this.state.at_latest} shouldUpdateEarliest={shouldUpdateEarliest}
                        shouldUpdateLatest={shouldUpdateLatest} onChanged={this.atEarliestChanged.bind(this)}/>
                        <input type="text" value={this.state.deadlineHour} className="deadline"
                          onChange={this.changeDeadlineHour.bind(this)}/>
                        时之前送到耒阳市
                        <div><input type="text" className="address" value={this.state.address}
                          onChange={this.changeAddress.bind(this)} />
                        </div>
                      </div>
                    */ }
                    <div className="paragraph">请耐心等候，谢谢！</div>
                    <div>祝：</div>
                    <div className="bless-sentence paragraph input-container">
                      <input type="text" value={this.state.bless} onChange={this.changeBless.bind(this)} />
                      { this.state.showBlessErr && <span className="err-tip">
                        请填写生日祝福
                        <img src={errPNG} />
                      </span> }
                    </div>
                  </div>
                </div>
                <div className="donee-footer">
                  <button className="btn btn-cancel" onClick={this.close.bind(this)}>取消</button>
                  <button className="btn btn-confirm" disabled={this.state.disabled}
                    onClick={this.confirmOrder.bind(this)}>下一步</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
