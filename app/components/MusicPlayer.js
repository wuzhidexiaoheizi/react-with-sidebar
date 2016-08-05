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

    dispatcher.pushSound({
      src: resource,
      loop: true,
      isBgSound: true,
      name: 'background',
    });
  }

  togglePlayingState() {
    const { isPlaying } = this.state;
    const dispatcher = MusicDispatcher.getInstance();

    this.setState({ isPlaying: !isPlaying });

    if (isPlaying) {
      dispatcher.pauseBackgroundSound();
    } else {
      dispatcher.playBackgroundSound();
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
