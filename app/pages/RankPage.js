import React, { Component } from 'react';
import DRCode from '../components/DRCode';
import Constants from '../constants';
import { connect } from 'react-redux';
import Loading from 'halogen/ScaleLoader';
import PartyList from '../components/PartyList';
import { fetchRankPageData } from '../actions/rank';

export default class RankPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDRText: false,
      partyPage: 1,
      partyPer: 10
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { partyPer, partyPage } = this.state;
    dispatch(fetchRankPageData(partyPage, partyPer));
  }

  onScroll(e) {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if (scrollTop + offsetHeight == scrollHeight) {
      this.setState({showDRText: true});
      this.loadNextPage();
    } else {
      this.setState({showDRText: false});
    }
  }

  loadNextPage() {
    const { rank: { listFetching, loadedPage }, dispatch } = this.props;
    const { partyPer } = this.state;

    if (listFetching) return;

    dispatch(fetchRankPageData(loadedPage + 1, partyPer));
  }

  render() {
    const { rank: { listFetching, parties } } = this.props;
    const { RANK_HEADER_IMG } = Constants;

    return (
      <div className="page-container rank-page">
        <div className="container">
          <div className="row">
            {Constants.QRCODE && <DRCode showText={this.state.showDRText}/>}
            {listFetching && <div className="loading-container"><Loading color="#FF280B" size="9px" margin="4px"/></div>}
          </div>
        </div>
        <div className="rank-page-container" onScroll={this.onScroll.bind(this)}>
          <div className="rank-container">
            <div className="container">
              <div className="row">
                <div className="rank-page-header">
                  <img src={RANK_HEADER_IMG} />
                </div>
                <div className="rank-page-body">
                  <PartyList parties={parties} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rank: state.rank,
    cakeList: state.cakeList
  };
}

export default connect(mapStateToProps)(RankPage);
