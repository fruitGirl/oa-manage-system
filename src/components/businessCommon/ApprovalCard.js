/*
 * @Description: 流程-我的审批-审批card
 * @Author: moran 
 * @Date: 2019-09-10 17:22:21 
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-19 14:39:00
 */
import React from 'react';
import { connect } from 'dva';
import MyExinameDrawer from 'components/process/myApprovalQuery/MyExinameDrawer';
import ApprovalDetailDrawer from 'components/businessCommon/ApprovalDetailDrawer';
import 'styles/components/process/approvalCard.less';
import { APPROVE, APPROVED, VETOED, REJECT, RECALLED } from 'constants/process/index';
const { Row, Col } = window.antd;

class MyApprovalCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 是否选中当前审批卡片
    };
  }
  handleApprovalClick = () => {
    const { id } = this.props.cardConfig;
    this.setState({
      visible: true,
    });
    this.props.dispatch({
      type: 'myApprovalQuery/getProcessDetail',
      payload: { processInstanceId: id }
    });
  }

  handleClose = () => {
    this.setState({
      visible: false,
    });
  }

  getColor = (name, ft) => {
    // 待审核
    if (name === APPROVE) {
      return `${ft || ''}orange`;
    }
    // 已审核
    if (name === APPROVED) {
      return `${ft || ''}gray`;
    }
    // 撤回 驳回 已否决
    if (name === VETOED || name === REJECT || name === RECALLED) {
      return `${ft || ''}red`;
    }
    return `${ft || ''}orange`;
  }

  render() {
    const { visible } = this.state;
    const {
      type,
      isShowBtn,
      cardConfig,
      processFormDataList,
      processNodeInstanceInfoList
    } = this.props;
    const { 
      status,
      gmtCreate,
      name,
      approveDetailId,
      nickName,
      realName,
      id,
      statusEnum
    } = cardConfig;

    const processConfigs = {
      name,
      approveDetailId,
      processFormDataList,
      processNodeInstanceInfoList,
      id,
      statusEnum,
      status
    };

    // 审批状态背景色
    const bacColor = this.getColor(status.name);

    // 最终审批字体颜色
    const resultColor = this.getColor(status.name, 'ft-');
    
    return (
      <div>
          <div className={`my-approval-card-box ${visible ? 'border-active' : ''}`} onClick={this.handleApprovalClick}>
          <Row>
            <Col span={10}>
              <div className={`status-box ${bacColor}`}>{status.message || ''}</div>
              <div className="info-box">
                <p>{name}</p>
                <p>申请时间：{gmtCreate}</p>
              </div>
            </Col>
            <Col span={8} className="apply-info">
              申请人：{nickName}（{realName}）
            </Col>
            <Col span={6} className="apply-info">
              最终审批结果：
              <span className={resultColor}>{status.message || ''}</span>
            </Col>
          </Row>
        </div>
        { type === 1 ?
          <MyExinameDrawer
            processConfigs={processConfigs}
            visible={visible}
            close={this.handleClose}/>
            : null
        }
        {
          type === 2 ?
          <ApprovalDetailDrawer
            processConfigs={processConfigs}
            visible={visible}
            close={this.handleClose}
            isShowBtn={isShowBtn}/>
          : null
        }
      </div>
      
    );
  }
}

MyApprovalCard.propTypes = {
  cardConfig: PropTypes.object, // 数据源
  type: PropTypes.number, // type: 1-》我的审批 2-》我的发起或者抄送
  isShowBtn: PropTypes.bool // type为2时，是否显示撤回按钮
};

MyApprovalCard.defaultProps = {
  cardConfig: {},
  type: 1,
  isShowBtn: true
};

export default connect (({ myApprovalQuery, }) => ({ ...myApprovalQuery }))(MyApprovalCard);
