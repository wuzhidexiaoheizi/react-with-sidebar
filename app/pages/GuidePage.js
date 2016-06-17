import React, {Component} from 'react';

export default class GuidePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDRText: false
    };
  }

  render() {
    return (
      <div className="guide-container">
        <div className="container">
          <div className="row">
            活动介绍页面
          </div>
        </div>
      </div>
    );
  }
}
