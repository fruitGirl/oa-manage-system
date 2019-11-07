/*
 * @Description: 指定人员弹窗
 * @Author: danding
 * @Date: 2019-09-16 10:48:36
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-16 17:43:14
 */

import React from 'react';
import PropTypes from 'prop-types';
import SearchSelect from 'components/common/SearchSelect';
import { GET_USER_BY_NAME_URL } from 'constants/common';
import { getSelectedUserEnum } from 'constants/components/process/processConfigEdit';

const { Modal } = window.antd;

class CustomUserModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value, isMultiple, dataProvider } = props;
    const selectedIds = isMultiple ? value : [value];
    const defaultUser = getSelectedUserEnum(selectedIds, dataProvider);
    this.state = {
      value: props.value,
      defaultUser: defaultUser || []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value, isMultiple, dataProvider } = nextProps;

    // 修改选中项或数据源初始化完成
    if (
      (this.props.value !== value)
      || (this.props.dataProvider !== dataProvider)
    ){
      const selectedIds = isMultiple ? value : [value];
      const defaultUser = getSelectedUserEnum(selectedIds, dataProvider);
      this.setState({
        value: value,
        defaultUser
      });
    }
  }

  hideModal = () => {
    this.props.hideModal();
    const { value, isMultiple, dataProvider } = this.props;
    const selectedIds = isMultiple ? value : [value];
    const defaultUser = getSelectedUserEnum(selectedIds, dataProvider);
    this.setState({
      value,
      defaultUser
    });
  }

  onSubmit = () => {
    this.hideModal();
    this.props.onSubmit(this.state.value);
  }

  changeValue = (value) => {
    this.setState({
      value
    });
  }

  render() {
    const { value, defaultUser } = this.state;
    const { visible, isMultiple = true } = this.props;

    return (
      <Modal
        title="指定人员"
        visible={visible}
        width={400}
        onCancel={this.hideModal}
        onOk={this.onSubmit}
      >
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
          mode={isMultiple ? "multiple" : ''}
          value={value}
          onChange={this.changeValue}
          placeholder='请输入关键字进行选择'
          action={GET_USER_BY_NAME_URL}
          param="nickName"
          defaultDataProvider={defaultUser}
        />
      </Modal>
    );
  }
}

CustomUserModal.propTypes = {
  visible: PropTypes.bool,
  dataProvider: PropTypes.array,
  value: PropTypes.array,
  isMultiple: PropTypes.bool
};

CustomUserModal.defaultProps = {
  visible: false, // 弹窗显隐
  dataProvider: [], // 全部人员数据
  value: [], // 选中的人员主键集合
  isMultiple: true, // 是否多选
};

export default CustomUserModal;
