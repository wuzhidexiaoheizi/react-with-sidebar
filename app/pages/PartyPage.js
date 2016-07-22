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
import BlessDispatcher from '../components/BlessDispatcher';
import { checkPresentIsForbidden } from '../actions/virtualPresent';
import GiftList from '../prototypes/GiftList';
import GiftAnimation from '../prototypes/GiftAnimation';
import Effect from '../prototypes/Effect';

const WEIXIN_CONFIG = 'wexin_config';

class PartyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPhaseModal: false,
      blessPer: 10,
      rotate_status: true,
      earliestId: '',
      showAnimationCloseBtn: false,
      showBullet: true,
      showBulletToggle: false,
      playOnAdded: true,
    };
  }

  componentDidMount() {
    const { params: {id}, bless: { blesses }, dispatch } = this.props;
    const { blessPer, playOnAdded } = this.state;

    dispatch(fetchCurrentUser());
    dispatch(fetchParty(id, { loadCake: true }));
    dispatch(fetchBlessList(id, '', blessPer));

    const { giftList, blessDispatcher } = this.refs;
    this.giftList = new GiftList(giftList, blesses, { playOnAdded, showAnimation: this.showAnimation.bind(this) });
    blessDispatcher.insertAnimations(blesses);

    if (!this.isWeixin()) return;

    const config = JSON.parse(localStorage.getItem(WEIXIN_CONFIG) || '{}');
    const isExpire = config && config.expired_at ? config.expired_at < Date.now() : true;

    if (isExpire) {
      this.getWeixinConfig();
    } else {
      this.initWeixinConfig(config);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (window.location.href.indexOf('#showDistribute') > -1) {
      const blessDistribute = this.refs.blessDistribute;

      if (blessDistribute) blessDistribute.show();
    }

    const { party: { party }, user: { currentUser }, cakeList: { cakeItems } } = nextProps;
    const { user_id, cake_id } = party;

    this.setState({ isCurrentUser: currentUser && user_id == currentUser.id });

    const cakeItem = cakeItems.find(item => item.id == cake_id);

    if (cakeItem && !this.hasSetTotal) {
      this.hasSetTotal = true;
      const { hearts_limit } = cakeItem;
      this.giftList.updateProgressTotal(hearts_limit);
    }

    const { bless: { blesses } } = nextProps;
    const lastBlesses = this.props.bless.blesses;

    this.onBlessChanged(blesses, lastBlesses);

    if (currentUser && !this.hasShowAnimation) {
      this.hasShowAnimation = true;
      this.lookupAnimationName();
    }
  }

  componentWillUnmount() {
    if (this.giftList) this.giftList.destroy();
  }

  onBlessChanged(blesses, lastBlesses) {
    const { blessDispatcher } = this.refs;

    if (blesses != lastBlesses) {
      if (lastBlesses.length == 0) {
        blessDispatcher.insertAnimations(blesses);
        this.giftList.insertNewBlesses(blesses);
      } else {
        const lastBless = lastBlesses[lastBlesses.length - 1];
        const index = blesses.indexOf(lastBless);

        if (index > -1) {
          const newBlesses = blesses.slice(index, blesses.length - 1);
          blessDispatcher.insertAnimations(newBlesses);
          this.giftList.insertNewBlesses(newBlesses);
        }
      }
    }
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

  isWeixin() {
    const ua = window.navigator.userAgent.toLowerCase();

    return ua.match(/MicroMessenger/i) == 'micromessenger';
  }

  initWeixinConfig(config) {
    const { appId, timestamp, nonceStr, signature} = config;
    const { WEIXIN_JS_API_LIST } = Constants;

    if (window.wx) {
      window.wx.ready(() => {
        const { party: { party } } = this.props;
        const { person_avatar, birthday_person, message } = party;
        const title = `欢迎参加${birthday_person}的生日趴`;
        this.initShareConfig(title, message, person_avatar);
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
    updateDocumentTitle('生日趴-' + title);
  }

  openPhaseModal() {
    const { isCurrentUser } = this.state;

    if (isCurrentUser) {
      this.setState({ showPhaseModal: true });
    }
  }

  openPresentModal() {
    const blessDistribute = this.refs.blessDistribute;

    if (blessDistribute) blessDistribute.show();
  }

  closePhaseModal() {
    this.setState({ showPhaseModal: false });
  }

  closePresentModal() {
    const blessDistribute = this.refs.blessDistribute;

    if (blessDistribute) blessDistribute.hide();
  }

  handleScroll(e) {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if (scrollTop + offsetHeight == scrollHeight) {
      this.loadNextPageBlesses();
    }
  }

  hideAnimationCloseBtn() {
    this.setState({ showAnimationCloseBtn: false });
  }

  hidePageFooter() {
    const { pageFooter } = this.refs;
    const { clientHeight } = pageFooter;

    /*eslint-disable */
    new Effect(pageFooter, { bottom: '-=' + clientHeight }, 'swing', '250ms');
    /*eslint-enable */
  }

  showPageFooter() {
    const { pageFooter } = this.refs;
    const { clientHeight } = pageFooter;

    /*eslint-disable */
    new Effect(pageFooter, { bottom: '+=' + clientHeight }, 'swing', '250ms');
    /*eslint-enable */
  }

  toggleBullet() {
    const { bulletScreen } = this.refs;
    const { showBullet } = this.state;

    this.setState({ showBullet: !showBullet });
    bulletScreen.toggleShow();
  }

  showAnimation(bless) {
    const { virtual_present: { name } } = bless;
    const { animationContainer } = this.refs;

    this.checkIfExist(name, (isValidAnimation) => {
      /*eslint-disable */
      new GiftAnimation(animationContainer, {
        autoDismiss: false,
        isValidAnimation,
        animationBlesses: [ bless ]
      });
      /*eslint-enable */
    });
  }

  showAnimationWithCallback(blesses, animationCallback) {
    const { virtual_present: { name } } = blesses[0];
    const { animationContainer } = this.refs;
    const animationFun = this.animateToGiftGroup.bind(this);

    this.checkIfExist(name, (isValidAnimation) => {
      /*eslint-disable */
      new GiftAnimation(animationContainer, {
        autoDismiss: true,
        animationBlesses: blesses,
        animationFun,
        isValidAnimation,
        animationCallback,
      });
      /*eslint-enable */
    });
  }

  showAllAnimations() {
    if (this.giftList) this.giftList.removeAllChildren();
    const { blessDispatcher } = this.refs;

    setTimeout(() => {
      blessDispatcher.displayAllAnimations();
    }, 1);
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
    const { blessDispatcher } = this.refs;
    blessDispatcher.skipAnimations();
  }

  showBulletToggle() {
    this.setState({ showBulletToggle: true });
  }

  displayAnimateCloseBtn() {
    this.setState({ showAnimationCloseBtn: true });
  }

  loadNextPageBlesses() {
    const { bless: { listFetching, earliestId } } = this.props;

    if (listFetching) return;

    const { blessPer } = this.state;
    const { params: {id}, dispatch } = this.props;

    dispatch(fetchBlessList(id, earliestId, blessPer));
  }

  lookupAnimationName() {
    const href = window.location.href;
    const prefix = '#animation:';
    let index = href.indexOf(prefix);

    if (index > -1) {
      const str = href.slice(index + prefix.length);
      index = str.indexOf('#');

      if (index > -1) {
        const animationName = str.slice(0, index);
        const { user: { currentUser: { nickname, username } } } = this.props;
        const doneeName = nickname || username;

        this.checkIfExist(animationName, () => {
          this.setState({
            showAnimation: true,
            autoDismiss: true,
            animationName,
            doneeName,
          });
        });
      }
    }
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

  animateToGiftGroup(element, bless, callback) {
    this.giftList.animateToList(element, bless, callback);
  }

  addItemToGiftList(bless) {
    this.giftList.insertBless(bless);
  }

  render() {
    const { PARTY_HEADER_IMG } = Constants;
    const {
      party: { party },
      virtualPresent: { presents },
      bless: { blesses, listFetching },
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
    } = party;

    const {
      isCurrentUser,
      showPhaseModal,
      showAnimationCloseBtn,
      showBullet,
      showBulletToggle,
      playOnAdded,
    } = this.state;

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

    const animationFlagField = 'id';
    const expireTime = Date.parse(birth_day) + 7 * 24 * 60 * 60 * 1000;
    const addBlessItem = this.addItemToGiftList.bind(this);
    const showPageFooter = this.showPageFooter.bind(this);
    const hidePageFooter = this.hidePageFooter.bind(this);
    const showCloseBtn = this.displayAnimateCloseBtn.bind(this);
    const hideCloseBtn = this.hideAnimationCloseBtn.bind(this);

    const animationConfig = {
      animationFlagField,
      expireTime,
      playOnAdded,
      addBlessItem,
      showPageFooter,
      hidePageFooter,
      showCloseBtn,
      hideCloseBtn,
    };

    const audio = 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/1.aac';

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
                  <MusicPlayer resource={audio} status={this.state.rotate_status} onRotate={this.shouldPlayerRotation.bind(this)} />
                  { <BulletCurtain config={bulletConfig} ref="bulletScreen" bullets={blesses}
                    textFieldName="message" />}
                </div>
                <div className="party-body">
                  {/* <GiftGroup blesses={blesses} onShowAnimation={ this.showAnimation.bind(this) } />*/}
                  <div className="gift-group">
                    <div className="gift-wrap">
                      <div className="gift-desc" onClick={this.showAllAnimations.bind(this)}>
                        已收到的礼物（点击可播放动画）
                      </div>
                      <div className="gift-list" ref="giftList"></div>
                    </div>
                  </div>
                  <BlessGroup blesses={blesses} onShowAnimation={ this.showAnimation.bind(this) } />
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

        <BlessDispatcher
          playAnimation={this.showAnimationWithCallback.bind(this)}
          config={animationConfig}
          ref="blessDispatcher"
        />

        { showAnimationCloseBtn &&
          <div className="animation-toggle">
            <div className="toggle-container">
              <div className="toggle-btn" onClick={this.skipAnimations.bind(this)}>跳过动画</div>
            </div>
          </div>
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
