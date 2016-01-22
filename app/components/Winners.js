import React, {Component, PropTypes} from 'react';

export default class Winner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="winner-wrap">
        <div style={{color: '#666'}}>幸运用户</div>
        {this.props.winners.map((winner, index) => {
          return (
            <div key={index} className="winner">
              <img className="avatar" src={winner.avatar_url || __DEFAULT_AVATAR__} alt={winner.title}/>
            </div>
          );
        })}
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
