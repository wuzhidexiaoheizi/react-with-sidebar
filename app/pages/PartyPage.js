import React, { Component } from 'react';
import Constants from '../constants';
import BlessPhase from '../components/BlessPhase';
import BlessDistribute from '../components/BlessDistribute';
import { fetchParty } from '../actions/party';
import { fetchBlessList } from '../actions/bless';
import { fetchCurrentUser } from '../actions/user';
import { connect } from 'react-redux';
import { formatDate, checkUserHasLogged } from '../helper';
import { bindActionCreators } from 'redux';
import * as PartyActions from '../actions/party';
import * as PresentActions from '../actions/virtualPresent';
import * as BlessActions from '../actions/bless';
import GiftGroup from '../components/GiftGroup';
import BlessGroup from '../components/BlessGroup';
import Loading from 'halogen/ScaleLoader';
import AvatarUpload from '../components/AvatarUpload';
import BulletCurtain from '../components/BulletCurtain';
import GiftAnimation from '../components/GiftAnimation';
import MusicPlayer from '../components/MusicPlayer';
import { Link } from 'react-router';
import audio from '../audios/1.mp3';
import BlessDispatcher from '../components/BlessDispatcher';

class PartyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPhaseModal: false,
      blessPer: 10,
      showAnimation: false,
      animation_name: '',
      rotate_status:true,
      animationName: '',
      earliestId: '',
      doneeName: ''
    };
  }

  componentDidMount() {
    const { params: {id}, dispatch } = this.props;
    const { blessPer } = this.state;

    dispatch(fetchCurrentUser());
    dispatch(fetchParty(id));
    dispatch(fetchBlessList(id, '', blessPer));
  }

  componentWillReceiveProps(nextProps) {
    if (window.location.href.indexOf('#showDistribute') > -1) {
      const blessDistribute = this.refs.blessDistribute;

      if (blessDistribute) blessDistribute.show();
    }

    if (!this.hasShowAnimated) {
      this.hasShowAnimated = true;
      this.lookupInAnimates();
    }

    const { party: { party }, user: { currentUser } } = this.props;
    const { user_id } = party;

    this.setState({ isCurrentUser: currentUser && user_id == currentUser.id });

    const { blessDispatcher } = this.refs;
    const { bless: { blesses } } = nextProps;
    const lastBlesses = this.props.bless.blesses;

    if (blesses != lastBlesses) {
      if (lastBlesses.length == 0) {
        blessDispatcher.insertAnimations(blesses);
      } else {
        const lastBless = lastBlesses[lastBlesses.length - 1];
        const index = blesses.indexOf(lastBless);

        if (index > -1) {
          const newBlesses = blesses.slice(index, blesses.length - 1);
          blessDispatcher.insertAnimations(newBlesses);
        }
      }
    }
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

  hideAnimation() {
    this.setState({ showAnimation: false });
  }

  toggleBullet() {
    const { bulletScreen } = this.refs;

    bulletScreen.toggleShow();
  }

  showAnimation(doneeName, animationName) {
    this.setState({
      showAnimation: true,
      autoDismiss: false,
      doneeName,
      animationName,
    });
  }

  showAnimationWithCallback(doneeName, animationName, animationCallback) {
    this.setState({
      showAnimation: true,
      autoDismiss: true,
      doneeName,
      animationName,
      animationCallback,
    });
  }

  loadNextPageBlesses() {
    const { bless: { listFetching, earliestId } } = this.props;

    if (listFetching) return;

    const { blessPer } = this.state;
    const { params: {id}, dispatch } = this.props;

    dispatch(fetchBlessList(id, earliestId, blessPer));
  }

  lookupInAnimates() {
    const animates = ['heart', 'flower', 'car', 'teddy_bear', 'music_box', 'motor'];

    for (let i = 0; i < animates.length; i++) {
      this.lookupAnimate(animates[i]);
    }
  }

  lookupAnimate(animateName) {
    if (window.location.href.indexOf('#' + animateName) > -1) {
      return this.setState({ showAnimation: true, animateName });
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

  shouldPlayerRotation(){
    this.state.rotate_status ? this.setState({ rotate_status:false }) : this.setState({ rotate_status :true });
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
      showAnimation,
      animationName,
      autoDismiss,
      animationCallback,
      doneeName,
    } = this.state;

    const dateStr = formatDate(birth_day, 'yyyy年MM月dd日');
    const partyActionCreators = bindActionCreators(PartyActions, dispatch);
    const presentActionCreators = bindActionCreators(PresentActions, dispatch);
    const blessActionCreators = bindActionCreators(BlessActions, dispatch);

    const config = {
      color: '#fff',
      fontSize: '14px',
      speed: 20,
      lineSpacing: 4,
      trackCount: 5,
      loop: true,
    };

    const doneeField = 'sender:login';
    const animationNameField = 'virtual_present:name';
    const animationFlagField = 'id';
    const expireTime = Date.parse(birth_day) + 7 * 24 * 60 * 60 * 1000;

    return (
      <div className="page-container party-container">

        <div className="container-nano">
          <div className="container-content" onScroll={this.handleScroll.bind(this)}>
            <div className="container">
              <div className="row">
                <div className="party-header">
                  <img className="party-poster" src={PARTY_HEADER_IMG}/>
                  <AvatarUpload avatarUrl={person_avatar} partyId={partyId} isCurrentUser={isCurrentUser}
                    avatarMediaId={avatar_media_id} {...partyActionCreators} />
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
                </div>
                <div className="party-body">
                  <MusicPlayer resource={audio} status={this.state.rotate_status} onRotate={this.shouldPlayerRotation.bind(this)} />
                  <GiftGroup blesses={blesses} onShowAnimation={ this.showAnimation.bind(this) } />
                  <BlessGroup blesses={blesses} />
                </div>
                <div className="bullet-toggle">
                  <div className="button-container">
                    <div className="bullet-button" onClick={this.toggleBullet.bind(this)}>弹幕</div>
                  </div>
                </div>
                { <BulletCurtain config={config} ref="bulletScreen" bullets={blesses}
                    textFieldName="message"/>}
              </div>
            </div>
          </div>
          <div className="page-footer party-footer">
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

        { showAnimation && <GiftAnimation animationName={ animationName } onCloseAnimation={this.hideAnimation.bind(this)}
          autoDismiss={autoDismiss} animationCallback={animationCallback} doneeName={doneeName}/>}

        <BlessDispatcher playAnimation={this.showAnimationWithCallback.bind(this)}
          animationNameField={animationNameField} animationFlagField={animationFlagField}
          doneeField={doneeField} expireTime={expireTime} ref="blessDispatcher"/>
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
  };
}

export default connect(mapStateToProps)(PartyPage);
