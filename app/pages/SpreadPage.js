import React, {Component} from 'react';
import {connect} from 'react-redux';
import QRCode from 'qrcode.react';
import WelfareGroup from '../components/WelfareGroup';
import {fetchSeeds, fetchCurrentSeeds} from '../actions/seed';

class SpreadPage extends Component {
  componentDidMount() {
    this._fetchSeeds();

    this.pullInterval = setInterval(() => {
      this._fetchSeeds();
    }, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.pullInterval);
  }

  _fetchSeeds() {
    const { dispatch, currentUser } = this.props;

    if (currentUser) {
      dispatch(fetchSeeds(currentUser.id));
    } else {
      dispatch(fetchCurrentSeeds());
    }
  }

  handlePurchase() {
    const { seeds } = this.props;
    const activeSeed = seeds.find(seed => seed.status == 'active');

    if (!activeSeed) return;

    const { history, location } = this.props;
    const query = location.query;

    if (query && query.item_id) {
      history.pushState(null, `/detail/${query.item_id}`);
    } else {
      history.pushState(null, '/list');
    }
  }

  render() {
    const origin = window.location.origin;
    const pathname = window.location.pathname;

    const { seeds, currentUser, location } = this.props;
    const { from_id } = location.query;
    const path = `${origin}${pathname}#/`;
    const callback_url = encodeURIComponent(path);

    if (currentUser && currentUser.id != from_id) {
      window.location.href = `${origin}${__API__}/${__ONE_MONEY_ID__}/retrieve_seed/${from_id}?callback=${callback_url}&to=fragment`;
    }

    const activeSeeds = seeds.filter(seed => seed.status == 'active');

    let url = `${path}`;

    if (currentUser && currentUser.id) {
      url = `${origin}${__API__}/${__ONE_MONEY_ID__}/retrieve_seed/${currentUser.id}?callback=${callback_url}&to=fragment`;
    }

    const total = seeds.length;
    const purchase_count = activeSeeds.length;

    return (
      <div className="spread-page">
        <div className="spread-container">
          <div className="spread-header">
            <img className="share-pic" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/c23a395f8897cdf791a59d13fbb39a2a.jpg" />
            <div className="spread-person">
              <img src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/5ca7d753490acc567d0dec1df8c50288.png" />
            </div>
            <div className="rule-pic">
              <img src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/86791d25628f2234cf2674d63dfb99fc.png" />
            </div>
          </div>
          <div className="spread-content">
            <div className="spread-summary">
              <ul>
                <li><p>1. 发送此页面邀请你的好友参加。</p></li>
                <li><p>2. 好友通过您的链接进入活动后您额外获得一次抢购机会。</p></li>
                <li><p>3. 此次活动您最多获得{total}次额外抢购机会</p></li>
              </ul>
            </div>
            <div className="qrcode-container">
              <QRCode value={url} size="150" />
            </div>
            <WelfareGroup seeds={seeds} />
          </div>
          <div className="spread-state">
            <div className="spread-btn" onClick={this.handlePurchase.bind(this)}>
              您有<span className="purchase-count">{purchase_count}</span>次抢购机会
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    seeds: state.seed.seeds,
    currentUser: state.user.currentUser
  };
}

export default connect(mapStateToProps)(SpreadPage);
