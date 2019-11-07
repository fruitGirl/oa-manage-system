/*
 * @Description: 流程-发起申请
 * @Author: moran
 * @Date: 2019-09-12 10:48:05
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-14 16:24:51
 */
import { connect } from 'dva';
import React from 'react';
import ApprovalForm from "./ApprovalForm";
import qs from 'qs';
import 'styles/components/process/processCreate/approvalCreate.less';
import Separate from 'components/common/Separate';

const { Button, Icon, Spin } = window.antd;

class ApprovalCreate extends React.PureComponent {
  componentDidMount() {
    // 获取url中processConfigId
    const { processConfigId } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    this.props.dispatch({
      type: 'processCreate/getFormConfig',
      payload: { processConfigId }
    });
  }

  // 返回
  handleBack = () => {
    window.location.href = `${CONFIG.frontPath}/process/processStartInit.htm`;
  }

  render() {
    const { formDataConfigList, loading } = this.props;
    const { name } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const approvalCreateLoading = loading.effects['processCreate/getFormConfig'];
    return(
      <Spin spinning={approvalCreateLoading}>
        <div className="launch-appliaction-box">
          <Separate size={1} />
          <div className="header">
            <Button className="back-btn" onClick={this.handleBack}>
              <Icon type="arrow-left" />
              &nbsp;返回
            </Button>
            {name}
          </div>
          <div className="appliaction-main">
            <div className="left">
              <ApprovalForm configs={formDataConfigList}/>
            </div>
            {/* <div class="right">
              <ApprovalProcess configs={[{}, {}]}/>
            </div> */}
          </div>
        </div>
      </Spin>
    );
  }
}

export default connect(({ processCreate, loading }) => ({ ...processCreate, loading }))(ApprovalCreate);
