/*
 * @Description: 新闻管理-检索
 * @Author: danding
 * @Date: 2019-04-23 09:43:00
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 15:17:55
 */

import React from 'react';
import Separate from 'components/common/Separate';

const { Form, DatePicker, Input, Select, Button, } = window.antd;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const style = { width: 200 };

class SearchBar extends React.PureComponent {
  addArticle = () => {
    T.tool.redirectTo(`${CONFIG.frontPath}/system/infoCreate.htm`);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let data = this.props.form.getFieldsValue();
    const { publishDate } = data;
    if (publishDate && publishDate.length) { // 发表时间解析
      data = {
        ...data,
        gmtPublishBegin: publishDate[0].format('YYYY-MM-DD'), gmtPublishEnd: publishDate[1].format('YYYY-MM-DD')
      };
      delete data.publishDate;
    }
    this.props.handleSubmit(data);
  }

  render() {
    const { form, columnData, } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form
        className="form-inline"
        layout="inline"
        onSubmit={this.handleSubmit}
      >
        <FormItem
          label="栏目"
          colon={false}
        >
           {getFieldDecorator('channelId', {
              initialValue: ''
          })(
            <Select placeholder="请选择栏目" style={{width: 200 }}>
              <Option value="">全部</Option>
              {
                columnData.map(i => (
                  <Option value={i.value}>{i.label}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          label="标题"
          colon={false}
        >
          {getFieldDecorator('title')(
            <Input placeholder="请输入标题名称" style={style} />
          )}
        </FormItem>
        <FormItem
          label="发表时间"
          colon={false}
        >
          {getFieldDecorator('publishDate')(
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              format='YYYY-MM-DD'
            />
          )}
        </FormItem>
        <FormItem
          label="发表状态"
          colon={false}
        >
          {getFieldDecorator('published', {
              initialValue: ''
          })(
            <Select placeholder="请选择发表状态" style={style}>
              <Option value="">全部</Option>
              <Option value={true}>已发表</Option>
              <Option value={false}>未发表</Option>
            </Select>
          )}
        </FormItem>
        <div>
          <FormItem
            label=" "
            colon={false}
          >
            <Button type="primary" htmlType="submit">查询</Button>
            <Separate size={20} isVertical={false} />
            <Button onClick={this.addArticle} type="primary">新增文章</Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

export default Form.create()(SearchBar);


