/*
 * @Description: 审批表单
 * @Author: moran
 * @Date: 2019-09-16 10:21:03
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-14 17:49:13
 */
import { connect } from 'dva';
import React from 'react';
import PureFormItem from './PureFormItem';
import ApprovalProcessModal from "./ApprovalProcessModal";
import {
  TIME_COMPONENT_TYPE,
  TIME_RANGE_COMPONENT_TYPE,
  USER_COMPONENT_TYPE,
  UPLOAD_FILE_COMPONENT_TYPE,
  UPLOAD_IMG_COMPONENT_TYPE,
  RADIO_COMPONENT_TYPE,
  CHECKBOX_COMPONENT_TYPE
} from 'constants/components/businessCommon/dragForm/index';
import qs from 'qs';
const { Form, Button } = window.antd;

const FormItem = Form.Item;
// 布局
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 },
};

class ApprovalForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {} // 审批表单组装数据
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'processCreate/getImgRules',
      payload: {}
    });
  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { configs } = this.props;

        // 需要传回去的字段格式转换
        const dataValues = this.tranValuesIntoNeed(configs, values);

        const { processConfigId } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        const needValues = { ...values, ...dataValues }; // 组装数据（需要传过去的格式）
        this.setState({
          formValues: needValues
        });
        const payload = { processConfigId, processFormDataStr: JSON.stringify(needValues) };
        this.props.dispatch({
          type: 'processCreate/getSelfSelectUserNode',
          payload
        });
      }
    });
  }

   // 需要传回去的字段格式转换
  tranValuesIntoNeed = (configs, values) => {
    const dataValues = {};
    configs.forEach(i => {
      const { type, paramName, props } = i;
        for(const field in values) {
          if (type === TIME_RANGE_COMPONENT_TYPE && paramName === field) { // 时间段转换时间戳格式
            const startDate = values[field] ? values[field][0].format(props.format) : undefined;
            const endDate = values[field] ? values[field][1].format(props.format) : undefined;
            dataValues[field] = values[field] ? [new Date(startDate).getTime(), new Date(endDate).getTime()] : undefined;
          }
          if (type === TIME_COMPONENT_TYPE && paramName === field) { // 时间转换时间戳格式
            const selectDate = values[field] ? values[field].format(props.format) : undefined;
            dataValues[field] = values[field] ? new Date(selectDate).getTime() : undefined;
          }
          if (type === UPLOAD_FILE_COMPONENT_TYPE && paramName === field) { // 上传文件转化
            const fileLists = values[field];
            dataValues[field] = this.tranFileLists(fileLists, 'fileName');
          }
          if (type === UPLOAD_IMG_COMPONENT_TYPE && paramName === field) { // 上传图片转换
            const imgLists = values[field];
            dataValues[field] = this.tranFileLists(imgLists, 'imageName');
          }
          if (values[field] === null) { // 所有为null的转为undefined
            dataValues[field] = undefined;
          }
        }
    });
    return dataValues;
  }

  // 转换上传图片以及上传文件数据格式
  tranFileLists = (lists, getField) => {
    if (!lists) return undefined;

    return lists.map(i => {
      const getFields = i.response.outputParameters[getField];
      return getFields;
    });
  }

  // 规则校验
  getRules = (isRequired, name) => {
    let rules = [];
    if (isRequired) rules.push({ required: true, message: `${name}不能为空` });
    return rules;
  }

  // 隐藏审批流程自选弹框
  handleHide = () => {
    this.props.dispatch({
      type: 'processCreate/displayProcessModal',
      payload: false
    });
  }

  //  确认审批
  handleApprovalProcess = (values) => {

    const { processConfigId } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const { formValues } = this.state;
    const dataValues = { ...formValues, ...values };
    const payload = { processConfigId, processFormDataStr: JSON.stringify(dataValues) };
    this.props.dispatch({
      type: 'processCreate/createProcess',
      payload
    });
  }

  render() {
    const {
      configs,
      form,
      showProcessNode,
      processNodeInstance,
      loading
    } = this.props;
    const { getFieldDecorator } = form;
    const submitLoading = loading.effects['processCreate/getSelfSelectUserNode']; // 提交loading

    return (
      <div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          {
            configs.map((i, index) => {
              const { paramName, props, type } = i;
              const { required = false, label } = props;
              const fieldRules = this.getRules(required, label); // 校验规则转换成数组形式
              const component = <PureFormItem formConfigs={i}/>;
              const isUser = (type === USER_COMPONENT_TYPE) ? 'user-form-box' : '';
              const isUploadImg = (type === UPLOAD_IMG_COMPONENT_TYPE) ? 'upload-img-box' : '';

              // 单选多选样式
              const isRadio = (type === RADIO_COMPONENT_TYPE || type === CHECKBOX_COMPONENT_TYPE) ? 'radio-form-box' : ''; 

              return (
                <FormItem
                  label={type === USER_COMPONENT_TYPE ? '' : <div className="renew-label">{label}</div>}
                  {...formItemLayout}
                  colon={false}
                  className={`pure-form-item-box ${isUser} ${isUploadImg} ${isRadio} `}
                  key={index}>
                  {getFieldDecorator(paramName, {
                        rules: fieldRules,
                    })(component)}
                </FormItem>
              );
            })
          }
          <FormItem label=' ' {...formItemLayout} colon={false}>
            <Button type="primary"
              onClick={this.handleSubmit}
              loading={submitLoading}>
              提交
            </Button>
          </FormItem>
        </Form>
        <ApprovalProcessModal
          visible={showProcessNode}
          hide={this.handleHide}
          configs={processNodeInstance}
          confirm={this.handleApprovalProcess}/>
      </div>
    );
  }
}

ApprovalForm.propTypes = {
  configs: PropTypes.array.isRequired, // 表单配置
};

ApprovalForm.defaultProps = {
  configs: []
};

export default connect(({ processCreate, loading }) => ({ ...processCreate, loading }))(Form.create()(ApprovalForm));

