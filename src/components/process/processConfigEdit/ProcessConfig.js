/*
 * @Description:
 * @Author: danding
 * @Date: 2019-09-25 12:04:34
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-25 12:10:58
 */

import React from 'react';
import { connect } from 'dva';
import cloneDeep from 'lodash.clonedeep';
import 'styles/components/process/processConfigEdit/processConfig.less';
import LaunchConfig from 'components/process/processConfigEdit/LaunchConfig';
import ApproveConfig from 'components/process/processConfigEdit/ApproveConfig';
import NoticeConfig from 'components/process/processConfigEdit/NoticeConfig';
import ConditionConfig from 'components/process/processConfigEdit/ConditionConfig';
import * as processConfigConst from 'constants/components/process/processConfigEdit';
import ProcessLine from 'components/process/processConfigEdit/ProcessLine';
import Separate from 'components/common/Separate';

const { message } = window.antd;

class ProcessConfig extends React.PureComponent {
  // 选择侧边栏的流程卡片
  selectSiderProcessCard = (data) => {
    this.props.dispatch({
      type: 'processConfigEdit/setSelectedSiderProcessCard',
      payload: data
    });
  }

  // 匹配右侧的配置功能组件
  matchRightConfig = (type) => {
    const { selectedProcessCard } = this.props;
    const { key } = selectedProcessCard;
    switch (type) {
      case processConfigConst.LAUNCH_PROCESS_TYPE: // 发起
        return <LaunchConfig />;
      case processConfigConst.APPROVE_PROCESS_TYPE: // 审批
        return (
          <ApproveConfig
            key={key}
            selectedKey={key}
            configData={selectedProcessCard}
          />
        );
      case processConfigConst.NOTICE_PROCESS_TYPE: // 抄送
        return <NoticeConfig key={key} selectedKey={key} />;
      case processConfigConst.CONDITION_PROCESS_TYPE: // 条件
          return <ConditionConfig key={key} selectedKey={key} />;
      default: return (
        <div className="text-gray9 text-center">
          <Separate size={50} />
          请选择左侧的流程，进行配置
        </div>
      );
    }
  }

  // 创建节点
  addProcessNode = (type) => {
    const { selectedProcessCard, startNodeConfig, } = this.props;

    // 当前选择条件情况下进行添加条件
    if (selectedProcessCard.type === processConfigConst.CONDITION_PROCESS_TYPE) {
      message.warn('请选择在非条件流程下进行条件流程');
      return;
    }
    const parentKey = selectedProcessCard.key;

    // 当前有选中项
    if (parentKey) {
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
          const ableAdd = this.enableAddCondition(10, parentKey);
          if (!ableAdd) {
            message.warn('条件最多10个！');
            return;
          }
          processNode = processConfigConst.createConditionProcess();
          break;
        }
        default: break;
      }

      const cloneConfig = cloneDeep(startNodeConfig);
      this.createProcessNode({
        compareKey: parentKey,
        config: cloneConfig,
        processNode,
        addType: type,
      });

      this.props.dispatch({
        type: 'processConfigEdit/updateProcessLine',
        payload: cloneConfig
      });

      this.props.dispatch({
        type: 'processConfigEdit/setSelectedSiderProcessCard',
        payload: processNode
      });
    } else {
      message.warn('请选中一个流程');
    }
  }

  // 是否可以增加条件数
  enableAddCondition = (maxCount = 10, parentKey) => {
    const { startNodeConfig } = this.props;
    const findData = this.findProcessData(parentKey, startNodeConfig);
    const findConditions = findData.filter((i) => {
      const { type } = i;
      return type === processConfigConst.CONDITION_PROCESS_TYPE;
    });
    return findConditions.length < (maxCount);
  }

  // 查找当前修改的流程数据
  findProcessData = (compareKey, config) => {
    for (let i = 0; i < config.length; i++) {
      const { childNodes = [], key } = config[i];

      // 匹配到当前的选中项
      if (key === compareKey) {
        return childNodes;
      } else if (childNodes && childNodes.length) {
        const findData = this.findProcessData(compareKey, childNodes);
        if (findData) return findData;
      }
    }
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
              processNode.priority = matchLastIdx + 2; // 设置优先级
              config[i].childNodes.splice(matchLastIdx + 1, 0, processNode);
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
              processNode.priority = 1; // 设置第一个优先级
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
          config.forEach((i, idx) => {
            const { type } = i;
            if (type === processConfigConst.CONDITION_PROCESS_TYPE) {
              i.priority = idx + 1; // 优先级重新排序
            }
          });
        } else {
          const hasCondition = childNodes.some(j => j.type === processConfigConst.CONDITION_PROCESS_TYPE);

          // 子节点存在条件流程
          if (childNodes && hasCondition) {

            const filterNode = childNodes.filter(k => k.type !== processConfigConst.CONDITION_PROCESS_TYPE);

            // 子节点存在非条件节点
            if (filterNode && filterNode.length) {
              config[0] = filterNode[0];
            } else {
              config.splice(0, config.length);
            }
          } else {
            // 存在子节点
            if ((childNodes && childNodes[0])) {
              config[i] = childNodes[0];
            } else {
              config.pop();
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

  // 删除流程
  removeProcessItem = (processConfig) => {
    const { startNodeConfig } = this.props;
    const { key } = processConfig;
    const cloneConfig = cloneDeep(startNodeConfig);
    this.removeProcessNode(key, cloneConfig);
    this.props.dispatch({
      type: 'processConfigEdit/updateProcessLine',
      payload: cloneConfig
    });
    this.props.dispatch({
      type: 'processConfigEdit/setSelectedSiderProcessCard',
      payload: {}
    });
  }

  render() {
    const { startNodeConfig, selectedProcessCard, allUsers, allDepts, allGroups } = this.props;
    const { type } = selectedProcessCard;

    return (
      <div className="process-config-wrapper">
        <div className="process-step-wrapper">
          <ProcessLine
            onSelect={this.selectSiderProcessCard}
            config={startNodeConfig}
            allUsers={allUsers}
            allDepts={allDepts}
            allGroups={allGroups}
            selectedProcessCard={selectedProcessCard}
            onRemove={this.removeProcessItem}
          />
          <div className="process-operate-wrapper">
            <a href="javascript:;" onClick={() => this.addProcessNode(processConfigConst.NOTICE_PROCESS_TYPE)}>添加抄送</a>
            <a href="javascript:;" onClick={() => this.addProcessNode(processConfigConst.APPROVE_PROCESS_TYPE)}>添加审批</a>
            <a href="javascript:;" onClick={() => this.addProcessNode(processConfigConst.CONDITION_PROCESS_TYPE)}>添加条件</a>
          </div>
        </div>
        <div className="step-config-wrapper">
          <div className="step-config-content">
            { this.matchRightConfig(type) }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ processConfigEdit, loading }) => ({ ...processConfigEdit, loading }))(ProcessConfig);

