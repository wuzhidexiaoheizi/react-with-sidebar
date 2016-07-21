import React, {Component} from 'react';
import Slider from '../components/Slider';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import { fetchParty } from '../actions/party';
import { fetchBlessList } from '../actions/bless';
import { fetchCurrentUser } from '../actions/user';
import lovePNG from '../images/love.png';
import ReviewGroup from '../components/ReviewGroup';
import Loading from 'halogen/ScaleLoader';
import Constants from '../constants';
import Envelope from '../components/Envelope';

export default class ReviewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blessPer: 10,
      earliestId: '',
      showEnvelope: false,
    };
  }

  componentDidMount() {
    const { params: { id }, dispatch } = this.props;
    const { blessPer, earliestId } = this.state;

    dispatch(fetchCurrentUser());
    dispatch(fetchBlessList(id, earliestId, blessPer));
    dispatch(fetchParty(id, true));
  }

  onScrollStart() {
    const { envelope } = this.refs;
    envelope.style.right = '-50px';
    envelope.style.opacity = 0.6;
  }

  onScrollEnd() {
    const { envelope } = this.refs;
    envelope.style.right = 0;
    envelope.style.opacity = 1.0;
    this.scrollIsStart = false;
  }

  loadNextPageBlesses() {
    const { bless: { listFetching, earliestId } } = this.props;

    if (listFetching) return;

    const { blessPer } = this.state;
    const { params: {id}, dispatch } = this.props;

    dispatch(fetchBlessList(id, earliestId, blessPer));
  }

  handleScroll(e) {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if (scrollTop + offsetHeight == scrollHeight) {
      this.loadNextPageBlesses();
    }

    const { envelope } = this.refs;

    if (!envelope) return;

    if (!this.scrollIsStart) {
      this.scrollIsStart = true;
      this.onScrollStart();
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(this.onScrollEnd.bind(this), 500);
  }

  showEnvelope() {
    this.setState({ showEnvelope: true });
  }

  hideEnvelope() {
    this.setState({ showEnvelope: false });
  }

  render() {
    const {
      party: { party },
      cakeList: { cakeItems },
      bless: { total, blesses, listFetching },
      user: { currentUser },
      params: { id },
    } = this.props;

    const {
      cake_id,
      withdrawable,
      withdrew,
      withdraw_url,
      user_id,
    } = party;
    const cakeItem = cakeItems.find(item => item.id == cake_id) || {};
    const {
      title,
      income_price,
      public_price,
      hearts_limit,
      cover_url,
    } = cakeItem;
    const price = +income_price - +withdrawable;
    const images = cover_url ? [ cover_url ] : [];
    const { ENVELOPE_SM_IMG } = Constants;
    const shouldShowEntrance = currentUser && currentUser.id == user_id;

    return (
      <div className="page-container review-container">
        <div className="container-nano">
          <div className="container-content" onScroll={this.handleScroll.bind(this)}>
            <div className="container">
              <div className="row">
                <div className="review-header">
                  <div className="item-posters">
                    { images.length > 0 && <Slider images={images} auto /> }
                  </div>
                  <div className="item-detail-info">
                    <div className="media">
                      <div className="media-left media-middle">
                        <span className="sales-price">{price}元</span>
                        <span className="price-amount">
                          <span className="cashback">可返现金&#165;{withdrawable}元</span>
                        </span>
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
                        <p className="align-center">售价</p>
                        <p className="align-center">&#165;{income_price}</p>
                      </div>
                      <div className="media-right media-middle">
                        <p className="align-center">原价</p>
                        <p className="align-center"><s>&#165;{public_price}</s></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="review-body">
                  <div className="review-summary">
                    已有<span className="benefactor-count">{total}</span>人次送出祝福
                  </div>
                  <div className="review-list">
                    <div className="review-list-header">
                      <div className="header-col">好友</div>
                      <div className="header-col">返现金额</div>
                      <div className="header-col">礼物</div>
                    </div>
                    <ReviewGroup blesses={blesses} />
                  </div>
                </div>
                { shouldShowEntrance &&
                  <div className="envelope-entrance" ref="envelope" onClick={this.showEnvelope.bind(this)}>
                    <img src={ENVELOPE_SM_IMG} />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="page-footer review-footer">
          <div className="container">
            <div className="row">
              <Link to={`/party/${id}`}>
                <div className="goto-party">返回生日趴</div>
              </Link>
            </div>
          </div>
          { listFetching &&
            <div className="loading-container"><Loading color="#FF280B" size="9px" /></div>
          }
        </div>
        { this.state.showEnvelope && <Envelope withdrew={withdrew} withdrawable={withdrawable}
          cakeImage={cover_url} withdrawUrl={withdraw_url} onClose={this.hideEnvelope.bind(this)} /> }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    party: state.party,
    bless: state.bless,
    cakeList: state.cakeList,
    user: state.user
  };
}

export default connect(mapStateToProps)(ReviewPage);
