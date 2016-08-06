import React, { Component } from 'react';
import MusicDispatcher from '../prototypes/MusicDispatcher';

export default class MusicPlayer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { status } = this.props;
    const dispatcher = MusicDispatcher.getInstance();
    dispatcher.initBackgroundSound(status);
  }

  togglePlayingState() {
    const { status, onRotate } = this.props;
    const dispatcher = MusicDispatcher.getInstance();

    if (status) {
      dispatcher.pauseBackgroundSound();
    } else {
      dispatcher.playBackgroundSound();
    }

    if (typeof onRotate == 'function') onRotate();
  }

  render() {
    const { status } = this.props;
    const klass = status ? 'rotate' : '';

    return (
      <div className="player-container" onClick={this.togglePlayingState.bind(this)}>
        <div className={`music-player ${klass}`}></div>
      </div>
    );
  }
}
