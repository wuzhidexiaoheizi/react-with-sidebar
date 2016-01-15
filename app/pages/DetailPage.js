import React, {Component} from 'react';
import {connect} from 'react-redux';
import StatusBar from '../components/StatusBar';
// import {diffTime} from '../helper';
// import {fetchItemDetail} from '../actions';


class DetailPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log('did');
    const {params: {id}, items, history} = this.props;
    const item = items.find(i => i.id == id);
    if (!item) {
      console.log('没有该活动');
      return history.pushState(null, '/list');
    }
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'CLEAN_DETAIL_DATA'});
  }

  render() {
    const {id} = this.props.params;
    console.log(id);
    // const index = this.props.items.findIndex(i => i.id == id);
    // const {image_urls} = this.props.items[index];
    return (
      <div className="page detail-page" onClick={() => console.log(this.props.detail.fetched, this.props.detail.name)}>
        <header className="detail-top">
          <img className="detail-imgs" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/1a147519bd2b1d9bebe7e3e7527869e3.jpg"/>
          <div className="info">
            <div className="table">
              <div className="cell">1元购</div>
              <div className="cell">
                <div>原价</div>
                <div>已卖</div>
                <div>{/* has_fetch_detail */}</div>
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

function mapStateToProps(state) {
  return {
    index: state.detail.index,
    items: state.list.items,
  };
}

export default connect(mapStateToProps)(DetailPage);
