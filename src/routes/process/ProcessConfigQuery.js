/*
 * @Description: 审核流程管理
 * @Author: danding
 * @Date: 2019-09-10 14:07:20
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-10 16:40:36
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import Header from 'components/process/processConfigQuery/Header';
import Separate from 'components/common/Separate';
import ApprovalList from 'components/process/processConfigQuery/ApprovalList';
import ClassificationEditModal from 'components/process/processConfigQuery/ClassificationEditModal';
import MoveProcessModal from 'components/process/processConfigQuery/MoveProcessModal';
import SortClassificationModal from 'components/process/processConfigQuery/SortClassificationModal';

class ProcessConfigQuery extends React.PureComponent {
  UNSAFE_componentWillMount() {
    this.onSearch();
  }

  // 查询审批集合
  onSearch = (payload) => {
    this.props.dispatch({
      type: 'processConfigQuery/getClassifsMsg',
      payload
    });
  }

  // 新增审批
  goCreatePage = () => {
    T.tool.redirectTo('/process/processConfigCreate.htm');
  }

  // 新增分类
  addClassification = () => {
    this.props.dispatch({
      type: 'processConfigQuery/displayClassifMsgModal',
      payload: true
    });
  }

  // 隐藏分类弹窗
  hideClassifMsgModal = () => {
    this.props.dispatch({
      type: 'processConfigQuery/displayClassifMsgModal',
      payload: false
    });
    this.props.dispatch({
      type: 'processConfigQuery/setClassifMsg',
      payload: {}
    });
  }

  // 保存分类信息
  saveClassifMsg = (payload) => {
    this.props.dispatch({
      type: 'processConfigQuery/saveClassifMsg',
      payload
    });
  }

  // 分类排序
  handleSortClassifation = () => {
    this.props.dispatch({
      type: 'processConfigQuery/displayClassifSortModal',
      payload: true
    });
  }

  // 隐藏分类排序
  hideClassifSortModal = () => {
    this.props.dispatch({
      type: 'processConfigQuery/displayClassifSortModal',
      payload: false
    });
  }

  // 保存分类排序
  saveClassifSort = (payload) => {
    this.props.dispatch({
      type: 'processConfigQuery/saveClassifSort',
      payload
    });
  }

  // 移动到
  saveProcessMove = (payload) => {
    this.props.dispatch({
      type: 'processConfigQuery/saveProcessMove',
      payload
    });
  }

  // 隐藏移动到的排序弹窗
  hideProcessMoveModal = (payload) => {
    this.props.dispatch({
      type: 'processConfigQuery/displayProcessMoveModal',
      payload: false
    });
  }

  render() {
    const { showClassifMsgModal, editingClassifMsg, loading, showClassifSortModal, classifsMsg, movingProcessMsg, showProcessMoveModal } = this.props;
    const isSavingClassifMsg = loading.effects['processConfigQuery/saveClassifMsg'];
    const isSavingClassifSort = loading.effects['processConfigQuery/saveClassifSort'];
    const isSavingProcessMove = loading.effects['processConfigQuery/saveProcessMove'];

    return (
      <BasicLayout>
        <Header
          onSort={this.handleSortClassifation}
          onSearch={this.onSearch}
          goCreatePage={this.goCreatePage}
          addClassification={this.addClassification}
        />
        <Separate size={34} />
        <ApprovalList />
        <ClassificationEditModal
          detailMsg={editingClassifMsg}
          visible={showClassifMsgModal}
          hideModal={this.hideClassifMsgModal}
          onSubmit={this.saveClassifMsg}
          loading={isSavingClassifMsg}
        />
        <SortClassificationModal
          list={classifsMsg}
          visible={showClassifSortModal}
          hideModal={this.hideClassifSortModal}
          onSubmit={this.saveClassifSort}
          loading={isSavingClassifSort}
        />
        <MoveProcessModal
          classificList={classifsMsg}
          processMsg={movingProcessMsg}
          visible={showProcessMoveModal}
          loading={isSavingProcessMove}
          onSubmit={this.saveProcessMove}
          hideModal={this.hideProcessMoveModal}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ processConfigQuery, loading, }) => ({ ...processConfigQuery, loading }))(ProcessConfigQuery);
