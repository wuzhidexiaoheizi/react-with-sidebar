import React, {Component} from 'react';

export default class PartyPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page-container party-container">
        <div className="party-nano">
          <div className="party-content">
            <div className="container">
              <div className="row">
                <div className="party-header">
                  <img className="party-poster" src={__LIST_IMG__}/>
                </div>
                <div className="party-body">
                  <div className="bless-container">
                    <div className="bless-summary">
                      <div className="row">
                        <div className="bless-review col-xs-3 align-center">
                          红心 10
                        </div>
                        <div className="bless-review col-xs-3 align-center">
                          鲜花 15
                        </div>
                        <div className="bless-review col-xs-3 align-center">
                          车 1
                        </div>
                        <div className="bless-review col-xs-3 align-center">
                          房子 0
                        </div>
                      </div>
                    </div>
                    <div className="bless-list">
                      <div className="bless-item">
                        <div className="bless-item-top clearfix">
                          <div className="benefactor-avatar">
                            <img src={__DEFAULT_AVATAR__} />
                          </div>
                          <div className="bless-factors">
                            <div className="bless-figure">
                              <span className="benefactor-name">土豪</span>
                              赠送
                              <span className="donee-name">屌丝</span>
                              <span className="gift">一颗红心</span>
                            </div>
                            <div className="bless-date">6月17日 11:40</div>
                          </div>
                        </div>
                        <div className="bless-item-bottom text-ellipsis">
                          在这个特殊的日子里祝你早日逆袭,迎娶高富帅,走上人生的巅峰
                        </div>
                      </div>

                      <div className="bless-item">
                        <div className="bless-item-top clearfix">
                          <div className="benefactor-avatar">
                            <img src={__DEFAULT_AVATAR__} />
                          </div>
                          <div className="bless-factors">
                            <div className="bless-figure">
                              <span className="benefactor-name">土豪</span>
                              赠送
                              <span className="donee-name">屌丝</span>
                              <span className="gift">一颗红心</span>
                            </div>
                            <div className="bless-date">6月17日 11:40</div>
                          </div>
                        </div>
                        <div className="bless-item-bottom text-ellipsis">
                          在这个特殊的日子里祝你早日逆袭,迎娶高富帅,走上人生的巅峰
                        </div>
                      </div>

                      <div className="bless-item">
                        <div className="bless-item-top clearfix">
                          <div className="benefactor-avatar">
                            <img src={__DEFAULT_AVATAR__} />
                          </div>
                          <div className="bless-factors">
                            <div className="bless-figure">
                              <span className="benefactor-name">土豪</span>
                              赠送
                              <span className="donee-name">屌丝</span>
                              <span className="gift">一颗红心</span>
                            </div>
                            <div className="bless-date">6月17日 11:40</div>
                          </div>
                        </div>
                        <div className="bless-item-bottom text-ellipsis">
                          在这个特殊的日子里祝你早日逆袭,迎娶高富帅,走上人生的巅峰
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="party-footer">
            <div className="container">
              <div className="row">
                <div className="give-bless">
                  赠送祝福
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
