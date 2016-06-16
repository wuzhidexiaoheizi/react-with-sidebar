import React, {Component} from 'react';
import DRCode from '../components/DRCode';

class ListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDRText: false
    };
  }

  onScroll(e) {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if (scrollTop + offsetHeight == scrollHeight) {
      this.setState({showDRText: true});
    } else {
      this.setState({showDRText: false});
    }
  }

  render() {
    return (
      <div className="page-container list-page-container">
        {__QR_CODE__ && <DRCode showText={this.state.showDRText}/>}

        <div className="list-page-container" onScroll={this.onScroll.bind(this)}>
          <div className="list-page" ref="list-page">
            <img className="list-poster" src={__LIST_IMG__}/>
            <ul className="list">
              生日蛋糕列表
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ListPage;
