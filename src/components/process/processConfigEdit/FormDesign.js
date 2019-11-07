/*
 * @Description: 流程-表单设计
 * @Author: danding
 * @Date: 2019-09-17 11:40:18
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-17 17:03:32
 */

import React from 'react';
import DragForm from 'components/businessCommon/dragForm';
import { connect } from 'dva';
import { CONDITION_PROCESS_TYPE } from 'constants/components/process/processConfigEdit';

const { message } = window.antd;

class FormDesign extends React.PureComponent {
  selectTargetItem = (item) => {
    this.props.dispatch({
      type: 'processConfigEdit/setSelectTargetItem',
      payload: item
    });
  }

  removeTargetItem = (idx, item) => {
    if (this.isCondition(item.paramName)) {
      message.warning('该组件已被设置为条件，不可删除');
      return;
    }
    this.props.dispatch({
      type: 'processConfigEdit/removeTargetItem',
      payload: idx
    });
  }

  // 是否已被设置为条件
  isCondition = (compareParamName) => {
    const { startNodeConfig } = this.props;
    let allConditionParams = [];
    this.getAllCondition(allConditionParams, startNodeConfig);
    return allConditionParams.includes(compareParamName);
  }

  getAllCondition = (conditions = [], configs = []) => {
    for (let i = 0; i < configs.length; i++) {
      const {
        type,
        childNodes,
        processConditionNodePropertiesList = []
      } = configs[i];

      // 条件节点
      if (type === CONDITION_PROCESS_TYPE) {
        processConditionNodePropertiesList.forEach(j => {
          conditions.push(j.paramName);
        });
      } else {
        this.getAllCondition(conditions, childNodes);
      }
    }
  }

  updateTargetconfigs = (payload) => {
    this.props.dispatch({
      type: 'processConfigEdit/updateTargetconfigs',
      payload
    });
  }

  updateSelectTargetConfig = (payload) => {
    this.selectTargetItem(payload);
  }

  render() {
    const { targetConfigs, selectedTargetItem } = this.props;
    const { paramName, props } = selectedTargetItem;
    const isCondition = this.isCondition(paramName);
    const combineSelectedItem = {
      ...selectedTargetItem,
      props: { ...props, isCondition }
    };
    return (
      <DragForm
        onSelectTargetItem={this.selectTargetItem}
        targetConfigs={targetConfigs}
        selectedTargetItem={combineSelectedItem}
        removeTargetItem={this.removeTargetItem}
        updateTargetconfigs={this.updateTargetconfigs}
        onUpdateSelectTargetConfig={this.updateSelectTargetConfig}
      />
    );
  }
}

export default connect(({ processConfigEdit, loading }) => ({ ...processConfigEdit, loading }))(FormDesign);
