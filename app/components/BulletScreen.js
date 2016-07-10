import React, { Component, PropTypes } from 'react';
import BulletTrack from './BulletTrack';

export default class BulletScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: true
    };
  }

  resetBullets(bullets) {
    this.reassignBullet(bullets);
  }

  reassignBullet(bullets) {
    const { trackCount } = this.props;
    const groups = this.groupArray(bullets, trackCount);

    for (let i = 0; i < trackCount; i++) {
      const refName = `track-${i}`;
      const ref = this.refs[refName];
      const group = groups[i];

      if (ref) ref.setBullets(group);
    }
  }

  groupArray(array, cols) {
    const arr = this.split(array, cols);
    const groups = [];
    let group = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === null) {
        groups.push(group);
        group = [];

        continue;
      }

      group.push(arr[i]);
    }

    groups.push(group);

    return groups;
  }

  split(array, cols) {
    if (cols == 1) return array;
    const size = Math.ceil(array.length / cols);

    return array.slice(0, size).concat([null]).concat(this.split(array.slice(size), cols - 1));
  }

  toggleShow() {
    const { isShow } = this.state;

    this.setState({ isShow: !isShow });
  }

  render() {
    const { trackCount } = this.props;
    const trackArray = [];
    const { isShow } = this.state;
    const klass = isShow ? 'shown' : 'hide';

    for (let i = 0; i < trackCount; i++) {
      trackArray.push(i);
    }

    return (
      <div className={`bullet-screen ${klass}`}>
        <div className="screen-content">
          <div className="track-list">
            { trackArray.map((i) =>
              <BulletTrack key={i} trackId={i} ref={`track-${i}`} />
            ) }
          </div>
        </div>
      </div>
    );
  }
}

BulletScreen.defaultProps = {
  trackCount: 3,
  bullets: [],
};

BulletScreen.propTypes = {
  trackCount: PropTypes.number,
  bullets: PropTypes.array
};
