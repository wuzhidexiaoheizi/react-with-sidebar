import React, {Component} from 'react';

export default class extends Component {
  handleClick() {
    const { fetchGrab, id, seeds, history } = this.props;
    const activeSeed = seeds.find(seed => seed.status == 'active');

    if (activeSeed) {
      fetchGrab(id, activeSeed.id);
    } else {
      history.pushState(null, '/spread');
    }
  }

  render() {
    const { seeds } = this.props;
    const activeSeed = seeds.find(seed => seed.status == 'active');
    let klass = 'grab-more';
    let desc = '还想再抢';

    if (activeSeed) {
      klass = 'grab-again';
      desc = '再次抢购';
    }

    return (
      <div className={`spread-bar ${klass}`} onClick={this.handleClick.bind(this)}>
        <div className="spread-text">{desc}</div>
      </div>
    );
  }
}
