/*
 * @Description: 展示表单控件
 * @Author: danding
 * @Date: 2019-09-05 16:08:07
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-23 19:35:17
 */

import React from 'react';
import PropTypes from 'prop-types';
import * as dragFormConst from 'constants/components/businessCommon/dragForm';
import moment from 'moment';

const { Input, DatePicker, InputNumber, Radio, Checkbox, Upload, Button, Icon, Form, Row, Col, Select } = window.antd;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const normalInputStyles = { width: '190px' };

class PureFormItem extends React.PureComponent {
  matchComponent = ({ type, props, paramName }) => {
    const combineProps = { readOnly: true, ...props };
    switch(type) {
      case dragFormConst.TEXTAREA_COMPONENT_TYPE: { // 文本框
        return (
          <TextArea rows={1} { ...combineProps } />
        );
      }
      case dragFormConst.NUMBER_COMPONENT_TYPE: { // 数字框
        return (
          <InputNumber style={normalInputStyles} { ...combineProps }/>
        );
      }
      case dragFormConst.TIME_COMPONENT_TYPE: { // 时间框
        return (
          <DatePicker
            open={false}
            style={normalInputStyles}
            allowClear={false}
            defaultValue={moment(Date.now())}
            { ...combineProps }
          />
        );
      }
      case dragFormConst.TIME_RANGE_COMPONENT_TYPE: { // 时间区间框
        return (
          <RangePicker
            open={false}
            allowClear={false}
            style={{width: '100%'}}
            defaultValue={[moment(Date.now()), moment(Date.now())]}
            { ...combineProps }
          />
        );
      }
      case dragFormConst.RADIO_COMPONENT_TYPE: { // 单选
        const { options = [] } = combineProps;
        return (
          <RadioGroup>
            <Row>
              {
               options.map((i) => {
                 const { label, value } = i;
                 return (
                  <Col
                    span={24}
                    key={value}
                  >
                    <Radio value={`${value}_${label}`}>{label}</Radio>
                  </Col>
                 );
               })
              }
            </Row>
          </RadioGroup>
        );
      }
      case dragFormConst.CHECKBOX_COMPONENT_TYPE: { // 多选
        const { options = [] } = combineProps;
        return (
          <CheckboxGroup>
            <Row>
             {
               options.map((i) => {
                 const { label, value } = i;
                 return (
                  <Col
                    span={24}
                    key={value}
                  >
                    <Checkbox value={value}>{label}</Checkbox>
                  </Col>
                 );
               })
             }
           </Row>
          </CheckboxGroup>
        );
      }
      case dragFormConst.UPLOAD_FILE_COMPONENT_TYPE: { // 上传文件
        return (
          <Upload showUploadList={false}>
            <Button>
              <Icon type="upload" /> 上传
            </Button>
          </Upload>
        );
      }
      case dragFormConst.UPLOAD_IMG_COMPONENT_TYPE: { // 上传图片
        return (
          <Upload
            listType="picture-card"
            showUploadList={false}
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
          </Upload>
        );
      }
      case dragFormConst.MONEY_COMPONENT_TYPE: { // 金额
        const { paramName, ...rest } = combineProps;
        return (
          <div>
            <InputNumber
              style={normalInputStyles}
              precision={2}
              { ...rest }
            />
            <div>大写：xxx元整</div>
          </div>
        );
      }
      case dragFormConst.DURATION_HOUR_COMPONENT_TYPE: { // 时长/h
        const oneHourMils = 3600000;
        return (
          <div>
            <RangePicker
              format="YYYY-MM-DD HH:mm"
              showTime={{ format: 'HH:mm' }}
              allowClear={false}
              open={false}
              style={{width: '100%'}}
              defaultValue={[moment(Date.now() - oneHourMils), moment(Date.now())]}
              { ...combineProps }
            />
            <Input
              style={normalInputStyles}
              addonBefore="时长"
              addonAfter="小时"
              defaultValue={1}
              readOnly
            />
          </div>
        );
      }
      case dragFormConst.DURATION_DAY_COMPONENT_TYPE: { // 时长/d
        return (
          <div>
            <DatePicker
              open={false}
              style={normalInputStyles}
              allowClear={false}
              defaultValue={moment(Date.now())}
              { ...combineProps }
            />
            <Select open={false} value={1} style={{width: '80px'}}>
              <Option value={1}>上午</Option>
            </Select>
            <br />
            <DatePicker
              open={false}
              style={normalInputStyles}
              allowClear={false}
              defaultValue={moment(Date.now())}
              { ...combineProps }
            />
            <Select open={false} value={2} style={{width: '80px'}}>
              <Option value={2}>下午</Option>
            </Select>
            <br />
            <Input
              style={normalInputStyles}
              addonBefore="时长"
              addonAfter="天"
              defaultValue={1}
              readOnly
            />
          </div>
        );
      }
      case dragFormConst.USER_COMPONENT_TYPE: { // 人员信息
        return (
          <Form layout="inline">
            {
              dragFormConst.USER_COMPONENT_CONFIG.map(i => {
                return (
                  <FormItem label={i.label}>
                    <Input style={{width: '150px'}} placeholder={i.placeholder} readOnly />
                  </FormItem>
                );
              })
            }
          </Form>
        );
      }
      default:
        break;
    }
  }

  render() {
    const { type, props, paramName } = this.props;
    const component = this.matchComponent({ type, props, paramName });
    return component;
  }
}

PureFormItem.propTypes = {
  type: PropTypes.string,
  props: PropTypes.object,
  paramName: PropTypes.string
};

PureFormItem.defaultProps = {
  type: '', // 组件类型
  props: {}, // 组件属性
  paramName: '', // 组件的唯一性字段名
};

export default PureFormItem;
