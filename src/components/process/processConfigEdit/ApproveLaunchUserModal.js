/*
 * @Description: 发起人自选弹窗
 * @Author: danding
 * @Date: 2019-09-19 14:02:51
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 20:06:34
 */

import React from 'react';
import RoleRange from 'components/process/processConfigEdit/RoleRange';

const { Modal, InputNumber, Form } = window.antd;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const FormItem = Form.Item;

class ApproveLaunchUserModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const { selfSelectedNumber, selfSelectedRangeType, selfSelectedRangeIds } = props.dataProvider;
    this.state = {
      selfSelectedNumber, // 自选人数
      selfSelectedRangeType,
      selfSelectedRangeIds
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 更新数据
    if (this.props.dataProvider !== nextProps.dataProvider) {
      this.setData(nextProps.dataProvider);
    }
  }

  setData = (data) => {
    const { selfSelectedNumber, selfSelectedRangeType, selfSelectedRangeIds } = data;
    this.setState({
      selfSelectedNumber,
      selfSelectedRangeType,
      selfSelectedRangeIds
    });
  }

  handleSubmit = () => {
    const {
      selfSelectedNumber,
      selfSelectedRangeType,
      selfSelectedRangeIds,
    } = this.state;
    this.props.onSubmit({
      selfSelectedNumber,
      selfSelectedRangeType,
      selfSelectedRangeIds
    });
  }

  changeType = (val) => {
    this.setState({
      selfSelectedRangeType: val,
      selfSelectedRangeIds: []
    });
  }

  changeIds = (ids) => {
    this.setState({
      selfSelectedRangeIds: ids
    });
  }

  changeCount = (val) => {
    this.setState({
      selfSelectedNumber: val
    });
  }

  hideModal = () => {
    this.setData(this.props.dataProvider);
    this.props.hideModal();
  }

  render() {
    const { selfSelectedNumber, selfSelectedRangeIds, selfSelectedRangeType } = this.state;
    const { visible, allUsers, allDepts, allGroups } = this.props;

    return (
      <Modal
        title='发起人自选'
        visible={visible}
        width={600}
        onCancel={this.hideModal}
        onOk={this.handleSubmit}
      >
        <Form
          colon={false}
          { ...layout }
        >
          <FormItem label="选择人数">
            <InputNumber
              min={1}
              value={selfSelectedNumber}
              precision={0}
              onChange={this.changeCount}
            />
          </FormItem>
          <FormItem label="选择范围">
            <RoleRange
              selectedType={selfSelectedRangeType}
              selectedIds={selfSelectedRangeIds}
              onChangeVisibleType={this.changeType}
              onChangeVisibleIds={this.changeIds}
              allUsers={allUsers}
              allDepts={allDepts}
              allGroups={allGroups}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ApproveLaunchUserModal;
