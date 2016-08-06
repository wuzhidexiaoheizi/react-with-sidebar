import React, { Component } from 'react';
import Constants from '../constants';
import Effect from '../prototypes/Effect';

export default class PartyCard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { animateElement, overlayer } = this.refs;

    /*eslint-disable */
    new Effect(animateElement, { marginTop: '100px'}, 'easeOutExpo', '300ms');
    new Effect(overlayer, { opacity: 1 }, 'easeOutExpo', '300ms');
    /*eslint-enable */
  }

  enterParty() {
    const { animateElement } = this.refs;
    const { clientHeight } = animateElement;
    const { onClose } = this.props;

    /*eslint-disable */
    new Effect(animateElement, { marginTop: `-${clientHeight}px`}, 'easeOutExpo', '300ms', () => {
      if (typeof onClose == 'function') onClose();
    });
    /*eslint-enable */
  }

  render() {
    const { avatar, person, invited } = this.props;
    const { DONEE_DEFAULT_AVATAR } = Constants;
    const imgSrc = avatar || DONEE_DEFAULT_AVATAR;

    return (
      <div className="party-card">
        <div className="party-card-overlayer" ref="overlayer"></div>
        <div className="party-card-content">
          <div className="container">
            <div className="row">
              <div className="party-card-body" ref="animateElement">
                <div className="card-content">
                  <div className="birthman-avatar">
                    <img src={imgSrc} />
                  </div>
                  <div className="card-top">
                    <div className="birthman-name">{person}</div>
                    <p>亲爱的 {invited}</p>
                    <p className="indent">您好，诚挚地邀请您参加我的生日趴！</p>
                    <p>您的到来是我莫大的荣幸。愿您在我的生日趴上玩得愉快！</p>
                  </div>
                  <div className="card-bottom">
                    <button className="btn btn-confirm" onClick={this.enterParty.bind(this)}>进入生日趴</button>
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
