/*
 * @Description: 流程-我的发起/抄送-详情抽屉
 * @Author: moran 
 * @Date: 2019-09-10 18:14:30 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-11 17:47:44
 */
import { connect } from 'dva';
import React from 'react';
import InfoList from 'components/businessCommon/InfoList';
import InfoBlock from 'components/businessCommon/InfoBlock';
import RecallNoteModal from 'components/process/myInitiateQuery/RecallNoteModal';
import { APPROVE } from 'constants/process/index';
const { Button, Spin } = window.antd;

const { Drawer } = window.antd;

class InitateDrawer extends React.Component {
  // 确定撤回
  handleRecall = (values) => {
    const {
      id,
      statusEnum
    } = this.props.processConfigs;
    const { memo } = values;
    this.props.dispatch({
      type: 'myInitiateQuery/recallProcess',
      payload: { processInstanceId: id, statusEnum, memo }
    });
    this.props.close();
  }

  // 撤回按钮
  handleRecallVisible = () => {
    this.props.dispatch({
      type: 'myInitiateQuery/displayRecallModal',
      payload: true
    });
  }

  render() {
    const {
      visible,
      isShowBtn,
      processConfigs,
      loading,
      isShowRecallModal
    } = this.props;
    const {
      processFormDataList,
      processNodeInstanceInfoList,
      status = {
        name: ''
      },
      name
    } = processConfigs;
    const isStatusShowBtn = (status.name === APPROVE ); // 未审批显示撤回

    // title显示
    const titleContent = (isShowBtn && isStatusShowBtn) ? (
      <Button onClick={this.handleRecallVisible}>撤回</Button>
    ) : (<div style={{height: "20px"}}>{name}</div>);

    const detailLoading = loading.effects['myApprovalQuery/getProcessDetail'];

    return (
      <Drawer
        title={titleContent}
        width={900}
        visible={visible}
        onClose={this.props.close}
      >
        <Spin spinning={detailLoading}>
          <div style={{marginBottom: '30px'}}>
            <InfoBlock configs={processNodeInstanceInfoList} />
          </div>
          <InfoList configs={processFormDataList}/>
        </Spin>
        <RecallNoteModal
          visible={isShowRecallModal}
          submit={this.handleRecall}/>
      </Drawer>
    );
  }
}

InitateDrawer.propTypes = {
  processConfigs: PropTypes.object, // 数据源
};

InitateDrawer.defaultProps = {
  processConfigs: {},
};

export default connect (({ myInitiateQuery, myApprovalQuery, loading }) => ({ ...myInitiateQuery, ...myApprovalQuery, loading }))(InitateDrawer);
