import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import StatusBar from '../components/StatusBar';
import Winners from '../components/Winners';
import CountDown from '../components/CountDown';
import {statusDescs, positiveNumber, getStatus} from '../helper';
import * as Actions from '../actions';
// import config from '../config';

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: '',
    };
  }
  componentDidMount() {
    const {params: {id}, dispatch} = this.props;
    dispatch(Actions.fetchDetail(id));

    this.interval = setInterval(() => {
      const item = this.props.items.find(i => i.id == id) || {};
      const {status, end_at, start_at, total_amount} = item;
      const _status = getStatus(item);

      if (total_amount < 1) {
        this.setState({countdown: <div>售罄</div>});
      } else if (_status == 'wait') {
        this.setState({countdown: <CountDown time={start_at}/>});
      } else if (_status == 'started') {
        this.setState({countdown: <CountDown time={end_at}/>});
      } else {
        this.setState({countdown: ''});
      }
      if (_status != status) dispatch(Actions.updateItemStatus(id, _status));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {params: {id}, dispatch} = this.props;
    const boundActionCreators = bindActionCreators(Actions, dispatch);
    const item = this.props.items.find(i => i.id == id) || {};
    const {
      title,
      price,
      status,
      winners,
      shop_name,
      ori_price,
      completes,
      image_urls,
      total_amount,
      shop_avatar_url,
      participant_count,
    } = item;

    return (
      <div>
        <div className="page detail-page">
          <div className="detail-top">
            <img className="detail-imgs" src={image_urls && image_urls[0]}/>
            <div className="info-top">
              <div className="start-end">
                <span className="wings"></span>
                <span>xxx</span>
                <span className="wings"></span>
              </div>
              <div className="table">
                <div className="cell logo">{+price}元购</div>
                <div className="cell">
                  <div><s>￥{ori_price}</s></div>
                  <div>已卖</div>
                </div>
                <div className="cell right">
                  <div className="yellow">{statusDescs(status, true)}</div>
                  {this.state.countdown}
                </div>
              </div>
            </div>
            <div className="info-main">
              <div className="table">
                <div className="cell title">{title}</div>
                <div className="cell min">
                  <div>活动库存</div>
                  <div>{total_amount - positiveNumber(completes)}</div>
                </div>
                <div className="cell min">
                  <div>参与人数</div>
                  <div>{participant_count}</div>
                </div>
              </div>
            </div>
          </div>
          {winners && winners.length > 0 ? <Winners winners={winners}/> : null}
          <div className="shop">
            <img className="avatar" src={shop_avatar_url}/>
            <span>{shop_name}</span>
          </div>
        </div>
        <StatusBar id={id} className="btn" {...item} {...boundActionCreators}/>
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
