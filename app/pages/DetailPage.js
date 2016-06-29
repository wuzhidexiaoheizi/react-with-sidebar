import React, { Component } from 'react';
import Slider from '../components/Slider';
import BlessCard from '../components/BlessCard';
import { connect } from 'react-redux';
import { fethcCakeItem } from '../actions/cakeList';
import lovePNG from '../images/love.png';

class DetailPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showBlessCard: false
    };
  }

  componentDidMount() {
    const { params: {id}, dispatch } = this.props;

    dispatch(fethcCakeItem(id));
  }

  componentWillReceiveProps() {
    if (window.location.href.indexOf('showCard') > -1) this.setState({ showBlessCard: true });
  }

  showBlessCard() {
    this.setState({ showBlessCard: true });
  }

  hideBlessCard() {
    this.setState({ showBlessCard: false });
  }

  render() {
    const { cakeList: { cakeItems }, params: { id }, shop: { shops } } = this.props;
    const cakeItem = cakeItems.find(item => item.id == id) || {};

    const {
      income_price,
      public_price,
      hearts_limit,
      description,
      current_stock,
      cover_url,
      title,
      buyers,
      shop_id,
    } = cakeItem;

    let { saled_count } = cakeItem;

    if (typeof saled_count == 'undefined') saled_count = 0;
    const inventory = +current_stock - +saled_count;

    console.log('cover_url', cover_url);
    const images = cover_url ? [ cover_url ] : [];
    const buyerCount = buyers ? buyers.length : 0;
    const shop = shop_id ? shops.find(s => s.id == shop_id) : {};

    return (
      <div className="page-container detail-container">
        <div className="container-nano">
          <div className="container-content">
            <div className="container">
              <div className="row">
                <div className="detail-header">
                  <div className="detail-posters">
                    <Slider images={images} auto />
                  </div>
                  <div className="item-detail-info">
                    <div className="media">
                      <div className="media-left media-middle">
                        <div className="sales-price">{ income_price }元</div>
                        <div className="price-amount">
                          <div className="origin-price"><s>&#165;{ public_price }元</s></div>
                          <span className="saled-count">已售100件</span>
                        </div>
                      </div>
                      <div className="media-body media-middle">
                        <div className="favor-count">
                          赠{hearts_limit}个返现<img src={ lovePNG } />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item-brief">
                    <div className="media">
                      <div className="media-left media-middle">
                        <div className="item-title two-line-ellipsis">
                          { title }
                        </div>
                      </div>
                      <div className="media-body media-middle">
                        <p className="align-center">库存</p>
                        <p className="align-center">{ inventory }</p>
                      </div>
                      <div className="media-right media-middle">
                        <p className="align-center">已参与</p>
                        <p className="align-center">{ saled_count }</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="detail-body">
                  <div className="winner-container">
                    <div className="winner-summary">已有<span className="winner-count">{buyerCount}</span>人成功购买</div>
                    <div className="winner-list">
                      { buyerCount > 0 && buyers.map(buyer =>
                        <div className="winner" key={buyer.id}>
                          <img src={buyer.avatar_url} title={buyer.login} />
                        </div>
                      ) }
                    </div>
                  </div>
                  <div className="supplier-container">
                    <div className="shop-logo">
                      <img src={shop && shop.avatar_url} />
                    </div>
                    <div className="shop-sev">
                      <p className="shop-info">
                        供应商:&nbsp;{shop && shop.title}
                      </p>
                      <p className="slogan text-ellipsis">
                        地址:&nbsp;{shop && shop.location}
                      </p>
                    </div>
                  </div>
                  <div className="item-description">
                    { description }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-footer detail-actions">
          <div className="container">
            <div className="row">
              <div className="buy-now" onClick={this.showBlessCard.bind(this)}>
                立即抢购
              </div>
              { this.state.showBlessCard && <BlessCard cakeId={id} onClose={this.hideBlessCard.bind(this)}/> }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cakeList: state.cakeList,
    shop: state.shop,
  };
}

export default connect(mapStateToProps)(DetailPage);