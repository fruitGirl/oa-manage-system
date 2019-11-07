/*
 * @Description: 指定部门
 * @Author: moran
 * @Date: 2019-09-19 10:02:59
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 19:10:25
 */

import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import CompanyTree from 'components/businessCommon/CompanyTree';
import Separate from 'components/common/Separate';
import 'styles/components/process/processConfigEdit/CustomDepartModal.less';

const { Modal, Row, Col, Icon } = window.antd;

class CustomDepartModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dataProvider, enableSelectCompany } = props;
    this.state = {
      selectDepartmentLists: props.value || [],
      dataProvider: this.combineDataProvider(dataProvider, enableSelectCompany)
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        selectDepartmentLists: nextProps.value
      });
    }

    if (this.props.dataProvider !== nextProps.dataProvider) {
      const data = this.combineDataProvider(nextProps.dataProvider, nextProps.enableSelectCompany);
      this.setState({
        dataProvider: data
      });
    }
  }

  combineDataProvider = (data = [], enableSelectCompany) => {
    const dataProvider = cloneDeep(data);
    return dataProvider.map(i => {
      return {
        ...i,
        checkable: enableSelectCompany
      };
    });
  }

  handleCheck = (selectDepartment) => {
    this.setState({
      selectDepartmentLists: selectDepartment
    });
  }

  handleSubmit = () => {
    this.hideModal();
    const ids = this.state.selectDepartmentLists.map(i => i.key);
    this.props.onSubmit(ids);
  }

  handleDelete = (row) => {
    const { selectDepartmentLists } = this.state;
    this.setState({
      selectDepartmentLists: selectDepartmentLists.filter(item => item.key !== row.key)
    });
  }

  hideModal = () => {
    this.props.hideModal();
    this.setState({
      selectDepartmentLists: this.props.value
    });
  }

  render() {
    const { visible } = this.props;
    const { selectDepartmentLists, dataProvider } = this.state;
  
    return (
      <Modal
        title='选择部门'
        visible={visible}
        width={600}
        style={{ top: 20 }}
        onCancel={this.hideModal}
        onOk={this.handleSubmit}
      >
        <Row gutter={16}>
          <Col
            span={12}
            className="department-wrapper"
          >
            <CompanyTree
              dataProvider={dataProvider}
              check={this.handleCheck}
              selectDepartmentLists={selectDepartmentLists}
            />
          </Col>
          <Col span={12}>
            <div>已选部门</div>
            <Separate />
            {
              selectDepartmentLists.map(i => {
                const { key, title, companyName } = i;
                return (
                  <div key={key} className="selected-item">
                    <span>{companyName ? `${companyName}-` : ''}{title}</span>
                    <Icon
                      type="close-circle"
                      className="pull-right remove-item-icon"
                      onClick={() => this.handleDelete(i)}
                    />
                  </div>
                );
              })
            }
          </Col>
        </Row>
      </Modal>
    );
  }
}

CustomDepartModal.propTypes = {
  visible: PropTypes.bool,
  dataProvider: PropTypes.array,
  value: PropTypes.array,
  enableSelectCompany: PropTypes.bool
};

CustomDepartModal.defaultProps = {
  visible: false,
  dataProvider: [],
  value: [],
  enableSelectCompany: false
};

export default CustomDepartModal;
