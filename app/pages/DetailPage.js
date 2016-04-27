import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import StatusBar from '../components/StatusBar';
import SpreadBar from '../components/SpreadBar';
import Winners from '../components/Winners';
import CountDown from '../components/CountDown';
import Nav from '../components/Nav';
import Slider from 'uinz-slider';

import {statusDescs, positiveNumber, getStatus, formatTime} from '../helper';
import * as Actions from '../actions';
import {fetchSeeds, fetchCurrentSeeds, fetchSeedsCount} from '../actions/seed';

class DetailPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {params: {id}, dispatch} = this.props;
    dispatch(Actions.fetchDetail(id));

    this._fetchSeeds();
    dispatch(fetchSeedsCount(id));

    this.interval = setInterval(() => {
      const item = this.props.items.find(i => i.id == id) || {};
      const _status = getStatus(item);
      if (_status != item.status) dispatch(Actions.updateItemStatus(id, _status));
    }, 1000);

    this.pullInterval = setInterval(() => {
      this._fetchSeeds();
      dispatch(fetchSeedsCount(id));
    }, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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

  render() {
    const {params: {id}, dispatch, seeds, currentUser } = this.props;
    const boundActionCreators = bindActionCreators(Actions, dispatch);
    const item = this.props.items.find(i => i.id == id) || {};
    const {
      td,
      fare,
      title,
      price,
      status,
      end_at,
      shop_id,
      winners,
      start_at,
      shop_name,
      ori_price,
      completes,
      image_urls,
      total_amount,
      shop_avatar_url,
      participant_count,
    } = item;

    let seedState = null;
    const validSeed = seeds.filter(seed => seed.status == 'pending' || seed.status == 'active');

    if (validSeed.length) {
      seedState = (<SpreadBar item_id={id} seeds={seeds} history={this.props.history} user={currentUser} {...boundActionCreators}/>);
    }

    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <Nav />
        <div className="page detail-page">
          <div className="detail-top">
            <div className="image-box">
              {Number(fare) == 0 && <img className="mailing-fee" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/038bffe812178917d1768b9b3d6481ce.png"/>}
              <Slider images={image_urls} auto />
            </div>
            <div className="info-top">
              <div className="start-end-wrap">
                <img className="wings" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/ad6e3e53e50da45b695fa77107fadeb7.png"/>
                <span className="start-end">{formatTime(start_at)} 至 {formatTime(end_at)}</span>
                <img className="wings" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/dd76c451418cab27154ff1c75d60f515.png"/>
              </div>
              <div className="table">
                <div className="cell logo">{+price}元购</div>
                <div className="cell">
                  <div><s>￥{ori_price}</s></div>
                  <div>{completes >= 0 && `出售${completes}`}</div>
                </div>
                <div className="cell right">
                  <div className="yellow">{statusDescs(status, true)}</div>
                  {status == 'started' && <CountDown td={td} time={end_at}/>}
                  {(status == 'wait' || status == 'waiting') && <CountDown td={td} time={start_at}/>}
                </div>
              </div>
            </div>

            <div className="info-main">
              <div className="table">
                <div className="cell title">{title}</div>
                <div className="cell min">
                  <div>剩余库存</div>
                  <div>{total_amount - positiveNumber(completes)}</div>
                </div>
                <div className="cell min">
                  <div>参与人数</div>
                  <div>{participant_count + completes}</div>
                </div>
              </div>
            </div>
            {Number(fare) == 0 && <div className="mailing-fee-text"><span>该商品免运费</span></div>}
          </div>

          {winners && winners.length > 0 ? <Winners item={item} /> : null}
          <a className="shop" href={`/goshop/${shop_id}`}>
            <img className="avatar" src={shop_avatar_url}/>
            <span>{shop_name}</span>
          </a>
          {__QR_CODE__ && <img className="dr-img" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100193/6b4bfbba51112dffcf9915d82cd098d7.jpg" alt="dr"/>}
          {__QR_CODE__ && <div className="dr-text">长按二维码关注更多优惠!</div>}
        </div>
        <div className="action-bars">
          <StatusBar id={id} className="btn" {...item} {...boundActionCreators}/>
          {seedState}
        </div>
      </div>
    );
  }
}

DetailPage.propTypes = {
  items: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    items: state.list.items,
    seeds: state.seed.seeds,
    currentUser: state.user.currentUser
  };
}

export default connect(mapStateToProps)(DetailPage);


// avatar_urls: Array[1]
// category_name: "孕妇奶粉"
// completes: -3
// cover_urls: Array[1]
// created_at: "1452672093"
// description: "1111111"
// end_at: 1452861713000
// id: 84
// image_urls: Array[1]
// item_id: "206"
// item_status: "end"
// max_executies: "1"
// one_money_id: "11"
// ori_price: "162.0"
// participant_count: 3
// price: "1.0"
// quantity: "1"
// shop_avatar_url: "http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/100118/0350a3dc85f46fecea16e23365cb05c3.jpg!avatar"
// shop_category_name: "伊利奶粉"
// shop_id: "100118"
// shop_name: "伊利专卖店"
// start_at: 1452845136000
// status: "end"
// td: 62.650146484375
// title: "托菲儿婴儿配方奶粉3段适用405g听"
// total_amount: "213"
// updated_at: "1452688724"
// winner_count: 3
