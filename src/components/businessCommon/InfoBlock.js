/*
 * @Description: 审批流程块
 * @Author: moran 
 * @Date: 2019-09-11 11:53:54 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-15 16:08:36
 */

 import React from 'react';
 import 'styles/components/process/infoBlock.less';
 import { INIT, APPROVE, APPROVED, NOTICED, FINISH } from 'constants/process/index';
 const { Row, Col, Tooltip } = window.antd;


 class InfoBlock extends React.PureComponent {
  //  备注hover显示的内容
  popverContent = (list) => {
    const isNeedShowNote = list && list.length; // 备注是否显示悬浮框
    if (!isNeedShowNote) return;
    const content = list.map((i, index) => {
      const { approverNickName, approveMemo, approveResult } = i;
      return <li key={index}>{approverNickName} {approveResult ? `(${approveResult.message})` : ''}: {approveMemo}</li>;
    });
    return (<ul>{content}</ul>);
  }

  // 获取审批状态颜色或者图标
  getColorOrIcon = (status) => {
    let statusType;
    let iconType;
    // 已审批、已完成、已抄送
    if (status === APPROVED || status === NOTICED || status === FINISH) {
      statusType = 'ft-gray';
      iconType = 'agree_icon';
    } else if (status === INIT || status === APPROVE) { // 初始化，未审批
      statusType = 'ft-orange';
      iconType = 'waitting_icon ';
    } else { // 已撤回，已否决
      statusType = 'ft-red';
      iconType = 'disagree_icon';
    }
    return { statusType, iconType };
  }

   render() {
     const { configs } = this.props;
     
     return (
       <div className="info-block-box">
         <p className="ft-gray">审批流程</p>
         {
           configs.map((i, index) => {
             const {
                operators=[], // 审批人
                name,
                status = { message: '', name: '' },
                approveMemo, // 备注
                approvedNodeInstanceDetailList, // 备注需要悬浮的信息
                type = { message: '', name: '' }
             } = i;
             const statusType = this.getColorOrIcon(status.name).statusType; // 审批状态色值
             const iconType = this.getColorOrIcon(status.name).iconType; // 图标类型
             const isAutoPass = (!operators.length) && (status.name === APPROVED); // 没有审批人，并且状态为已审批设置自动通过
             const isAutoNoticedPass = (!operators.length) && (status.name === NOTICED); // 没有抄送人，并且状态为已抄送设置自动通过

             return (
              <Row className="row-box" key={index}>
                <Col span={1}>
                  <i className={`i-block icon-size ${iconType}`} />
                </Col>
                <Col span={23} className="info-main">
                  <Row>
                    {/* 左边一栏信息展示 */}
                    <Tooltip
                      placement="topLeft" 
                      title={operators.join('、')}>
                      {/* 审批节点显示 */}
                      <Col span={13} className="divide left-box">
                        {type.message} &nbsp; | &nbsp;
                        {isAutoPass ? <span className="ft-gray">未找到审批人，自动通过</span> : null}
                        {isAutoNoticedPass ? <span className="ft-gray">未找到抄送人，自动通过</span> : null}
                        {(!isAutoPass && !isAutoNoticedPass) ? <span className="name-block">{operators.join('、')}</span> : null}
                        <span className="ft-gray name-title">
                          (<div className="content-show">{name}</div>)
                        </span>
                      </Col>
                    </Tooltip>
                    {/*  备注显示*/}
                    <Tooltip
                      placement="topLeft"
                      overlayClassName="tooltip-box"
                      title={this.popverContent(approvedNodeInstanceDetailList)}>
                      <Col
                        span={9}
                        className="divide show-ellipsis note-box">
                        {approveMemo}
                      </Col>
                    </Tooltip>
                    <Col
                      span={2}
                      className={statusType}>
                        { (status.name !== INIT) ? status.message : '' }
                    </Col>
                  </Row>
                </Col>
              </Row>
             );
           })
         }
         
       </div>
     );
   }
 }

 InfoBlock.propTypes = {
  configs: PropTypes.array.isRequired, // 审批流程块配置
};

InfoBlock.defaultProps = {
  configs: [],
};

export default InfoBlock;
