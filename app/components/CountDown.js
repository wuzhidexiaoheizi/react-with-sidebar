import React, {Component} from 'react';

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// 10位 补0
function add0(n) {
  return n < 10 ? '0' + n : n;
}

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now: Date.now() + this.props.td
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        now: Date.now() + this.props.td
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  spanNumber(str) {
    return str.toString().split('').map((n, i) => {
      return <span key={str + n + i} className="time-number">{n}</span>;
    });
  }

  render() {
    const {time} = this.props;
    const {now} = this.state;
    let d = Math.floor(Math.abs(now - time) / 1000);
    const days = Math.floor(d / DAY);
    d -= days * DAY;
    const hours = add0(Math.floor(d / HOUR));
    d -= hours * HOUR;
    const minutes = add0(Math.floor(d / MINUTE));
    d -= minutes * MINUTE;
    const seconds = add0(d);

    if (days) {
      return (
        <div>
          {this.spanNumber(days)}<span className="day">天</span>
          {this.spanNumber(hours)}<span className="colon">:</span>
          {this.spanNumber(minutes)}<span className="colon">:</span>
          {this.spanNumber(seconds)}
        </div>
      );
    }

    if (hours) {
      return (
        <div>
          {this.spanNumber(hours)}<span className="colon">:</span>
          {this.spanNumber(minutes)}<span className="colon">:</span>
          {this.spanNumber(seconds)}
        </div>
      );
    }

    return (
      <div>
        {this.spanNumber(minutes)}<span className="colon">:</span>
        {this.spanNumber(seconds)}
      </div>
    );
  }
}
