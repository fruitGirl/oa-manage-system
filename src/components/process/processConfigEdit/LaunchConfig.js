/*
 * @Description: 发起流程的配置
 * @Author: danding
 * @Date: 2019-09-18 15:55:49
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 19:12:20
 */

import React from 'react';
import { connect } from 'dva';
import RoleRange from 'components/process/processConfigEdit/RoleRange';

const { Form } = window.antd;
const FormItem = Form.Item;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

class LaunchConfig extends React.PureComponent {
  // 修改可见性范围
  changeVisibleType = (payload) => {
    this.props.dispatch({
      type: 'processConfigEdit/changeVisibleType',
      payload
    });
  }

  // 修改可见性的选中值
  changeVisibleIds = (payload) => {
    this.props.dispatch({
      type: 'processConfigEdit/changeVisibleIds',
      payload
    });
  }

  render() {
    const { normalInfo, allGroups, allDepts, allUsers,  processVisibleConfig: { visibleObjectType, visibleObjectIds } } = this.props;
    const { name } = normalInfo;

    return (
      <div>
        <h3 className="process-title">设置发起</h3>
        <Form
          colon={false}
          { ...layout }
        >
          <FormItem label="审批名称">
            <span>{name || '--'}</span>
          </FormItem>
          <FormItem label="发起人">
            <RoleRange
              enableSelectCompany={true}
              selectedType={visibleObjectType}
              selectedIds={visibleObjectIds}
              onChangeVisibleType={this.changeVisibleType}
              onChangeVisibleIds={this.changeVisibleIds}
              allUsers={allUsers}
              allDepts={allDepts}
              allGroups={allGroups}
            />
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect(({ processConfigEdit, loading }) => ({ ...processConfigEdit, loading }))(LaunchConfig);

