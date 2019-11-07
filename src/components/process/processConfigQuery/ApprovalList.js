/*
 * @Description: 流程列表
 * @Author: danding
 * @Date: 2019-09-27 16:30:02
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 16:30:02
 */

import React from 'react';
import { connect } from 'dva';
import cloneDeep from 'lodash.clonedeep';
import ApprovalItem from 'components/process/processConfigQuery/ApprovalItem';
import 'styles/components/process/processConfigQuery/approvalList.less';
import Separate from 'components/common/Separate';
import Sortable from 'react-sortablejs';

const { Row, Col, Modal, Empty, Spin } = window.antd;

class ApprovalList extends React.PureComponent {
  setSortClassifiId = (payload) => {
    this.props.dispatch({
      type: 'processConfigQuery/setCurSortClassifiId',
      payload
    });
  }

  rename = (payload) => {
    this.props.dispatch({
      type: 'processConfigQuery/displayClassifMsgModal',
      payload: true
    });
    this.props.dispatch({
      type: 'processConfigQuery/setClassifMsg',
      payload: payload
    });
  }

  onRemove = (payload) => {
    const { count } = payload;
    if (count) {
      Modal.warning({
        title: '提示',
        content: '分类下存在审批，无法删除',
        okText: '确定'
      });
    } else {
      this.props.dispatch({
        type: 'processConfigQuery/removeClassification',
        payload
      });
    }
  }

  handleUseStatus = (payload) => {
    this.props.dispatch({
      type: 'processConfigQuery/handleUseStatus',
      payload
    });
  }

  handleMoveProcess = (payload) => {
    this.props.dispatch({
      type: 'processConfigQuery/displayProcessMoveModal',
      payload: true
    });
    this.props.dispatch({
      type: 'processConfigQuery/setMoveProcessData',
      payload
    });
  }

  sortProcessItem = (event, processConfigs, classId) => {
    // 组内排序
    const { newIndex, oldIndex, item } = event;
    const target = processConfigs[newIndex];
    const targetId = target && target.id;
    const dataId = item.getAttribute('data-id');
    const payload = {
      id: dataId,
      targetId
    };
    this.props.dispatch({
      type: 'processConfigQuery/sortProcessItem',
      payload
    });

    // 分类下的审批列表排序
    let cloneList = cloneDeep(processConfigs);
    const cloneItem = cloneList.splice(oldIndex, 1)[0];
    cloneList.splice(newIndex, 0, cloneItem);

    // 更新所有的分类信息
    let { classifsMsg } = this.props;
    classifsMsg = cloneDeep(classifsMsg);
    const matchIdx = classifsMsg.findIndex(j => j.id === classId);
    classifsMsg[matchIdx] = {
      ...classifsMsg[matchIdx],
      processConfigs: cloneList
    };

    // 更新分类数据
    this.props.dispatch({
      type: 'processConfigQuery/setClassifsMsg',
      payload: classifsMsg
    });
  }

  render() {
    const { classifsMsg, loading, curSortClassifiId } = this.props;
    const isNotData = !classifsMsg || !classifsMsg.length;
    const listLoading = loading.effects['processConfigQuery/getClassifsMsg'];

    return (
      <Spin spinning={listLoading}>
        {
          classifsMsg.map(i => {
            const { processConfigs = [], name, id } = i;
            const count = processConfigs ? processConfigs.length : 0;
            const isSortingClassifi = id === curSortClassifiId;
            const hasMask = curSortClassifiId && !isSortingClassifi;

            return (
              <div key={id} className={`approval-list-wrapper ${hasMask ?  'approval-list-wrapper-mask' : '' }`}>
                <div className="clearfix item-header">
                  <div className="pull-left classification-name">{name}({count})</div>
                  <div className="pull-right classification-operate">
                    <a href="javascript:;" onClick={() => this.rename({
                      name,
                      id
                    })}>重命名</a>
                    <a href="javascript:;" onClick={() => this.onRemove({ id, count })}>删除</a>
                    {
                      isSortingClassifi
                        ? <a className="active-operate" href="javascript:;" onClick={() => this.setSortClassifiId()}>完成</a>
                        : <a href="javascript:;" onClick={() => this.setSortClassifiId(id)}>排序</a>
                    }
                  </div>
                </div>
                <Separate size={20} />
                <Row gutter={16}>
                  <Sortable
                    options={{
                      group: {
                        name: 'grid',
                        pull: false
                      },
                      animation: 150,
                      swapThreshold: 0.65,
                      fallbackOnBody: true,
                      handle: '.J-drag-handle',
                    }}
                    onChange={(a, b, event) => this.sortProcessItem(event, processConfigs, id)}
                  >
                    {
                      processConfigs.map(j => {
                        return (
                          <Col  data-id={j.id} span={8} key={j.id}>
                            <ApprovalItem
                              ableDrag={isSortingClassifi}
                              data={{ ...j, parentId: id }}
                              dragClass="J-drag-handle"
                              handleUseStatus={this.handleUseStatus}
                              handleMove={this.handleMoveProcess}
                            />
                          </Col>
                        );
                      })
                    }
                  </Sortable>
                </Row>
                {
                  count
                    ? null
                    : <div className="item-empty-wrapper">暂无数据</div>
                }
              </div>
            );
          })
        }
        {
          (isNotData && !listLoading) && (
            <div className="empty-wrapper"><Empty /></div>
          )
        }
      </Spin>
    );
  }
}

export default connect(({ processConfigQuery, loading, }) => ({ ...processConfigQuery, loading }))(ApprovalList);
