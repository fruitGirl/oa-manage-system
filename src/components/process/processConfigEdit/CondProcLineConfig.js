/*
 * @Description: 条件配置下的流程线
 * @Author: danding
 * @Date: 2019-09-19 15:15:10
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 16:24:06
 */

import React from 'react';
import { connect } from 'dva';
import cloneDeep from 'lodash.clonedeep';
import ProcessLine from 'components/process/processConfigEdit/ProcessLine';
import * as processConfigConst from 'constants/components/process/processConfigEdit';
import Separate from 'components/common/Separate';
import ApproveConfig from 'components/process/processConfigEdit/ApproveConfig';
import NoticeConfig from 'components/process/processConfigEdit/NoticeConfig';

const { Drawer, Button } = window.antd;

class CondProcLineConfig extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showApprovalDrawer: false,
      showNoticeDrawer: false
    };
  }

  // 选择流程卡片
  selectProcessCard = (data) => {
    const { type } = data;

    // 审批流程
    if (type === processConfigConst.APPROVE_PROCESS_TYPE) {
      this.setState({
        showApprovalDrawer: true
      });
    } else {
      this.setState({
        showNoticeDrawer: true
      });
    }

    this.props.dispatch({
      type: 'processConfigEdit/setSelectedConditionChildCard',
      payload: data
    });
  }

  findLastNodeKey = (key, config = []) => {
    if (!config || !config.length) {
      return key;
    } else {
      const childConfig = config[0];
      return this.findLastNodeKey(childConfig.key, childConfig.childNodes);
    }
  }

  // 查找当前修改的流程数据
  findProcessData = (compareKey, config = []) => {
    for (let i = 0; i < config.length; i++) {
      const { childNodes = [], key } = config[i];

      // 匹配到当前的选中项
      if (key === compareKey) {
        return config[i];
      } else if (childNodes && childNodes.length) {
        const findData = this.findProcessData(compareKey, childNodes);
        if (findData) return findData;
      }
    }
  }

  // 创建节点
  addProcessNode = (type) => {
    const { selectedProcessCard, startNodeConfig, } = this.props;
    const lineConfig = this.findProcessData(selectedProcessCard.key, startNodeConfig);
    const { childNodes = [], key } = lineConfig || {};
    const compareKey = this.findLastNodeKey(key, childNodes);

    // 当前有选中项
    let processNode;
    switch (type) {
      case processConfigConst.APPROVE_PROCESS_TYPE: { // 审批
        processNode = processConfigConst.createApprovalProcess();
        break;
      }
      case processConfigConst.NOTICE_PROCESS_TYPE: { // 抄送
        processNode = processConfigConst.createNoticeProcess();
        break;
      }
      case processConfigConst.CONDITION_PROCESS_TYPE: { // 条件
        processNode = processConfigConst.createConditionProcess();
        break;
      }
      default: break;
    }

    const cloneConfig = cloneDeep(startNodeConfig);
    this.createProcessNode({
      compareKey,
      config: cloneConfig,
      processNode,
      addType: type,
    });

    this.props.dispatch({
      type: 'processConfigEdit/updateProcessLine',
      payload: cloneConfig
    });

    this.props.dispatch({
      type: 'processConfigEdit/setSelectedConditionChildCard',
      payload: processNode
    });

    setTimeout(() => {
      document.querySelector('#root').scrollTop = document.querySelector('.J-layout').scrollHeight;
    }, 300);
  }

  /**
   * 创建流程节点(副作用：修改原始config)
   * @params {String} compareKey 比较的主键
   * @params {Array} config 流程配置
   * @params {Object} processNode 新增的流程配置
   * @params {String} addType 新增的流程类型
   *
   */
  createProcessNode = ({
    compareKey,
    config = [],
    processNode,
    addType
  }) => {
    for (let i = 0; i < config.length; i++) {
      const { childNodes, key } = config[i];

      // 匹配到当前的选中项
      if (key === compareKey) {

        // 无子节点
        if (!childNodes || !childNodes.length) {
          config[i].childNodes = [processNode];
        } else {
          const matchConditionIdx = childNodes.findIndex(i => i.type === processConfigConst.CONDITION_PROCESS_TYPE);

          // 子节点存在条件节点
          if (matchConditionIdx !== -1) {

            // 当前新增的是条件节点
            if (addType === processConfigConst.CONDITION_PROCESS_TYPE) {
              const childsTypes = childNodes.map(i => i.type);
              const matchLastIdx = childsTypes.lastIndexOf(processConfigConst.CONDITION_PROCESS_TYPE);
              config[i].childNodes.splice(matchLastIdx, 0, processNode);
            } else {
              const matchIdx = childNodes.findIndex(i => i.type !== processConfigConst.CONDITION_PROCESS_TYPE);

              // 原子节点内存在非条件节点
              if (matchIdx !== -1) {
                const matchItem = config[i].childNodes[matchIdx];
                processNode.childNodes = [matchItem];
                config[i].childNodes.splice(matchIdx, 1);
              }
              config[i].childNodes = [
                ...config[i].childNodes,
                processNode
              ];
            }
          } else {
            // 当前新增的是条件节点
            if (addType === processConfigConst.CONDITION_PROCESS_TYPE) {
              config[i].childNodes = [
                processNode,
                ...config[i].childNodes
              ];
            } else {
              config[i].childNodes = [{
                ...processNode,
                childNodes: config[i].childNodes
              }];
            }
          }
        }

        return;
      } else {
        this.createProcessNode({
          compareKey,
          config: childNodes,
          processNode,
          addType
        });
      }
    }
  }

  onCloseApprDrawer = () => {
    this.setState({
      showApprovalDrawer: false
    });
  }

  onCloseNoticeDrawer = () => {
    this.setState({
      showNoticeDrawer: false
    });
  }
  // 删除审批节点
  removeProcessItem = (processInfo) => {
    const { startNodeConfig } = this.props;
    const { key } = processInfo;
    const cloneConfig = cloneDeep(startNodeConfig);
    this.removeProcessNode(key, cloneConfig);
    this.props.dispatch({
      type: 'processConfigEdit/updateProcessLine',
      payload: cloneConfig
    });
    this.props.dispatch({
      type: 'processConfigEdit/setSelectedConditionChildCard',
      payload: {}
    });
  }

  // 删除节点
  removeProcessNode = (
    compareKey,
    config = []
  ) => {
    for (let i = 0; i < config.length; i++) {
      const { childNodes = [], key, type } = config[i];
      // 匹配到当前的选中项
      if (key === compareKey) {

        // 如果当前节点是条件节点
        if (type === processConfigConst.CONDITION_PROCESS_TYPE) {
          config.splice(i, 1);
        } else {
          // 存在条件流程
          if (childNodes && (childNodes.length > 1)) {
            config[i] = childNodes[childNodes.length - 1];
          } else {
            // 存在子节点
            if ((childNodes && childNodes[0])) {
              config[i] = childNodes[0];
            } else {
              config.shift();
            }
          }
        }
        return;
      } else {
        this.removeProcessNode(
          compareKey,
          childNodes,
        );
      }
    }
  }

  render() {
    const { showApprovalDrawer, showNoticeDrawer,  } = this.state;
    const { allUsers, allDepts, allGroups, selectedProcessCard, startNodeConfig, selectedConditionChildCard } = this.props;
    const lineConfig = this.findProcessData(selectedProcessCard.key, startNodeConfig);
    const { childNodes = [] } = lineConfig || {};
    const { type, key } = selectedConditionChildCard;
    const isSelectedAppr = type === processConfigConst.APPROVE_PROCESS_TYPE;
    const isSelectedNoti = type === processConfigConst.NOTICE_PROCESS_TYPE;

    return (
      <div>
        <h3 className="process-title">设置审批</h3>
        <div style={{width: '480px'}}>
          <ProcessLine
            onSelect={this.selectProcessCard}
            config={childNodes}
            allUsers={allUsers}
            allDepts={allDepts}
            allGroups={allGroups}
            selectedProcessCard={selectedConditionChildCard}
            onRemove={this.removeProcessItem}
          />
        </div>
        <div className="process-condition-operate">
        <a href="javascript:;" onClick={() => this.addProcessNode(processConfigConst.NOTICE_PROCESS_TYPE)}>添加抄送</a>
        <a href="javascript:;" onClick={() => this.addProcessNode(processConfigConst.APPROVE_PROCESS_TYPE)}>添加审批</a>
        </div>
        <Drawer
          width={750}
          title="审批"
          onClose={this.onCloseApprDrawer}
          visible={showApprovalDrawer}
        >
          { isSelectedAppr && <ApproveConfig
            selectedKey={key}
            key={key}
            configData={selectedConditionChildCard}
          /> }
          <div className="drawer-bottom">
            <Button
              onClick={this.onCloseApprDrawer}
            >
              取消
            </Button>
            <Separate isVertical={false} />
            <Button onClick={this.onCloseApprDrawer} type="primary">
              确定
            </Button>
          </div>
        </Drawer>
        <Drawer
          width={750}
          title="抄送"
          onClose={this.onCloseNoticeDrawer}
          visible={showNoticeDrawer}
        >
          { isSelectedNoti && <NoticeConfig key={key} selectedKey={key} /> }
          <div className="drawer-bottom">
            <Button
              onClick={this.onCloseNoticeDrawer}
            >
              取消
            </Button>
            <Separate isVertical={false} />
            <Button onClick={this.onCloseNoticeDrawer} type="primary">
              确定
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default connect(({ processConfigEdit, loading }) => ({ ...processConfigEdit, loading }))(CondProcLineConfig);
