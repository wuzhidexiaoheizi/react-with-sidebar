import React, { Component, PropTypes } from 'react';
import BulletItem from './BulletItem';

export default class BulletTrack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bullets: [],
      bulletLengthes: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { bullets, bulletLengthes } = nextState;

    return bullets != this.state.bullets || bulletLengthes != this.state.bulletLengthes;
  }

  componentDidUpdate() {
    this.flyBullets();
  }

  onHover() {
    const { hoverStop } = this.props;

    if (hoverStop) {
      this.pauseAllBullet();
    }
  }

  setBullets(bullets) {
    console.log('bullets:', bullets);

    const bulletLengthes = bullets.map((bullet) => {
      const { message } = bullet;
      return message.length * 14 + 15;
    });

    this.setState({ bullets, bulletLengthes });
  }

  flyBullets() {
    const { bullets } = this.state;

    bullets.forEach((bullet) => {
      const { id } = bullet;
      const refName = `bullet-${id}`;
      const ref = this.refs[refName];

      if (ref) ref.fly();
    });
  }

  render() {
    const { bullets, bulletLengthes } = this.state;
    const length = bullets.length;

    return (
      <div className="bullet-track" onHover={this.onHover.bind(this)}>
        { length > 0 && bullets.map((bullet, index) =>
          <BulletItem key={bullet.id} bullet={bullet} textField="message"
            ref={`bullet-${bullet.id}`} bulletLengthes={bulletLengthes}
            bulletIndex={index} totalBullet={length} />
          )
        }
      </div>
    );
  }
}

BulletTrack.defaultProps = {
  trackId: 0,
  hoverStop: true,
};

BulletTrack.propTypes = {
  trackId: PropTypes.number,
  hoverStop: PropTypes.bool,
};
