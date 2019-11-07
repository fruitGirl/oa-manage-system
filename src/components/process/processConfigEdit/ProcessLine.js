/*
 * @Description: 流程配置-流程卡片线
 * @Author: danding
 * @Date: 2019-09-05 16:03:57
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-19 18:07:22
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import 'styles/components/process/processConfigEdit/processConfig.less';
import ProcessCard from 'components/process/processConfigEdit/ProcessCard';
import * as ProcessConfigConst from 'constants/components/process/processConfigEdit';

class ProcessLine extends React.PureComponent {
  // 匹配流程卡片
  matchCard = (type) => {
    switch (type) {
      case ProcessConfigConst.LAUNCH_PROCESS_TYPE: // 发起
        return ProcessCard.LaunchProcessCard;
      case ProcessConfigConst.APPROVE_PROCESS_TYPE: // 审批
        return ProcessCard.ApprovalProcessCard;
      case ProcessConfigConst.NOTICE_PROCESS_TYPE: // 抄送
        return ProcessCard.NoticeProcessCard;
      case ProcessConfigConst.CONDITION_PROCESS_TYPE: // 条件
          return ProcessCard.ConditionCard;
      default: return null;
    }
  }

  // 删除流程
  onRemove = (info) => {
    this.props.onRemove(info);
  }

  // 渲染流程结构图
  renderProcessCards = (config) => {
    const { allUsers, allDepts, allGroups, selectedProcessCard } = this.props;
    return config.map((i, idx) => {
      const { childNodes, ...rest } = i;
      const { type } = rest;
      let child = null;
      let hasLastProcess = true;

      // 子节点存在，且节点不为条件节点
      if (childNodes
        && (type !== ProcessConfigConst.CONDITION_PROCESS_TYPE)
        && childNodes.length
      ) {
        child = this.renderProcessCards(childNodes);
        hasLastProcess = false;
      }

      if (type === ProcessConfigConst.CONDITION_PROCESS_TYPE) {
        const hasNormalProcess = config.some(j => j.type !== ProcessConfigConst.CONDITION_PROCESS_TYPE);
        hasLastProcess = !hasNormalProcess && (idx === (config.length - 1));
      }

      const ParentNode = this.matchCard(type);

      // 是否选中
      const isSelected = selectedProcessCard.key === rest.key;

      // 是否可以删除，发起流程，不可删除
      const enableRemove = isSelected
        && (type !== ProcessConfigConst.LAUNCH_PROCESS_TYPE);

      return (
        <Fragment>
          <div
            className={
              `
                process-line-card
                pull-right
                clearfix
                ${isSelected ? 'selected-process-card' : ''}
                ${hasLastProcess ? 'last-process-card' : ''}
              `
            }
          >
            <ParentNode
              onSelect={this.props.onSelect}
              data={i}
              allUsers={allUsers}
              allDepts={allDepts}
              allGroups={allGroups}
              isSelected={isSelected}
            />
            { enableRemove && <i className="remove-icon" onClick={() => this.onRemove(rest)} /> }
          </div>
          {child}
        </Fragment>
      );
    });
  }

  render() {
    const { config } = this.props;
    return this.renderProcessCards(config);
  }
}

ProcessLine.porpTypes = {
  allUsers: PropTypes.array,
  allDepts: PropTypes.array,
  allGroups: PropTypes.array,
  config: PropTypes.array
};

ProcessLine.defaultProps = {
  allUsers: [],
  allDepts: [],
  allGroups: [],
  config: []
};

export default ProcessLine;

