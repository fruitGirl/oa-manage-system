/*
 * @Description: 团队配置
 * @Author: danding
 * @Date: 2019-07-09 10:39:48
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-16 17:29:05
 */

import React from 'react';
import { connect } from 'dva';
import SearchSelect from 'components/common/SearchSelect';
import { GET_USER_BY_NAME_URL } from 'constants/common';

const { Modal, Form, Input, Radio, TreeSelect } = window.antd;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class EditTeamModal extends React.PureComponent {
  componentDidMount() {
    this.getDepartments();
  }

  // 获取部门数据
  getDepartments() {
    this.props.dispatch({
      type: 'teamQuery/getDepartments'
    });
  }

  componentDidUpdate(prevProps) {
    // 设置弹窗内的输入框值
    if (this.props.editTeamMsg !== prevProps.editTeamMsg) {
      this.props.form.setFieldsValue(this.props.editTeamMsg);
    }
  }

  submit = () => {
    const { form, editTeamMsg } = this.props;
    form.validateFields((err) => {
      if (!err) {
        const payload = form.getFieldsValue();
        const { enabled } = payload;
        if (!enabled && editTeamMsg.enabled) { // 当编辑时，有效性改为无效
          Modal.confirm({
            title: '操作提示',
            content: '无效后，团队内的部门及负责人将删除，无法恢复，确认继续吗？',
            onOk: () => {
              this.props.dispatch({
                type: 'teamQuery/saveTeamConfig',
                payload
              });
            }
          });
        } else {
          this.props.dispatch({
            type: 'teamQuery/saveTeamConfig',
            payload
          });
        }
      }
    });
  }

  hideModal = () => {
    this.props.dispatch({
      type: 'teamQuery/displayModal',
      payload: false
    });
  }

  render() {
    const {
      showModal,
      form,
      loading,
      departmentData = [],
      defaultUser,
      editTeamMsg
    } = this.props;

    const { getFieldDecorator, } = form;
    const btnLoading = loading.effects['teamQuery/saveTeamConfig'] || false;
    const isEditMode = editTeamMsg.id; // 是否编辑模式
    const title = isEditMode ? '编辑团队' : '新建团队';
    const tProps = {
      treeData: departmentData,
      multiple: true,
      searchPlaceholder: '请选择',
      treeNodeFilterProp: 'title',
      treeDefaultExpandedKeys: editTeamMsg.manageDepartmentIds || []
    };

    return (
      <Modal
        title={title}
        visible={showModal}
        width={500}
        onCancel={this.hideModal}
        onOk={this.submit}
        destroyOnClose={true}
        confirmLoading={btnLoading}
      >
        <Form
          {...formItemLayout}
        >
          <FormItem
            label="团队名称"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '请填写名称',
                whitespace: true
              }]
            })(
              <Input
                maxLength={15}
                placeholder="请输入名称，最多15字"
              />
            )}
          </FormItem>
          <FormItem
            label="部门"
            colon={false}
            {...formItemLayout}
            help="提示：仅能选择二级部门及其子部门，支持多选"
          >
            {getFieldDecorator('manageDepartmentIds', {
              rules: [{
                required: true,
                message: '请选择部门名称'
              }]
            })(
              <TreeSelect {...tProps} />
            )}
          </FormItem>
          <FormItem
            label="团队负责人"
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('manager', {
              rules: [{
                required: true,
                message: '请选择负责人'
              }]
            })(
              <SearchSelect
                parseFunc={(data) => {
                  const { userList = [] } = data.outputParameters;
                  return userList.map(i => {
                    const { nickName, userId } = i;
                    return {
                      label: nickName,
                      value: userId
                    };
                  });
                }}
                action={GET_USER_BY_NAME_URL}
                param="nickName"
                defaultDataProvider={defaultUser}
              />
            )}
          </FormItem>
          { isEditMode
            ? <FormItem
                label="有效性"
                colon={false}
                {...formItemLayout}
              >
                {getFieldDecorator('enabled', {
                  initialValue: true
                })(
                  <Radio.Group>
                  <Radio value={true}>有效</Radio>
                  <Radio value={false}>无效</Radio>
                </Radio.Group>
                )}
              </FormItem>
            : null
          }
        </Form>
      </Modal>
    );
  }
}

export default connect(({ teamQuery, loading, }) => ({ ...teamQuery, loading }))(Form.create()(EditTeamModal));
