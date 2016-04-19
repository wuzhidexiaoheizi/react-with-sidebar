import React, {Component} from 'react';
import {connect} from 'react-redux';
import QRCode from 'qrcode.react';
import Welfare from '../components/Welfare';

class SpreadPage extends Component {
  render() {
    const { seeds } = this.props;
    const pendingSeed = seeds.find(seed => seed.status == 'pending');

    let qrcode = null;

    if (pendingSeed) {
      const url = `${location.origin + location.pathname}#/spread?fromSeed=${pendingSeed.id}`;
      qrcode = (<QRCode value={url} size="200" />);
    }

    return (
      <div className="spread-page">
        <div className="qrcode-container">
          {qrcode}
        </div>
        <div className="spread-status">
          <Welfare seeds={seeds} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    seeds: state.seed.seeds
  };
}

export default connect(mapStateToProps)(SpreadPage);
