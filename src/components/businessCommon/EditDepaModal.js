/*
 * @Description: 新增/编辑部门
 * @Author: danding
 * @Date: 2019-05-13 12:30:16
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:57:41
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ADD_MODE, EDIT_MODE, FORM_LAYOUT } from 'constants/components/common/editDepaModal';
import TreeSelectComptent from 'components/businessCommon/TreeSelectComptent';
import { ALL_ENABLE_USER_URL } from 'constants/common';

const { Modal, Form, Input, Select, Radio } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class EditDepaModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSelectTopLevel: false, // 是否选择了第一层部门选项
      usersData: []
    };
  }

  componentDidMount() {
    this.getLeader();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.dataProvider !== nextProps.dataProvider) {
      const { isTopDep } = nextProps.dataProvider;
      this.setState({
        isSelectTopLevel: isTopDep
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataProvider !== prevProps.dataProvider) {
      const {
        isTopDep,
        departmentName,
        parentDepartmentName,
        manager
      } = this.props.dataProvider;
      this.props.form.setFieldsValue({
        isTopDep,
        parentId: isTopDep ? null : parentDepartmentName,
        departmentName,
        manager
      });
    }
  }

  // 获取负责人数据
  async getLeader() {
    try {
      const users = await T.get(ALL_ENABLE_USER_URL);
      const { userList } = users.outputParameters;
      const usersData = userList.map(i => {
        const { nickName, userId } = i;
        return {
          label: nickName,
          value: userId
        };
      });
      this.setState({
        usersData
      });
    } catch (err) {
      T.showErrorMessage(err);
    }
  }

  submit = () => {
    const { isSelectTopLevel } = this.state;
    const { form, dataProvider } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { parentId } = values;
        if (
          !isSelectTopLevel
          && (parentId === dataProvider.parentDepartmentName)
        ) {
          values.parentId = dataProvider.parentId;
        }
        this.props.handleSumbit && this.props.handleSumbit(values);
      }
    });
  }

  changeLevel = (e) => {
    this.setState({ isSelectTopLevel: e.target.value });
  }

  render() {
    const {
      visible,
      form,
      hideModal,
      loading,
      mode
    } = this.props;
    const { isSelectTopLevel, usersData, } = this.state;
    const { getFieldDecorator, } = form;
    const showDepaLevel = mode === EDIT_MODE;
    const showParentDepa = (mode === EDIT_MODE) && !isSelectTopLevel;

    return (
      <Modal
        title={mode === ADD_MODE ? '添加部门' : '编辑部门'}
        visible={visible}
        width={400}
        onCancel={hideModal}
        onOk={this.submit}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          {...FORM_LAYOUT}
        >
         {
           showDepaLevel
            ? (
                <FormItem
                  label="公司第一层部门"
                  colon={false}
                  {...FORM_LAYOUT}
                >
                  {getFieldDecorator('isTopDep')(
                    <RadioGroup onChange={this.changeLevel}>
                      <Radio value={true}>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              )
              : null
          }
          { showParentDepa
              ? <FormItem
                label="上级部门"
                colon={false}
                {...FORM_LAYOUT}
              >
                {getFieldDecorator('parentId', {rules: [{required: true, message: '必填项'}]})(
                  <TreeSelectComptent style={{ width: '100%' }} />
                )}
              </FormItem>
              : null
          }
          <FormItem
            label="部门名称"
            colon={false}
            {...FORM_LAYOUT}
          >
            {getFieldDecorator('departmentName', {
              rules: [{required: true, message: '必填项', whitespace: true}]
            })(
              <Input maxLen={20} placeholder="请选择，最多20字" />
            )}
          </FormItem>
          <FormItem
            label="部门负责人"
            colon={false}
            {...FORM_LAYOUT}
          >
            {getFieldDecorator('manager', {
              rules: [{required: true, message: '必填项'}]
            })(
              <Select showSearch optionFilterProp='children' placeholder="请选择">
                {
                  usersData.map(i => {
                    const { label, value } = i;
                    return <Option value={value}>{ label }</Option>;
                  })
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

EditDepaModal.propTypes = {
  visible: PropTypes.bool,
  hideModal: PropTypes.func,
  loading: PropTypes.bool
};

EditDepaModal.defaultProps = {
  visible: false,
  hideModal: () => {},
  loading: false
};

export default Form.create()(EditDepaModal);
