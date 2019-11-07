/*
 * @Description: 流程-我的审核-审核
 * @Author: moran 
 * @Date: 2019-09-10 18:14:30 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-08 10:20:18
 */
import { connect } from 'dva';
import React from 'react';
import InfoList from 'components/businessCommon/InfoList';
import ExinameProcess from './ExinameProcess';

const { Drawer, Spin } = window.antd;

class MyExinameDrawer extends React.Component {
  render() {
    const {
      visible,
      processConfigs,
      loading
    } = this.props;
    const {
      processFormDataList,
      processNodeInstanceInfoList,
      name,
      approveDetailId,
      id,
      statusEnum
    } = processConfigs;

    const detailLoading = loading.effects['myApprovalQuery/getProcessDetail'];

    return (
      <Drawer
        title={name}
        width={800}
        visible={visible}
        onClose={this.props.close}
      >
        <Spin spinning={detailLoading}>
          <InfoList configs={processFormDataList}/>
          <ExinameProcess
            approvalNodes={{processNodeInstanceInfoList, approveDetailId, id, statusEnum}}
            close={this.props.close}/>
        </Spin>
      </Drawer>
    );
  }
}

MyExinameDrawer.propTypes = {
  processConfigs: PropTypes.object, // 数据源
};

MyExinameDrawer.defaultProps = {
  processConfigs: {},
};

export default connect (({ myApprovalQuery, loading }) => ({ ...myApprovalQuery, loading }))(MyExinameDrawer);
