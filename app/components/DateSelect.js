import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

export default class DateSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.initState();
  }

  componentWillReceiveProps(nextProps) {
    const { at_latest, at_earliest, shouldUpdateEarliest, shouldUpdateLatest } = nextProps;

    if (at_latest && shouldUpdateLatest) {
      this.initAtLatestState(at_latest);
    } else if (at_earliest && shouldUpdateEarliest) {
      this.initAtEarliestState(at_earliest);
    }
  }

  getCurrentLatestMonths(month) {
    const monthOptions = [];

    for (let i = 1; i <= month; i++) {
      monthOptions.push({label: i, value: i});
    }

    return monthOptions;
  }

  getCurrentEarliestMonths(month) {
    const monthOptions = [];

    for (let i = month; i <= 12; i++) {
      monthOptions.push({label: i, value: i});
    }

    return monthOptions;
  }

  getOtherYearMonths() {
    const monthOptions = [];

    for (let i = 1; i <= 12; i++) {
      monthOptions.push({label: i, value: i});
    }

    return monthOptions;
  }

  getCurrentMonthLatestDays(at_latest) {
    const day = at_latest.getDate();
    const days = [];

    for (let i = 1; i <= day; i++) {
      days.push({label: i, value: i});
    }

    return days;
  }

  getCurrentMonthEarliestDays(at_earliest) {
    const year = at_earliest.getFullYear();
    const month = at_earliest.getMonth();
    const day = at_earliest.getDate();
    const limit = this.getLimitDays(year, month);
    const days = [];

    for (let i = day; i <= limit; i++) {
      days.push({label: i, value: i});
    }

    return days;
  }

  /**
   * [getOtherMonthDays 获取其它月份可选择的天数]
   * @param  {[type]} year [description]
   * @return {[type]}      [description]
   */
  getOtherMonthDays(year, month) {
    const limit = this.getLimitDays(year, month - 1);
    const days = [];

    for (let i = 1; i <= limit; i++) {
      days.push({label: i, value: i});
    }

    return days;
  }

  getLimitDays(year, month) {
    const isLeapYear = this.checkIfLeapYear(year);
    const limits = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31,
      30, 31];

    return limits[month];
  }

  isTheSameDate(date1, date2) {
    return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth
      && date1.getDate() == date2.getDate();
  }

  dateChanged(date) {
    const { onChanged } = this.props;

    if (typeof onChanged == 'function') onChanged(date);
  }

  initState() {
    const { at_earliest, at_latest } = this.props;

    if (at_earliest) {
      this.initAtEarliestState(at_earliest);
    } else if (at_latest) {
      this.initAtLatestState(at_latest);
    } else {
      this.initNormalState();
    }
  }

  initAtEarliestState(at_earliest) {
    const year = at_earliest.getFullYear();
    const month = at_earliest.getMonth() + 1;
    const day = at_earliest.getDate();
    const yearOptions = [ {label: year, value: year}, { label: year + 1, value: year + 1} ];
    const monthOptions = this.getCurrentEarliestMonths(month);
    const dayOptions = this.getCurrentMonthEarliestDays(at_earliest);

    this.setState({
      year,
      month,
      day,
      yearOptions,
      monthOptions,
      dayOptions
    });
  }

  initAtLatestState(at_latest) {
    const year = at_latest.getFullYear();
    const month = at_latest.getMonth() + 1;
    const day = at_latest.getDate();
    const yearOptions = [ {label: year - 1, value: year - 1}, {label: year, value: year} ];
    const monthOptions = this.getCurrentLatestMonths(month);
    const dayOptions = this.getCurrentMonthLatestDays(at_latest);

    this.setState({
      year,
      month,
      day,
      yearOptions,
      monthOptions,
      dayOptions
    });
  }

  initNormalState() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const yearOptions = [];

    for (let i = 1970; i <= year + 10; i++) {
      yearOptions.push({ label: i, value: i});
    }

    const monthOptions = this.getCurrentEarliestMonths(month);
    const dayOptions = this.getOtherMonthDays(year, month);

    this.setState({
      year,
      month,
      day,
      yearOptions,
      monthOptions,
      dayOptions
    });
  }

  checkIfLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  checkIfCurrentYear(year) {
    const { at_earliest, at_latest } = this.props;

    if (at_earliest) return at_earliest.getFullYear() == year;
    if (at_latest) return at_latest.getFullYear() == year;

    return new Date().getFullYear() == year;
  }

  checkIfCurrentMonth(year, month) {
    const { at_earliest, at_latest } = this.props;
    const now = new Date();

    if (at_earliest) return at_earliest.getFullYear() == year && (at_earliest.getMonth() + 1 == month);
    if (at_latest) return at_latest.getFullYear() == year && (at_latest.getMonth() + 1 == month);

    return now.getFullYear() == year && (now.getMonth() + 1 == month);
  }

  pickYear(data) {
    const year = +data.value;

    if (this.state.year == year) return;

    const month = +this.state.month;
    const monthOptions = this.getOtherYearMonths();
    const dayOptions = this.getOtherMonthDays(year, month);

    this.setState({ year, monthOptions, dayOptions }, () => {
      this.changeDate();
    });
  }

  pickMonth(data) {
    const month = +data.value;

    if (this.state.month == month) return;

    const { at_earliest, at_latest } = this.props;
    const year = +this.state.year;
    const isCurrentMonth = this.checkIfCurrentMonth(year, month);
    const limit = this.getLimitDays(year, month - 1);
    let day = +this.state.day;
    let dayOptions;

    if (day > limit) day = limit;

    if (isCurrentMonth) {
      if (at_earliest) {
        dayOptions = this.getCurrentMonthEarliestDays(at_earliest);
      } else if (at_latest) {
        dayOptions = this.getCurrentMonthLatestDays(at_latest);
      } else {
        dayOptions = this.getOtherMonthDays(year, month);
      }
    } else {
      dayOptions = this.getOtherMonthDays(year, month);
    }

    this.setState({ month, dayOptions, day }, () => {
      this.changeDate();
    });
  }

  pickDay(data) {
    this.setState({ day: +data.value }, () => {
      this.changeDate();
    });
  }

  changeDate() {
    const { at_latest, at_earliest, shouldUpdateEarliest, shouldUpdateLatest } = this.props;
    const { year, month, day } = this.state;
    const date = new Date(year, month - 1, day);

    if ((at_latest && shouldUpdateEarliest) || (at_earliest && shouldUpdateLatest)
      || (!shouldUpdateEarliest) && !shouldUpdateLatest) {
      this.dateChanged(date);
    }
  }

  render() {
    const clearable = false;
    const autoBlur = true;

    return (
      <div className="date-select">
        <div className="birthday-field">
          <Select name="birthday-year"
            value={this.state.year}
            options={this.state.yearOptions}
            onChange={this.pickYear.bind(this)}
            clearable={clearable}
            autoBlur={autoBlur}
          />
          <span className="date-label">年</span>
        </div>
        <div className="birthday-field">
          <Select name="birthday-month"
            value={this.state.month}
            options={this.state.monthOptions}
            onChange={this.pickMonth.bind(this)}
            clearable={clearable}
            autoBlur={autoBlur}
          />
          <span className="date-label">月</span>
        </div>
        <div className="birthday-field">
          <Select name="birthday-day"
            value={this.state.day}
            options={this.state.dayOptions}
            onChange={this.pickDay.bind(this)}
            clearable={clearable}
            autoBlur={autoBlur}
          />
          <span className="date-label">日</span>
        </div>
      </div>
    );
  }
}

DateSelect.defaultProps = {
  shouldUpdateEarliest: false,
  shouldUpdateLatest: false
};

DateSelect.propTypes = {
  at_earliest: PropTypes.instanceOf(Date),
  at_latest: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  shouldUpdateEarliest: PropTypes.bool,
  shouldUpdateLatest: PropTypes.bool
};
