/*
 * @Description: 流程卡片
 * @Author: danding
 * @Date: 2019-09-27 16:29:43
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-14 11:11:32
 */

import React from 'react';
import 'styles/components/process/processConfigQuery/approvalItem.less';
import { ENABLE_STATUS, STOP_STATUS } from 'constants/process/processConfigQuery';

const { Popconfirm, Tooltip } = window.antd;

const ApprovalItem = (props) => {
  const { dragClass, handleUseStatus, handleMove, data, ableDrag } = props;
  const { name, status, description, id, processVisibleDesc, logo } = data;
  const enableStatus = status === ENABLE_STATUS; // 启用
  const disabledStatus = status === STOP_STATUS; // 停用

  return (
    <div className="approval-item-wrapper clearfix">
      <div className="pull-left drag-wrapper">
        { ableDrag && <img
          className={`drag-icon ${dragClass}`}
          src={T.getImg('common/drag.png')}
          alt="拖拽"
        /> }
      </div>
      <img
        className="logo pull-left handle"
        src={window.T.getImg(`process/approval-logo/${logo}`)}
        alt="审批logo"
      />
      <div className="content pull-left">
        <div className="process-info">
          <span className="process-name ellipsis">{name}</span>
          <span>{processVisibleDesc}</span>
        </div>
        { description && <div >
          <Tooltip title={description}>
            <span className="process-desc ellipsis">
              {description || ''}
            </span>
          </Tooltip>
        </div> }
      </div>
      <div className="pull-right operate">
        { enableStatus && (
            <Popconfirm
              title="确认停用?"
              onConfirm={() => handleUseStatus({
                id,
                status: STOP_STATUS
              })}
            >
              <a href="javascript:;" >停用</a>
            </Popconfirm>
          )
        }
        { disabledStatus && (
            <Popconfirm
              title="确认启用?"
              onConfirm={() => handleUseStatus({
                id,
                status: ENABLE_STATUS
              })}
            >
              <a href="javascript:;" class="disabled-status">启用</a>
            </Popconfirm>
          )
        }
        <a href={`/process/processConfigDetailQuery.htm?id=${id}`}>编辑</a>
        <a href="javascript:;" onClick={() => handleMove(data)}>移动到</a>
      </div>
    </div>
  );
};

export default ApprovalItem;
