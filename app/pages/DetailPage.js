import React, {Component} from 'react';
import {PropTypes} from 'react-router';
import {connect} from 'react-redux';
import StatusBar from '../components/StatusBar';
import {diffTime} from '../actions';


class DetailPage extends Component {
  constructor(props) {
    super(props);
  }

  countDownTime() {
    const {end_at} = this.props;
    console.log(diffTime(end_at));
  }
  render() {
    return (
      <div className="page detail-page" onClick={() => this.context.history.pushState(null, '/some/path')}>
        <header className="detail-top">
          <img className="detail-imgs" src="http://wanliu-piano.b0.upaiyun.com/uploads/item/images/04df3397996fd5bfdd55dfb1a575e66a.jpg"/>
          <div className="info">
            <div className="table">
              <div className="cell">1元购</div>
              <div className="cell">
                <div>原价</div>
                <div>已卖</div>
              </div>
              <div className="cell">
                <div>距离活动开始还有</div>
                <div>difftime</div>
              </div>
            </div>
          </div>
        </header>
        <main></main>
        <StatusBar className="btn"/>
      </div>
    );
  }
}

DetailPage.contextTypes = {history: PropTypes.history};

function mapStateToProps(state) {
  return {
    detail: state.home
  };
}

export default connect(mapStateToProps)(DetailPage);
