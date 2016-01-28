import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {_fetch} from '../helper';
// import Nav from '../components/Nav';
// import Slider from '../components/Slider';
// import Star from '../components/Star';

class SharePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      image_urls: [],
      thumbers: [],
      thumbers_count: 0,
    };
  }

  componentDidMount() {
    const {params: {evaluation_id}} = this.props;
    _fetch(`/evaluations/${evaluation_id}`)
    .then(json => {
      this.setState(Object.assign({}, this.state, json));
    });
  }

  handleLike(e) {
    const $target = e.currentTarget;
    const classArr = $target.className.replace(/shake/, '').trim().split(' ');
    $target.className = classArr.join(' ');
    classArr.push('shake');
    setTimeout(() => $target.className = classArr.join(' '), 10);

    const {params: {evaluation_id}} = this.props;
    const {dispatch} = this.props;

    _fetch(`/evaluations/${evaluation_id}/thumb`, 'post')
    .then(json => {
      if (json.errors) {
        dispatch({
          type: 'THUMB_FAILED',
          message: json.errors.replace(/Thumber/, ''),
        });
      } else {
        this.setState({
          thumbers: this.state.thumbers.concat([json]),
          thumbers_count: this.state.thumbers_count + 1,
        });
      }
    }).catch(err => {
      if (err.message == 401) dispatch({type: 'NOT_SIGN_UP', pathHash: location.hash});
    });
  }

  render() {
    const {desc, image_urls, pmo_item_id, user_nickname, user_avatar, thumbers_count, thumbers} = this.state;
    return (
      <div className="page share-page">
        {/* <Nav /> */}
        <div className="comment-top">
          <img className="background" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop_category/image/b1ec8fd9fc5b559e2e96f89c61d6f900.jpg"/>
          <img className="avatar" src={user_avatar}/>
        </div>
        <div className="comment-text">
          <p className="awardee-name"><b>{user_nickname}</b> 获奖感言</p>
          <div className="textarea-wrap">
            <div className="award-comment">{desc}</div>
          </div>
        </div>
        {/*
        <div>
          <Star name="good" disable="true" num={5} rating={good} caption="产品评价"/>
          <Star name="delivery" disable="true" num={5} rating={delivery} caption="服务评价"/>
          <Star name="customer_service" disable="true" num={5} rating={customer_service} caption="快递评价"/>
        </div>
        */}
        <div className="share-product">
          <div className="share-product-pic">
            <Link to={`/detail/${pmo_item_id}`} className="product-pic">
              {/* <Slider images={image_urls}/> */}
              <img className="product-cover" src={image_urls[0]}/>
              {/* <div className="sales-border">
                <img className="sales-pic" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/73be4db79919ba98fc1f9992d5d8c4d8.jpg" />
              </div> */}
            </Link>
          </div>
        </div>
        <div className="shark-like">
          <div className="share-button" onClick={this.handleLike.bind(this)}>
            <button className="like-btn">
              <img src="http://wanliu-piano.b0.upaiyun.com/uploads/shop_category/image/1618012d32fb4fe1ec123c38d836b503.png" />
              <span className="like-amount">{thumbers_count}</span>
            </button>
          </div>
          <div className="share-count">
            <span className="amount">{thumbers_count}</span>人觉得很赞
          </div>
        </div>
        <div className="share-list-container">
          <div className="share-list" ref="itemContainer">
          {
            thumbers.map((thumb, index) => {
              return (
                <div className="like-item" key={`thumber-${index}`}>
                  <img src={thumb.avatar}/>
                </div>
              );
            })
          }
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(SharePage);
