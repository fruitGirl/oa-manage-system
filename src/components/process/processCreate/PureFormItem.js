/*
 * @Description: 表单纯组件
 * @Author: moran
 * @Date: 2019-09-16 10:25:36
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-15 15:33:36
 */
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/process/processCreate/pureFormItem.less';
import {
  TIME_COMPONENT_TYPE,
  TIME_RANGE_COMPONENT_TYPE,
  TEXTAREA_COMPONENT_TYPE,
  NUMBER_COMPONENT_TYPE,
  MONEY_COMPONENT_TYPE,
  DURATION_HOUR_COMPONENT_TYPE,
  DURATION_DAY_COMPONENT_TYPE,
  CHECKBOX_COMPONENT_TYPE,
  RADIO_COMPONENT_TYPE,
  UPLOAD_FILE_COMPONENT_TYPE,
  UPLOAD_IMG_COMPONENT_TYPE,
  USER_COMPONENT_TYPE
} from 'constants/components/businessCommon/dragForm/index';
import UploadFile from 'components/common/UploadFile';
import UploadMultipleImg from 'components/common/UploadMultipleImg';
import TimeForm from './TimeForm';
import DayForm from './DayForm';
import UserInfo from './UserInfo';
const { Input, DatePicker, InputNumber, Checkbox, Radio, Row, Col } = window.antd;

const { RangePicker } = DatePicker;
const { TextArea } = Input;
class PureFormItem extends React.PureComponent {
  matchComponent = (formConfigs) => {
    const { value } = this.props;
    const { type,  props } = formConfigs;

    // 更新组件
    const combineProps = { ...props, value, onChange: (val) => {
      this.props.onChange(val);
    } };

    // 上传更新组件
    const combineFileProps = {
      ...props,
      count: 5,
      value,
      action: "/process/fileAdd.json",
      onChange: (val) => {
      this.props.onChange(val);
    } };

    // 单选多选
    const optionProps = {
      ...props,
      value,
      onChange: (val) => {
      this.props.onChange(val);
    } };
    delete optionProps.options;

    // 上传图片
    const combineImgProps = {
      ...props,
      value,
      action: "/process/imageAdd.json",
      onChange: (val) => {
        this.props.onChange(val);
      }
    };

    switch(type) {
      case TEXTAREA_COMPONENT_TYPE: { // 多行文本
        return (
          <TextArea
            { ...combineProps }
            rows={3}
            maxLength={5000}
            className='textarea-box'/>
        );
      }

      case NUMBER_COMPONENT_TYPE: { // 数字
        return (
          <InputNumber
            { ...combineProps }
            min={0}
            maxLength={15}
            precision={2}/>
        );
      }

      case TIME_COMPONENT_TYPE: { // 时间
        return (
          <DatePicker { ...combineProps } />
        );
      }

      case TIME_RANGE_COMPONENT_TYPE: { // 时间区间
        return (
          <RangePicker
            { ...combineProps }
            className="time"
            showTime={combineProps.format !== 'YYYY-MM-DD'}/>
        );
      }

      case MONEY_COMPONENT_TYPE: { // 金额
        return (
          <div className='money'>
            <InputNumber
              { ...combineProps }
              min={0}
              maxLength={15}
              precision={2}/>
            <span className="unit">元</span>
            {(value || value === 0) ? <span>大写：{T.numToMoney(value)}</span> : null}
          </div>
        );
      }

      case DURATION_HOUR_COMPONENT_TYPE: { // 时长（小时）
        return (
          <TimeForm { ...combineProps }/>
        );
      }

      case DURATION_DAY_COMPONENT_TYPE: { // 时长（天）
        return (
          <DayForm { ...combineProps }/>
        );
      }

      case CHECKBOX_COMPONENT_TYPE: { // 多选
        return (
         <Checkbox.Group { ...optionProps }>
            <Row>
             {
               combineProps.options.map(i => {
                 const { label, value } = i;
                 return (
                  <Col
                    span={24}
                    key={value}
                    style={{}}>
                    <Checkbox value={value}>{label}</Checkbox>
                  </Col>
                 );
               })
             }

           </Row>
         </Checkbox.Group>
        );
      }

      case RADIO_COMPONENT_TYPE: { // 单选
        return (
          <Radio.Group { ...optionProps }>
            <Row>
            {
              combineProps.options.map(i => {
                const { label, value } = i;
                return (
                  <Col span={24} key={value}>
                    <Radio value={value}>{label}</Radio>
                  </Col>
                );
              })
            }
          </Row>
        </Radio.Group>
          );
      }

      case UPLOAD_FILE_COMPONENT_TYPE: { // 上传文件
        return (
          <UploadFile
            size={100}
            { ...combineFileProps }/>
        );
      }

      case UPLOAD_IMG_COMPONENT_TYPE: { // 上传图片
        const { imageLength, imageNums, imageType } = this.props.imgRules;
        const accept = imageType.map(i => {
          return `image/${i}`;
        });
        return (
          <UploadMultipleImg
            { ...combineImgProps }
            amount={imageNums}
            size={imageLength}
            accept={accept}
            imgType={imageType}
            />
        );
      }

      case USER_COMPONENT_TYPE: { // 用户信息
        return (
          <UserInfo
            formProps={props}
            { ...combineProps }/>
        );
      }

      default:
        break;
    }
  }

  render() {
    const { formConfigs } = this.props;
    return this.matchComponent(formConfigs); // 表单组件
  }
}

PureFormItem.propTypes = {
  formConfigs: PropTypes.object // 表单配置
};

PureFormItem.defaultProps = {
  formConfigs: {}
};

export default connect(({ processCreate }) => ({ ...processCreate }))(PureFormItem);
