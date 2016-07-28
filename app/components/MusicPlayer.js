import React, { Component } from 'react';
import MusicDispatcher from '../prototypes/MusicDispatcher';

export default class MusicPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: true,
    };
  }

  componentDidMount() {
    const dispatcher = MusicDispatcher.getInstance();
    const { resource } = this.props;

    dispatcher.pushMusic({
      src: resource,
      loop: true,
      isBgMusic: true,
    });
  }

  togglePlayingState() {
    const { isPlaying } = this.state;
    const dispatcher = MusicDispatcher.getInstance();

    this.setState({ isPlaying: !isPlaying });

    if (isPlaying) {
      dispatcher.pauseBackgroundMusic();
    } else {
      dispatcher.playBackgroundMusic();
    }
  }

  render() {
    const { isPlaying } = this.state;
    const klass = isPlaying ? 'rotate' : '';

    return (
      <div className="player-container" onClick={this.togglePlayingState.bind(this)}>
        <div className={`music-player ${klass}`}></div>
      </div>
    );
  }
}
