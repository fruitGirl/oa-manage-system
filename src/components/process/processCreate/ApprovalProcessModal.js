/*
 * @Description: 审批流程抽屉
 * @Author: moran 
 * @Date: 2019-09-19 17:56:23 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-10 17:29:47
 */
 import { connect } from 'dva';
 import React from 'react';
 import ApprovalProcess from "components/process/processCreate/ApprovalProcess";
 const { Modal, Spin } = window.antd;

 class ApprovalProcessModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectPersonDatas: {} // 选择的人员数据
    };
  }
  // 选择人员
  handleSubmit = (values) => {
    this.setState({
      selectPersonDatas: { ...this.state.selectPersonDatas, ...values }
    });
  }
   render() {
     const {visible, hide, configs, loading} = this.props;
     const { selectPersonDatas } = this.state;
     const modalLoading = loading.effects['processCreate/previewProcessNode']; // 渲染流程loading
     const confirmLoading = loading.effects['processCreate/createProcess']; // 确认loading
     
     return (
      <Modal
        title="审批流程"
        width="650px"
        visible={visible}
        onOk={() => this.props.confirm(selectPersonDatas)}
        onCancel={hide}
        confirmLoading={confirmLoading}
        okText="确认"
        cancelText="取消"
      >
        <Spin spinning={modalLoading}>
          <ApprovalProcess
            configs={configs}
            submit={this.handleSubmit}/>
        </Spin>
      </Modal>
     );
   }
 }

 ApprovalProcess.propTypes = {
  configs: PropTypes.array.isRequired, // 审批流程块配置
};

ApprovalProcess.defaultProps = {
  configs: [],
};

export default connect(({ loading }) => ({ loading }))(ApprovalProcessModal);
