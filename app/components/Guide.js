import React, { Component } from 'react';
import Constants from '../constants';
import GuideStep from './GuideStep';
import Effect from '../prototypes/Effect';

const HAS_SHOWN_CAKE_PARTY_GUIDE = 'has_shown_cake_party_guide';

export default class Guide extends Component {
  constructor(props) {
    super(props);

    const hasShown = JSON.parse(localStorage.getItem(HAS_SHOWN_CAKE_PARTY_GUIDE));

    this.state = {
      showGuide: !hasShown
    };

    localStorage.setItem(HAS_SHOWN_CAKE_PARTY_GUIDE, JSON.stringify(true));
  }

  componentDidMount() {
    const { showGuide } = this.state;

    if (showGuide) this.showNoviceGuide();
  }

  showNoviceGuide() {
    const { guide } = this.refs;
    const { showOverlayer } = this.props;

    /*eslint-disable */
    new Effect(guide, { top: 0 }, 'easeOutExpo', '300ms', () => {
      if (typeof showOverlayer == 'function') showOverlayer();
    });
    /*eslint-enable */
  }

  hideNoviceGuide() {
    const { guide, scrollContent } = this.refs;
    const { clientHeight } = guide;
    const { hideOverlayer } = this.props;

    /*eslint-disable */
    new Effect(guide, { top: `-${clientHeight}px` }, 'easeOutExpo', '300ms', () => {
      scrollContent.scrollTop = 0;

      if (typeof hideOverlayer == 'function') hideOverlayer();
    });
    /*eslint-enable */
  }

  render() {
    const { GUIDE_DATAS } = Constants;

    return (
      <div className="novice-guide" ref="guide">
        <div className="guide-overlayer"></div>
        <div className="guide-container">
          <div className="inner-container">
            <div className="guide-content" ref="scrollContent">
              { GUIDE_DATAS.map((guideItem, index) => <GuideStep key={index} item={guideItem} index={index} />) }
            </div>
            <div className="guide-close" onClick={this.hideNoviceGuide.bind(this)}>
              <div className="close-btn">X</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
