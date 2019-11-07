/*
 * @Description: 指定分类弹窗
 * @Author: danding
 * @Date: 2019-09-16 10:48:36
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 18:00:55
 */

import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import { getSelectedGroupOrDeptEnum } from 'constants/components/process/processConfigEdit';

const { Modal, TreeSelect } = window.antd;

class CustomGroupModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const { isMultiple, value, dataProvider } = props;
    this.state = {
      value: isMultiple
        ? getSelectedGroupOrDeptEnum(value, dataProvider)
        : value
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.combineSelectedVals(nextProps.value, nextProps.dataProvider);
    }
  }

  combineSelectedVals = (selectedKeys, dataProvider = []) => {
    const { isMultiple } = this.props;
    const vals = isMultiple
      ? getSelectedGroupOrDeptEnum(selectedKeys, dataProvider)
      : selectedKeys;
    this.setState({
      value: vals
    });
  }

  hideModal = () => {
    this.props.hideModal();
    const { dataProvider, value } = this.props;
    this.combineSelectedVals(value, dataProvider);
  }

  onSubmit = () => {
    this.hideModal();
    const { isMultiple } = this.props;
    const { value } = this.state;
    const keys = isMultiple ? value.map(i => i.value) : value;
    this.props.onSubmit(keys);
  }

  changeValue = (value) => {
    this.setState({
      value
    });
  }

  render() {
    const { value } = this.state;
    const { visible, dataProvider, isMultiple = true } = this.props;

    return (
      <Modal
        title="指定分类"
        visible={visible}
        width={400}
        onCancel={this.hideModal}
        onOk={this.onSubmit}
      >
        <TreeSelect
          showSearch
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeNodeFilterProp="title"
          multiple={isMultiple}
          value={value}
          onChange={this.changeValue}
          placeholder="请选择"
          style={{width: '360px'}}
          treeData={cloneDeep(dataProvider)}
          treeCheckable={isMultiple}
          showCheckedStrategy={TreeSelect.SHOW_ALL}
          treeCheckStrictly
        />
      </Modal>
    );
  }
}

CustomGroupModal.propTypes = {
  visible: PropTypes.bool,
  dataProvider: PropTypes.array,
  value: PropTypes.array,
  isMultiple: PropTypes.bool
};

CustomGroupModal.defaultProps = {
  visible: false,
  dataProvider: [],
  value: [],
  isMultiple: true
};

export default CustomGroupModal;
