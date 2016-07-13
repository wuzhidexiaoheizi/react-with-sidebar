import React, { Component } from 'react';

export default class MusicPlayer extends Component{
  constructor(props) {
    super(props);

    this.state = {
      rotate : 'rotate',
      play: true
    };
  }

  rotatePlayer(){
    const status = this.props.status;
    this.props.onRotate();
    
    status ? this.refs.audio.pause() : this.refs.audio.play(); 
    
  }

  render(){
    const status = this.props.status;
    status ? this.state.rotate = 'rotate' : this.state.rotate = '';
    
    return (
        <section className='player-container' onClick={this.rotatePlayer.bind(this)}>
          <audio src={this.props.resource} autoPlay='autoplay' ref='audio'>your browser doesn't support</audio>
          <div className={`music-player ${this.state.rotate}`}>
          </div>
        </section>
      );
  }
}