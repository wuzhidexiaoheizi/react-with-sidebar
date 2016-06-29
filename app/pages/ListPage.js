import React, { Component } from 'react';
import DRCode from '../components/DRCode';
import { fetchCakeList } from '../actions/cakeList';
import { connect } from 'react-redux';
import Loading from 'halogen/ScaleLoader';
import Constants from '../constants';
import CakeGroup from '../components/CakeGroup';

class ListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDRText: false,
      cakePer: 10,
      cakePage: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { cakePage, cakePer } = this.state;
    dispatch(fetchCakeList(cakePage, cakePer));
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
    const { cakeList: { listFetching, loadedPage }, dispatch } = this.props;
    const { cakePer } = this.state;

    if (listFetching) return;

    dispatch(fetchCakeList(loadedPage + 1, cakePer));
  }

  render() {
    const { cakeList: { listFetching, cakeItems } } = this.props;

    return (
      <div className="page-container list-container">
        <div className="container">
          <div className="row">
            {Constants.QRCODE && <DRCode showText={this.state.showDRText}/>}

            {listFetching && <div className="loading-container"><Loading color="#FF280B" size="9px" margin="4px"/></div>}
          </div>
        </div>

        <div className="list-page-container" onScroll={this.onScroll.bind(this)}>
          <div className="list-page" ref="list-page">
            <div className="container">
              <div className="row">
                <img className="list-poster" src={Constants.HEADER_IMG} />
                <CakeGroup cakeItems={cakeItems} />
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
    cakeList: state.cakeList
  };
}

export default connect(mapStateToProps)(ListPage);
