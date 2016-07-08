import React, { Component } from 'react';

export default class GiftAnimation extends Component{
  constructor(props){
    super(props);
  }

  closeAnimation(){
    const { onCloseAnimation } = this.props;
    if (typeof onCloseAnimation == 'function') onCloseAnimation();
  }

  render(){
    const {anim_name} = this.props;

    return (
      <div className='anim-container'>
        <div className={`anim flower`}>
        
        </div>
        <button className='anim-close' onClick={ this.closeAnimation.bind(this) }>X</button>
      </div>
    );
  }
}