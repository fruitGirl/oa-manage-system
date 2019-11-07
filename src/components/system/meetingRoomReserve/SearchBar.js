/*
 * @Description: 会议室预定-检索
 * @Author: danding
 * @Date: 2019-04-26 18:35:48
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 15:17:28
 */

import React from 'react';
import moment from 'moment';
import Separate from 'components/common/Separate';

const { Form, Input, Button, DatePicker } = window.antd;
const FormItem = Form.Item;
const style = { width: 200 };
CONFIG.disabledDateArr = CONFIG.disabledDateArr || [];
const dateFormat = 'YYYY-MM-DD';

class SearchBar extends React.PureComponent {
  componentDidMount() {
    this.handleSubmit();
  }

  disabledDate = (currentDate) => {
    return (currentDate.valueOf() > CONFIG.disabledDateArr[1])
     || (currentDate.valueOf() < CONFIG.disabledDateArr[0]);
  }

  handleSubmit = (e) => {
    e && e.preventDefault();
    const data = this.props.form.getFieldsValue();
    let { reserve } = data;
    reserve = reserve.format(dateFormat);
    this.props.search({ ...data, reserve });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form
        className="form-inline"
        layout="inline"
        onSubmit={this.handleSubmit}
      >
        <FormItem
          label="预订日期"
          colon={false}
        >
          {getFieldDecorator('reserve', {
            initialValue: moment(new Date(CONFIG.disabledDateArr[0]), dateFormat)
          })(
            <DatePicker
              showToday={false}
              disabledDate={this.disabledDate}
              allowClear={false}
            />
          )}
        </FormItem>
        <FormItem
          label="会议室名称"
          colon={false}
        >
          {getFieldDecorator('meetingRoomName')(
            <Input placeholder="请输入会议室名称" style={style} />
          )}
        </FormItem>
        <div>
          <FormItem
            label=" "
            colon={false}
          >
            <Button type="primary" htmlType="submit">查询</Button>
            <Separate isVertical={false} />
            <Button type="primary" target="_blank" href="/system/infoDetailQuery.htm?id=631174&channel=%E9%87%8D%E8%A6%81%E9%80%9A%E7%9F%A5">会议室分布</Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

export default Form.create()(SearchBar);


