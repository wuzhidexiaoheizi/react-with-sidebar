import React, { Component } from 'react';
import Constants from '../constants';
import BlessPhase from '../components/BlessPhase';
import BlessDistribute from '../components/BlessDistribute';
import { fetchParty } from '../actions/party';
import { fetchBlessList } from '../actions/bless';
import { fetchCurrentUser } from '../actions/user';
import { connect } from 'react-redux';
import { formatDate, checkUserHasLogged, updateDocumentTitle, _fetch } from '../helper';
import { bindActionCreators } from 'redux';
import * as PartyActions from '../actions/party';
import * as PresentActions from '../actions/virtualPresent';
import * as BlessActions from '../actions/bless';
import BlessGroup from '../components/BlessGroup';
import Loading from 'halogen/ScaleLoader';
import AvatarUpload from '../components/AvatarUpload';
import BulletCurtain from '../components/BulletCurtain';
import MusicPlayer from '../components/MusicPlayer';
import { Link } from 'react-router';
import { checkPresentIsForbidden } from '../actions/virtualPresent';
import MusicDispatcher from '../prototypes/MusicDispatcher';
import PartyCard from '../components/PartyCard';
import BlessCommand from '../prototypes/BlessCommand';
import lovePNG from '../images/love.png';

const WEIXIN_CONFIG = 'wexin_config';

class PartyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPhaseModal: false,
      blessPer: 30,
      rotate_status: true,
      earliestId: '',
      showBullet: false,
      showBulletToggle: false,
      playOnAdded: true,
      showCard: false,
    };
  }

  componentDidMount() {
    const { params: { id }, dispatch } = this.props;
    const { blessPer } = this.state;

    this.blessId = this.extractBlessId();

    // 请求资源
    dispatch(fetchCurrentUser());
    dispatch(fetchParty(id, {
      loadCake: true,
      callback: (party) => {
        const { birthday_person } = party;
        const title = `${birthday_person}的生日趴`;
        this.updateTitle(title);
      }
    }));
    dispatch(fetchBlessList(id, '', blessPer));

    this.prepareWeixinResource();

    const { blessDistribute } = this.refs;

    if (window.location.href.indexOf('#showDistribute') > -1) {
      blessDistribute.show();
    }

    this.prepareBlessCommand();
  }

  componentWillReceiveProps(nextProps) {
    const { hash } = window.location;

    if (hash.indexOf('/party') == -1) return;

    const {
      party: { party },
      user: { currentUser },
      bless: { blesses },
    } = nextProps;

    const { user_id, birth_day, hearts_limit } = party;

    const isCurrentUser = currentUser && user_id == currentUser.id;

    this.setState({ isCurrentUser });

    const showDistribute = window.location.href.indexOf('#showDistribute') > -1;

    if (!showDistribute && !this.blessId && !this.hasLoadCard) {
      this.hasLoadCard = true;
      this.setState({ showCard: true });
    }

    if (this.command) {
      const birthday = Date.parse(birth_day);

      if (!isNaN(birthday) && !this.hasSetExpireTime) {
        this.hasSetExpireTime = true;
        const expireTime = birthday + 2 * 7 * 24 * 60 * 60 * 1000;
        this.command.updateExpireTime(expireTime);
      }

      if (hearts_limit && !this.hasSetProgressInitTotal) {
        this.hasSetProgressInitTotal = true;
        this.command.updateProgressTotal(+hearts_limit);
      }

      this.command.addBlesses(blesses);
    }

    if (!this.blessId) return;

    const ownBless = blesses.find(b => b.id == this.blessId);

    if (ownBless && !this.hasShowAnimation) {
      this.hasShowAnimation = true;
      this.showDistributedBless(ownBless);
    }
  }

  componentWillUnmount() {
    if (this.command) {
      this.command.destroy();
      this.command = null;
    }

    const dispatcher = MusicDispatcher.getInstance();
    if (dispatcher) dispatcher.destroy();
  }

  getWeixinConfig() {
    const { DOMAIN, WEIXIN_API_SIGNATURE_URL } = Constants;
    const href = window.location.href;
    const query = `?url=${encodeURIComponent(href)}`;
    const url = `${DOMAIN}${WEIXIN_API_SIGNATURE_URL}${query}`;

    _fetch(url)
      .then(json => {
        localStorage.setItem(WEIXIN_CONFIG, JSON.stringify(json));

        this.initWeixinConfig(json);
      });
  }

  prepareWeixinResource() {
    if (!this.isWeixin()) return;

    let isExpire;
    const config = JSON.parse(localStorage.getItem(WEIXIN_CONFIG) || '{}');

    if (!window.hasEntered) {
      isExpire = true;
      window.hasEntered = true;
    } else {
      isExpire = config && config.expired_at ? config.expired_at < Date.now() : true;
    }

    if (isExpire) {
      this.getWeixinConfig();
    } else {
      this.initWeixinConfig(config);
    }
  }

  prepareBlessCommand() {
    const blessFlagField = 'id';
    const { playOnAdded } = this.state;
    const checkPresent = this.checkIfExist.bind(this);

    const config = {
      blessFlagField,
      playOnAdded,
      checkPresent,
    };

    this.command = new BlessCommand(config);
  }

  isWeixin() {
    const ua = window.navigator.userAgent.toLowerCase();

    return ua.match(/MicroMessenger/i) == 'micromessenger';
  }

  initWeixinConfig(config) {
    const { appId, timestamp, nonceStr, signature} = config;
    const { WEIXIN_JS_API_LIST } = Constants;

    if (window.wx) {
      window.wx.ready(() => {
        const { party: { party }, cakeList: { cakeItems } } = this.props;
        const { cake_id, birthday_person, message } = party;
        const cake = cakeItems.find(cakeItem => cakeItem.id == cake_id) || {};
        const { cover_url } = cake;
        const title = `欢迎参加${birthday_person}的生日趴`;
        this.initShareConfig(title, message, cover_url);
      });

      window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名，见附录1
        jsApiList: WEIXIN_JS_API_LIST // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    }
  }

  initShareConfig(title, desc, avatar) {
    const { DONEE_DEFAULT_AVATAR } = Constants;
    const config = {
      title: title || '生日趴', // 分享标题
      desc: desc || '这是生日趴', // 分享描述
      link: window.location.href, // 分享链接
      imgUrl: avatar || DONEE_DEFAULT_AVATAR, // 分享图标
    };

    window.wx.onMenuShareAppMessage(config);
    window.wx.onMenuShareTimeline(config);
  }

  updateTitle(title) {
    updateDocumentTitle(title);
  }

  openPhaseModal() {
    const { isCurrentUser } = this.state;

    if (isCurrentUser) {
      this.setState({ showPhaseModal: true });
    }
  }

  openPresentModal() {
    const blessDistribute = this.refs.blessDistribute;

    blessDistribute.show();
  }

  closePhaseModal() {
    this.setState({ showPhaseModal: false });
  }

  closePresentModal() {
    const blessDistribute = this.refs.blessDistribute;

    blessDistribute.hide();
  }

  handleScroll(e) {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if (scrollTop + offsetHeight == scrollHeight) {
      this.loadNextPageBlesses();
    }
  }

  hidePartyCard() {
    this.setState({ showCard: false }, () => {
      this.command.playUnplayedBlesses();
    });
  }

  toggleBullet() {
    const { bulletScreen } = this.refs;
    let { showBullet } = this.state;
    showBullet = !showBullet;

    this.setState({ showBullet: showBullet });
    bulletScreen.toggleShow(showBullet);
  }

  showAllAnimations() {
    this.command.replayBlessGroup();
  }

  checkIfExist(animationName, callback) {
    const { virtualPresent: { forbidPresentNames }, dispatch } = this.props;

    if (forbidPresentNames.indexOf(animationName) > -1) {
      callback(false);
    } else {
      dispatch(checkPresentIsForbidden(animationName, callback));
    }
  }

  skipAnimations() {
    this.command.skipAnimations();
  }

  showBulletToggle() {
    this.setState({ showBulletToggle: true });
  }

  loadNextPageBlesses() {
    const { bless: { listFetching, earliestId } } = this.props;

    if (listFetching) return;

    const { blessPer } = this.state;
    const { params: {id}, dispatch } = this.props;

    dispatch(fetchBlessList(id, earliestId, blessPer));
  }

  extractBlessId() {
    const href = window.location.href;
    const prefix = '#bless:';
    let index = href.indexOf(prefix);

    if (index == -1) return null;

    const str = href.slice(index + prefix.length);
    index = str.indexOf('#');

    return str.slice(0, index);
  }

  showDistributedBless(bless) {
    const { virtual_present: { name } } = bless;

    this.checkIfExist(name, (isValid) => {
      /*eslint-disable */
      new GiftAnimation(bless, isValid, true);
      /*eslint-enable */
    });
  }

  giveBless() {
    const { DOMAIN, USER_SIGNIN_URL } = Constants;
    let callback = window.location.href;

    if (callback.indexOf('#showDistribute') == -1) {
      callback = `${callback}#showDistribute`;
    }

    checkUserHasLogged(this.openPresentModal.bind(this), () => {
      window.location.href = `${DOMAIN}${USER_SIGNIN_URL}?callback=${callback}&goto_one_money=true`;
    });
  }

  shouldPlayerRotation() {
    const { rotate_status } = this.state;

    this.setState({ rotate_status: !rotate_status });
  }

  render() {
    const { PARTY_HEADER_IMG } = Constants;
    const {
      party: { party },
      virtualPresent: { presents },
      bless: { blesses, listFetching },
      user: { currentUser },
      cakeList: { cakeItems },
      dispatch,
      params,
    } = this.props;

    const partyId = params.id;
    const {
      id,
      birth_day,
      message,
      person_avatar,
      avatar_media_id,
      birthday_person,
      cake_id,
      hearts_count,
    } = party;

    const cakeItem = cakeItems.find(cake => cake.id == cake_id) || {};
    const {
      cover_url,
      income_price,
      title,
      hearts_limit,
    } = cakeItem;

    const remaind_count = hearts_limit - hearts_count;

    const {
      isCurrentUser,
      showPhaseModal,
      showAnimationCloseBtn,
      showBullet,
      showBulletToggle,
      showCard,
    } = this.state;

    const invited = currentUser ? currentUser.nickname : null;
    const dateStr = formatDate(birth_day, 'yyyy年MM月dd日');
    const partyActionCreators = bindActionCreators(PartyActions, dispatch);
    const presentActionCreators = bindActionCreators(PresentActions, dispatch);
    const blessActionCreators = bindActionCreators(BlessActions, dispatch);
    const klass = showBullet ? '' : 'closed';

    const bulletConfig = {
      color: '#fff',
      fontSize: '18px',
      fontWeight: '700',
      speed: 2,
      lineSpacing: 4,
      trackCount: 5,
      loop: true,
      stopOnHover: false,
    };

    return (
      <div className="page-container party-container" ref="animationContainer">
        <div className="container-nano">
          <div className="container-content" onScroll={this.handleScroll.bind(this)}>
            <div className="container">
              <div className="row">
                <div className="party-header">
                  <img className="party-poster" src={PARTY_HEADER_IMG} onLoad={this.showBulletToggle.bind(this)} />
                  <AvatarUpload avatarUrl={person_avatar} partyId={partyId} isCurrentUser={isCurrentUser}
                    avatarMediaId={avatar_media_id} {...partyActionCreators}
                    showAnimations={this.showAllAnimations.bind(this)} />
                  <div className="birthday-bless" onClick={this.openPhaseModal.bind(this)}>
                    <div className="birthday">
                      <div className="sentence text-ellipsis">
                        { dateStr }
                      </div>
                    </div>
                    <div className="bless">
                      <div className="sentence text-ellipsis">
                        { message }
                      </div>
                    </div>
                  </div>
                  { showBulletToggle &&
                    <div className="bullet-toggle-container">
                      <div className="toggle-container">
                        <div className={`bullet-toggle ${klass}`} onClick={this.toggleBullet.bind(this)}>
                          <div className="toggle-track"></div>
                          <div className="bullet-button">弹幕</div>
                        </div>
                      </div>
                    </div>
                  }
                  <MusicPlayer status={this.state.rotate_status} onRotate={this.shouldPlayerRotation.bind(this)} />
                  { <BulletCurtain config={bulletConfig} ref="bulletScreen" bullets={blesses}
                    textFieldName="message" showBullet={showBullet} />}
                </div>
                <div className="party-body">
                  <Link to={`/detail/${cake_id}`} className="cake-link">
                    <div className="cake-detail clearfix">
                      <div className="cake-image">
                        <img src={cover_url} />
                      </div>
                      <div className="cake-other">
                        <div className="cake-title text-ellipsis">{title}</div>
                        <div className="cake-price">&#165;{income_price}</div>
                        <div className="remain-amount">
                          还剩{remaind_count}个返现
                          <img src={lovePNG} className="heart-png" />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="gift-group">
                    <div className="party-gnh">
                      <div className="clearfix labels">
                        <div className="gnh-label">幸福值</div>
                        <div className="withdraw-label">返现金</div>
                      </div>
                      <div className="gnh-progress">
                        <div className="progress-bar" style={{ width: '0%' }}></div>
                      </div>
                      <div className="clearfix values">
                        <div className="gnh-value">0</div>
                        <div className="withdraw-value">￥0.00</div>
                      </div>
                    </div>
                    <div className="gift-wrap">
                      {/**
                      <div className="gift-desc" onClick={this.showAllAnimations.bind(this)}>
                        已收到的礼物（点击可播放动画）
                      </div>
                      */}
                      <div className="gift-list" ref="giftList"></div>
                    </div>
                  </div>
                  <BlessGroup blesses={blesses} />
                </div>
              </div>
            </div>
          </div>
          <div className="page-footer party-footer" ref="pageFooter">
            <div className="container">
              <div className="row">
                <div className="party-actions">
                  <div className="give-bless" onClick={this.giveBless.bind(this)}>
                    我要送祝福
                  </div>
                  { isCurrentUser &&
                    <Link to={`/review/${partyId}`} className="goto-review">
                      查看详情
                    </Link>
                  }
                </div>
              </div>
            </div>
            { listFetching &&
              <div className="loading-container"><Loading color="#FF280B" size="9px" /></div>
            }
          </div>
        </div>

        { showPhaseModal && <BlessPhase onClose={this.closePhaseModal.bind(this)}
          partyId={id} message={message} {...partyActionCreators} /> }

        <BlessDistribute onClose={this.closePresentModal.bind(this)}
          partyId={id} presents={presents} {...presentActionCreators}
          {...blessActionCreators} ref="blessDistribute" />

        { showAnimationCloseBtn &&
          <div className="animation-toggle">
            <div className="toggle-container">
              <div className="toggle-btn" onClick={this.skipAnimations.bind(this)}>跳过动画</div>
            </div>
          </div>
        }

        { showCard &&
          <PartyCard avatar={person_avatar}
            person={birthday_person}
            onClose={this.hidePartyCard.bind(this)}
            invited={invited}
          />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    party: state.party,
    bless: state.bless,
    virtualPresent: state.virtualPresent,
    user: state.user,
    cakeList: state.cakeList,
  };
}

export default connect(mapStateToProps)(PartyPage);
