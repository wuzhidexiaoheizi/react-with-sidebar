import React, {Component, PropTypes} from 'react';

export default class Winner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="winner-wrap">
        <h3>幸运用户</h3>
        {this.props.winners.map(winner => {
          return (
            <div className="winner"><img src={winner.avatar_url} alt={winner.title}/></div>
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
