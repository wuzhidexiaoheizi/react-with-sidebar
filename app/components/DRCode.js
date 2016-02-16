import React, {Component} from 'react';
import TransitionGroup from 'react-addons-css-transition-group';

export default class DRCode extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.showText != this.props.showText;
  }

  render() {
    return (
      <div className="dr-container">
        <TransitionGroup transitionName="left" component="div" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {this.props.showText && <div className="dr-text" key="drcode-text">关注更多优惠惊喜!</div>}
        </TransitionGroup>
        <img className="dr-img" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100193/6b4bfbba51112dffcf9915d82cd098d7.jpg" alt="dr"/>
      </div>
    );
  }
}

DRCode.defaultProps = {
  showText: false,
};
