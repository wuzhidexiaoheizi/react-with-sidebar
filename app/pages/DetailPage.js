import React, {Component} from 'react';
import {connect} from 'react-redux';
import StatusBar from '../components/StatusBar';
import {statusDescs} from '../helper';
import {fetchDetail} from '../actions';

class DetailPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {params: {id}, dispatch} = this.props;
    dispatch(fetchDetail(id));
    this.interval = setInterval(this._interval.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {params: {id}} = this.props;
    const {price, ori_price, image_urls, status} = this.props.detail[id] || {};

    return (
      <div className="page detail-page">
        <header className="detail-top">
          <img className="detail-imgs" src={image_urls && image_urls[0]}/>
          <div className="info">
            <div className="table">
              <div className="cell logo">{+price}元购</div>
              <div className="cell">
                <div><s>{ori_price}</s></div>
                <div>已卖</div>
              </div>
              <div className="cell right">
                <div>{statusDescs(status, true)}</div>
                {this.state.countTime}
              </div>
            </div>
          </div>
        </header>
        <StatusBar className="btn" status={status}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    detail: state.detail,
  };
}

export default connect(mapStateToProps)(DetailPage);
