/*
 * @Description: 添加条件弹窗
 * @Author: danding
 * @Date: 2019-09-16 10:48:36
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-19 17:56:27
 */

import React from 'react';
import { connect } from 'dva';
import cloneDeep from 'lodash.clonedeep';
import { CONDITION_TYPES, RADIO_COMPONENT_TYPE } from 'constants/components/businessCommon/dragForm';
import Separate from 'components/common/Separate';
import { updateProcessConfig, LAUNCH_CONDITION, CUSTOM_STARTER_CONDITION, RANGE_CONDITION, MULTI_SELECT_CONDITION } from 'constants/components/process/processConfigEdit';
import { GT_TYPE, VISIBLE_RANGE_ALL_USER } from 'constants/process/processConfigEdit';

const { Modal, Checkbox, Popconfirm } = window.antd;
const CheckboxGroup = Checkbox.Group;

class ConditionModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedConditions: this.getSelectedVals() || [],
    };
  }

  hideModal = () => {
    this.props.hideModal();
    this.setState({
      selectedConditions: this.getSelectedVals() || []
    });
  }

  // 确认
  onSubmit = () => {
    const { selectedConditions } = this.state;
    const { selectedProcessCard, targetConfigs } = this.props;
    const { processConditionNodePropertiesList = [] } = selectedProcessCard;
    const conditionList = selectedConditions.map(i => {
      const matchItem = processConditionNodePropertiesList.find(j => j.paramName === i);
      if (matchItem) return matchItem;
      const findItem = targetConfigs.find(k => k.paramName === i);
      let conditionType;
      let key = '';

      // 匹配表单配置
      if (findItem) {
        // 单选类型
        if (findItem.type === RADIO_COMPONENT_TYPE) {
          conditionType = MULTI_SELECT_CONDITION;
        } else { // 范围类型条件
          conditionType = RANGE_CONDITION;
        }
      } else { // 发起人
        conditionType = CUSTOM_STARTER_CONDITION;
        key = VISIBLE_RANGE_ALL_USER; // 选择的类型：所有用户
      }

      return {
        paramName: i,
        conditionType,
        paramValues: {
          key,
          value: []
        },
        compareWay: GT_TYPE
      };
    });

    const payload = {
      ...selectedProcessCard,
      processConditionNodePropertiesList: conditionList
    };
    delete payload.childNodes; // 解决流程重置问题

    this.props.dispatch({
      type: 'processConfigEdit/setSelectedSiderProcessCard',
      payload
    });
    this.updateConfig(payload);
    this.props.hideModal();
  }

  // 更新配置
  updateConfig = (payload) => {
    const { startNodeConfig } = this.props;
    const cloneConfig = cloneDeep(startNodeConfig);
    updateProcessConfig(payload, cloneConfig);
    this.props.dispatch({
      type: 'processConfigEdit/updateProcessLine',
      payload: cloneConfig
    });
  }

  // 选择必填条件项
  changeRequireCondition = (vals) => {
    this.setState({
      selectedConditions: vals
    });
  }

  // 选择可选条件项
  confirmAlterCondition = (paramName) => {
    const { targetConfigs } = this.props;
    const { selectedConditions } = this.state;
    const cloneConfigs = cloneDeep(targetConfigs);
    const matchItem = cloneConfigs.find(i => {
      return i.paramName === paramName;
    });
    matchItem.props.required = true;
    this.props.dispatch({
      type: 'processConfigEdit/updateTargetconfigs',
      payload: cloneConfigs
    });
    this.props.dispatch({
      type: 'processConfigEdit/setSelectTargetItem',
      payload: matchItem
    });
    this.setState({
      selectedConditions: [...selectedConditions, paramName]
    });
  }

  // 获取条件选择项，isRequired 已选择必填的条件项
  getConditions = (isRequired) => {
    const { targetConfigs = [] } = this.props;
    const filters = targetConfigs.filter(i => {
      const { type, props: { required } } = i;
      return (CONDITION_TYPES.includes(type) && (isRequired === required));
    });
    const conditions = filters.map(i => {
      const { props: { label }, paramName } = i;
      return {
        label,
        value: paramName
      };
    });

    // 增加发起人选项
    isRequired && conditions.unshift(LAUNCH_CONDITION);
    return conditions;
  }

  // 得到已选择的数据值
  getSelectedVals = () => {
    const { selectedProcessCard } = this.props;
    const { processConditionNodePropertiesList = [] } = selectedProcessCard;
    return processConditionNodePropertiesList.map(i => i.paramName);
  }

  render() {
    const { visible } = this.props;
    const { selectedConditions } = this.state;
    const requireConditions = this.getConditions(true);
    const alterConditions = this.getConditions(false);

    return (
      <Modal
        title="添加条件"
        visible={visible}
        width={500}
        onCancel={this.hideModal}
        onOk={this.onSubmit}
      >
        <div>
          <h3>请选择用来区分审批流程的条件字段</h3>
          <CheckboxGroup
            onChange={this.changeRequireCondition}
            value={selectedConditions}
            options={requireConditions}
          />
        </div>
        <Separate size={30} />
        <div>
          <h3>备选条件</h3>
          <CheckboxGroup value="">
            {
              alterConditions.map(i => {
                return (
                  <Popconfirm
                    title="确定后同时在表单中变更为必选条件"
                    onConfirm={() => this.confirmAlterCondition(i.value)}
                  >
                    <Checkbox value={i.value}>{i.label}</Checkbox>
                  </Popconfirm>
                );
              })
            }
          </CheckboxGroup>
        </div>
      </Modal>
    );
  }
}

export default connect(({ processConfigEdit, loading }) => ({ ...processConfigEdit, loading }))(ConditionModal);
