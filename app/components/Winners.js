import React, {Component, PropTypes} from 'react';

export default class Winner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { winners, seed_count } = this.props.item;

    return (
      <div className="winner-wrap">
        <div style={{color: '#666'}}>幸运用户</div>
        <div className="winner-list">
          {winners.map((winner, index) => {
            return (
              <div key={`winner-${index}`} className="winner">
                <img className="avatar" src={winner.avatar_url || __DEFAULT_AVATAR__} alt={winner.title}/>
              </div>
            );
          })}
        </div>
        <div className="share-summary">
          本产品被分享了<span className="seed-count">{seed_count}</span>次
        </div>
      </div>
    );
  }
}

Winner.defaultProps = {
  winners: []
};

Winner.propTypes = {
  winners: PropTypes.array
};
