import React, {Component} from 'react';
import {connect} from 'react-redux';
import {_fetch} from '../helper';
import Star from '../components/Star';

class CommentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      good: -1,
      delivery: -1,
      customer_service: -1,
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
      if (json.errors) return dispatch({type: 'SUBMIT_COMMENT_FAILED', message: json.errors.join(',')});
      history.pushState(null, `/share/${pmo_grab_id}`);
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
    const {name, avatar} = this.state;
    return (
      <div className="page comment-page">
        <div className="comment-top">
          <img className="background" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop_category/image/b1ec8fd9fc5b559e2e96f89c61d6f900.jpg"/>
          <img className="avatar" src={avatar}/>
        </div>
        <div className="comment-text">
          <p className="awardee-name"><b>{name}</b> 获奖感言</p>
          <div className="textarea-wrap">
            <textarea placeholder="说点什么吧..." rows={4} className="award-comment" onChange={e => this.setState({desc: e.target.value})}/>
          </div>
        </div>

        <div className="comment-scores">
          <Star name="good" starClick={this.handleClickStar.bind(this)} num={5} caption="产品评价"/>
          <Star name="delivery" starClick={this.handleClickStar.bind(this)} num={5} caption="服务评价"/>
          <Star name="customer_service" starClick={this.handleClickStar.bind(this)} num={5} caption="快递评价"/>
          <span className="comment-btn" onClick={this.handleSubmit.bind(this)}>确认</span>
        </div>
      </div>
    );
  }
}

export default connect()(CommentPage);
