/*
 * @Description: 计算时间/小时
 * @Author: moran 
 * @Date: 2019-09-26 14:22:13 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-12 17:36:15
 */
import React from 'react';
const { Input, DatePicker } = window.antd;
const { RangePicker } = DatePicker;

class TimeForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: '', // 小时
    };
  }
  
  handleChange = (val) => {
    const formate = 'YYYY-MM-DD HH:mm';
    const startDate = val[0].format(formate); // 开始时间
    const endDate = val[1].format(formate); // 结束时间
    const time = T.tool.getHours(startDate, endDate); // 小时
    const timeValues = val ? `${startDate}至${endDate} (时长： ${time}小时)` : ''; // 小时
    const timeArr = [time, timeValues]; // 需要传给后端的格式

    this.setState({
      time,
    });
    
    this.props.onChange(timeArr);
  }
  render() {
    const { time } = this.state;
    const unit = '小时';
    const formates = 'YYYY-MM-DD HH:mm';
    return (
      <div>
        <RangePicker
          className="time"
          onChange={this.handleChange}
          format={formates}
          showTime={true}/>
        <Input
          addonBefore="时长"
          addonAfter={unit}
          value={time}
          disabled/>
      </div>
    );
  }
}

export default TimeForm;
