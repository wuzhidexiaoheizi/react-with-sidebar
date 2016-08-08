import React, { Component } from 'react';

export default class GuideStep extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item: { image, description } } = this.props;

    return (
      <div className="guide-step">
        <div className="guide-image">
          <img src={image} />
        </div>
        <div className="guide-desc">
          {description}
        </div>
      </div>
    );
  }
}
