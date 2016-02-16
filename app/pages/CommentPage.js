import React, {Component} from 'react';
import {connect} from 'react-redux';
import {_fetch} from '../helper';
import Star from '../components/Star';

class CommentPage extends Component {
  constructor(props) {
    super(props);
    const defaultDesc = [
      '感谢CCTV,MTV,ETV, 感谢我的亲朋好友,经过多年等待,终于人品爆发了,谢谢大家分享我的好运!',
      '开心!!!收到抢来的东西,就是爽爽爽!!!谢谢大家!',
      '像我这样貌美如花,上天都眷恋如我一般的人品, 抢到就这么简单!',
      '一周才一次的机会,就让我抽中了, 这手气要与我所有认识的人分享, 等下我还要去买彩票!',
      '等了一周没有白等, 终于抢到了! 跟我一起分享我的幸运吧 ~',
    ];
    this.state = {
      name: '',
      desc: defaultDesc[Math.ceil(Math.random() * 5) - 1],
      good: 0,
      delivery: 0,
      customer_service: 0,
    };
  }

  componentDidMount() {
    _fetch(`/api/user`).then(json => {
      this.setState({
        avatar: json.image.url.replace(/!avatar/, ''),
        name: json.nickname,
      });
    });
  }

  handleSubmit() {
    const {params: {pmo_grab_id}, dispatch, history} = this.props;
    const {desc, good, delivery, customer_service} = this.state;

    if (!good || !delivery || !customer_service || !desc) {
      return dispatch({
        type: 'SUBMIT_COMMENT_FAILED',
        message: '请完善评论内容',
      });
    }

    const body = JSON.stringify({
      evaluation: {
        desc,
        good,
        delivery,
        pmo_grab_id,
        customer_service,
      }
    });

    _fetch(`/evaluations`, 'post', body)
    .then(json => {
      if (json.errors) {
        if (json.evaluation_id) {
          return dispatch({
            type: 'SUBMIT_COMMENT_FAILED',
            message: json.errors.join(','),
            evaluation_id: json.evaluation_id,
          });
        }
      }
      history.pushState(null, `/share/${json.evaluation.id}`);

      // 需要一个提示微信分享
      //
    })
    .catch(err => {
      if (err.message == 401) return dispatch({type: 'NOT_SIGN_UP'});
      dispatch({type: 'UNKNOW_ERROR', message: err});
    });
  }

  handleClickStar(name, rating) {
    this.setState({[name]: rating});
  }

  render() {
    const {params: {order_id}} = this.props;
    const {name, avatar, desc} = this.state;
    return (
      <div className="page comment-page">
        <div className="comment-top">
          <img className="background" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop_category/image/b1ec8fd9fc5b559e2e96f89c61d6f900.jpg"/>
          <img className="avatar" src={avatar}/>
        </div>
        <div className="comment-text">
          <p className="awardee-name"><b>{name}</b> 获奖感言</p>
          <div className="textarea-wrap">
            <textarea
              onFocus={e => e.target.select()}
              value={desc}
              placeholder="说点什么吧..."
              rows={4}
              className="award-comment"
              onChange={e => this.setState({desc: e.target.value})}/>
          </div>
        </div>

        <div className="comment-scores">
          <Star name="good" starClick={this.handleClickStar.bind(this)} num={5} caption="产品评价"/>
          <Star name="delivery" starClick={this.handleClickStar.bind(this)} num={5} caption="服务评价"/>
          <Star name="customer_service" starClick={this.handleClickStar.bind(this)} num={5} caption="快递评价"/>
          <span className="comment-btn" onClick={this.handleSubmit.bind(this)}>确认</span>
          <a className="comment-btn orange" href={`/orders/${order_id}`}>查看订单</a>
        </div>
      </div>
    );
  }
}

export default connect()(CommentPage);
