/*
 * @Description: 计算时间/小时或者天
 * @Author: moran 
 * @Date: 2019-09-26 14:22:13 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-15 09:55:40
 */
import React from 'react';
import moment from 'moment';
import { MORNING, DAY_RANGE } from 'constants/process/processCreate';
const { Input, DatePicker, Select } = window.antd;
const { Option } = Select;
const fromat = 'YYYY-MM-DD';
const today = new Date();
const threeDate = today.setDate(today.getDate() + 3);

class DayForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(Date.now()).format(fromat), // 开始日期
      endDate: moment(threeDate).format(fromat), // 结束日期
      day: 3.5, // 时长（天）
      startDayRange: MORNING, // 开始日期上午下午
      endDayRange: MORNING // 结束日期的上午下午
    };
  }
  componentDidMount() {
    // 默认设置
    const { endDayRange, startDate, endDate, day, startDayRange } = this.state;
    const dayString = `${startDate}(${startDayRange}) 至 ${endDate}(${endDayRange}) (时长： ${day}天)`;
    const timeArr = [day, dayString]; // 需要传给后端的格式
    this.props.onChange(timeArr);
  }

  // 结束日期禁用 小于开始时间禁用
  disabledEndDate = (currentDate) => {
    const startDate = new Date(this.state.startDate).getTime();
    return (currentDate.valueOf() < startDate);
  }

  // 开始日期禁用 大于结束日期禁用
  disabledStartDate = (currentDate) => {
    const endDate = new Date(this.state.endDate).getTime();
    const date = currentDate.format(fromat);
    const currentDateValues = new Date(date).getTime();
    return (currentDateValues > endDate);
  }

  // 开始日期 上下午选择
  handleSelectStartDay = (val) => {
    const { endDayRange, startDate, endDate } = this.state;
    const rangeValue = this.calculatorDay(val, endDayRange); // 计算上下午差异值
    const dayValue = (T.tool.getDays(startDate, endDate) + rangeValue); // 天数
    const day = (startDate && endDate) ? dayValue : null;
    const dayString = `${startDate}(${val}) 至 ${endDate}(${endDayRange}) (时长： ${day}天)`;
    const timeArr = [dayValue, dayString]; // 需要传给后端的格式
    this.setState({
      startDayRange: val,
      day
    });
    this.props.onChange(timeArr);
  }

  // 结束日期上下午选择
  handleSelectEndDay = (val) => {
    const { startDayRange, startDate, endDate } = this.state;
    const rangeValue = this.calculatorDay(startDayRange, val); // 计算上下午差异值
    const dayValue = (T.tool.getDays(startDate, endDate) + rangeValue); // 天数
    const day = (startDate && endDate) ? dayValue : null;
    const dayString = `${startDate}(${startDayRange}) 至 ${endDate}(${val}) (时长： ${day}天)`;
    const timeArr = [dayValue, dayString]; // 需要传给后端的格式
    this.setState({
      endDayRange: val,
      day
    });
    this.props.onChange(timeArr);
  }
  
  // 开始时间选择
  handleStartChange = (start) => {
    const startDate = start.format(fromat);
    const { endDate, startDayRange, endDayRange } = this.state;
    const rangeValue = this.calculatorDay(startDayRange, endDayRange); // 计算上下午差异值
    const dayValue = (T.tool.getDays(startDate, endDate) + rangeValue); // 天数
    const day = (startDate && endDate) ? dayValue : null;
    const dayString = `${startDate}(${startDayRange}) 至 ${endDate}(${endDayRange}) (时长： ${day}天)`; 
    const timeArr = [dayValue, dayString]; // 需要传给后端的格式
    this.setState({
      startDate,
      day
    });
    
    this.props.onChange(timeArr);
  }

  // 结束时间选择
  handleEndChange = (end) => {
    const endDate = end.format(fromat);
    const { startDate, startDayRange, endDayRange } = this.state;
    const rangeValue = this.calculatorDay(startDayRange, endDayRange); // 计算上下午差异值
    const dayValue = (T.tool.getDays(startDate, endDate) + rangeValue); // 天数
    const day = (startDate && endDate) ? dayValue : null;
    const dayString = `${startDate}(${startDayRange}) 至 ${endDate}(${endDayRange}) (时长： ${day}天)`;
    const timeArr = [dayValue, dayString]; // 需要传给后端的格式
    this.setState({
      endDate,
      day
    });
    this.props.onChange(timeArr);
  }

  // 计算天数差值（上下午差异值）
  calculatorDay = (startDayRange, endDayRange) => {
    let rangeValue = 0;
    // 上下午相同0.5， 上午--下午 1   下午--上午 0
    if (startDayRange === endDayRange) {
      rangeValue = 0.5;
    } else if (startDayRange === '下午' && endDayRange === '上午') {
      rangeValue = 0;
    } else {
      rangeValue = 1;
    }
    return rangeValue;
  }

  render() {
    const {
      day,
      startDayRange,
      endDayRange
    } = this.state;
    const unit = '天';
    return (
      <div>
        <div>
          <DatePicker
            defaultValue={moment(Date.now())}
            allowClear={false}
            onChange={this.handleStartChange}
            disabledDate={this.disabledStartDate}
            placeholder='请选择开始时间' />
          <Select
            value={startDayRange}
            className="select-box-day"
            dropdownClassName='drop-select'
            onChange={this.handleSelectStartDay}>
              {
                DAY_RANGE.map((i, index) => {
                  const { label } = i;
                  return (<Option key={index} value={label}>{label}</Option>);
                })
              }
          </Select>
        </div>
        <div>
          <DatePicker
            defaultValue={moment(threeDate)}
            allowClear={false}
            onChange={this.handleEndChange}
            placeholder='请选择结束时间'
            disabledDate={this.disabledEndDate} />
          <Select
            value={endDayRange}
            className="select-box-day"
            dropdownClassName='drop-select'
            onChange={this.handleSelectEndDay}>
          {
              DAY_RANGE.map((i, index) => {
                const { label } = i;
                return (<Option key={index} value={label}>{label}</Option>);
              })
            }
          </Select>
        </div>
        <Input
          addonBefore="时长"
          addonAfter={unit}
          value={day}
          disabled/>
      </div>
    );
  }
}

export default DayForm;
