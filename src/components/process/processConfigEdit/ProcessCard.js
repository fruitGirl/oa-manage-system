/*
 * @Description: 流程配置-流程卡片
 * @Author: danding
 * @Date: 2019-09-05 16:04:54
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 14:31:52
 */

import React, { Fragment } from 'react';
import { getSelectedUserEnum, getSelectedGroupOrDeptEnum } from 'constants/components/process/processConfigEdit';
import * as pageConst from 'constants/process/processConfigEdit';

const { Tooltip } = window.antd;

// 发起审批卡片
const LaunchProcessCard = (props) => {
  const { onSelect, data, allUsers, allDepts, allGroups } = props;
  const { name, processVisibleConfig = {} } = data;
  const { visibleObjectType, visibleObjectIds } = processVisibleConfig;

  // 显示发起人
  let launchers = [];
  switch (visibleObjectType) {
    case pageConst.VISIBLE_RANGE_ALL_USER: { // 全部人员
      launchers = [{ label: '全部人员' }];
      break;
    }
    case pageConst.VISIBLE_RANGE_CUSTOM_USER: { // 指定人员
      launchers = getSelectedUserEnum(visibleObjectIds, allUsers);
      break;
    }
    case pageConst.VISIBLE_RANGE_CUSTOM_GROUP: { // 指定分类
      launchers = getSelectedGroupOrDeptEnum(visibleObjectIds, allGroups);
      break;
    }
    case pageConst.VISIBLE_RANGE_CUSTOM_DEPART: { // 指定部门
      launchers = getSelectedGroupOrDeptEnum(visibleObjectIds, allDepts);
      break;
    }
    default: break;
  }

  launchers = launchers.map(i => (i ? i.label : '')).join('，');

  return (
    <div
      className="process-card-wrapper"
      onClick={() => { onSelect(data); }}
    >
      <div className="normal-process-line"></div>
      <div className="process-card-belong launch-belong">
        发<br/>起
      </div>
      <div className="process-card-content">
        <div className="process-card-tit">{name}</div>
          <div className="process-card-message ellipsis">
            <Tooltip placement="topLeft" title={launchers}>
              发起人：{launchers}
            </Tooltip>
          </div>
      </div>
    </div>
  );
};

// 审批流程卡片
const ApprovalProcessCard = (props) => {
  const { onSelect, data, allUsers, allGroups } = props;
  const {
    name,
    processApproveNodePropertiesConfig: {
      approverObjectIds = [],
      approverObjectType,
      approveWay
    }
  } = data;

  let launchers = [];
  switch (approverObjectType) {
    case pageConst.APPROVE_USER_USER: { // 指定人员
      launchers = getSelectedUserEnum(approverObjectIds, allUsers);
      break;
    }
    case pageConst.APPROVE_USER_GROUP: { // 指定分类
      launchers = getSelectedGroupOrDeptEnum(approverObjectIds, allGroups);
      break;
    }
    case pageConst.APPROVE_USER_SELF_SELECT: { // 发起人自选
      launchers = [{ label: '发起人自选' }];
      break;
    }
    case pageConst.APPROVE_USER_MANAGEER: { // 部门负责人
      launchers = [{ label: '部门负责人' }];
      break;
    }
    default: break;
  }
  launchers = launchers.map(i => (i ? i.label : '')).join('，');
  const approvalType = approveWay === pageConst.ALL_APPROVE_PASS_WAY
    ? '会签'
    : '或签';

  return (
    <div
      className="process-card-wrapper"
      onClick={() => { onSelect(data); }}
    >
      <div className="normal-process-line"></div>
      <div className="process-card-belong approval-belong">
        审<br/>批
      </div>
      <div className="process-card-content">
        <div className="process-card-tit">{approvalType} | {name}</div>
          <div className="process-card-message ellipsis">
            <Tooltip placement="topLeft" title={launchers}>
              审批人：{launchers}
            </Tooltip>
          </div>
      </div>
    </div>
  );
};

// 抄送流程卡片
const NoticeProcessCard = (props) => {
  const { onSelect, data, allUsers, allGroups } = props;
  const {
    name,
    processNoticeNodePropertiesConfig: {
      noticeObjectIds = [],
      noticeObjectType
    }
  } = data;

  let launchers = [];
  switch (noticeObjectType) {
    case pageConst.NOTICE_TO_USER: { // 指定人员
      launchers = getSelectedUserEnum(noticeObjectIds, allUsers);
      break;
    }
    case pageConst.NOTICE_TO_GROUP: { // 指定分类
      launchers = getSelectedGroupOrDeptEnum(noticeObjectIds, allGroups);
      break;
    }
    default: break;
  }
  launchers = launchers.map(i => (i ? i.label : '')).join('，');

  return (
    <div
      className="process-card-wrapper"
      onClick={() => { onSelect(data); }}
    >
      <div className="normal-process-line"></div>
      <div className="process-card-belong send-copy-belong">
        抄<br/>送
      </div>
      <div className="process-card-content">
        <div className="process-card-tit">{ name }</div>
          <div className="process-card-message ellipsis">
            <Tooltip placement="topLeft" title={launchers}>
                抄送人：{launchers}
            </Tooltip>
          </div>
      </div>
    </div>
  );
};

const combineProcessNames = (container = [], config = []) => {
  if (config && config[0]) {
    container.push(config[0].name);
  }
  if (config && config[0] && config[0].childNodes) {
    combineProcessNames(container, config[0].childNodes);
  }
};

// 条件流程卡片
const ConditionCard = (props) => {
  const { onSelect, data } = props;
  const {
    name,
    priority,
    childNodes = []
  } = data;
  let processNames = [];
  combineProcessNames(processNames, childNodes);

  return (
    <div
      className="process-card-wrapper condition-card-wrapper"
      onClick={() => { onSelect(data); }}
    >
      <div className="condition-process-top-line"></div>
      <div className="condition-process-bottom-line"></div>
      <div className="process-card-belong condition-belong">
        条<br/>件
      </div>
      <div className="process-card-content">
        <div className="process-card-tit">
          <span className="condition-title ellipsis">{name}</span>
          <span className="process-card-priority">优先级{priority}</span>
        </div>
        <div className="process-card-message">
          {
            processNames.map((i, idx) => {
              const hasSplit = idx < (processNames.length - 1);
              return (
                <Fragment>
                  <div className="condition-process">{i}</div>
                  {hasSplit ? '->' : ''}
                  &nbsp;
                </Fragment>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

export default {
  LaunchProcessCard,
  ApprovalProcessCard,
  NoticeProcessCard,
  ConditionCard
};
