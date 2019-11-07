/*
 * @Description: 周报月报统计
 * @Author: juyang
 * @Date: 2019-05-14 16:57:51
 * @Last Modified by: juyang
 * @Last Modified time: 2019-05-22 12:16:48
 */

import React from 'react';

import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import Separate from 'components/common/Separate';
import SearchBar from 'components/workReport/workReportStatisticQuery/SearchBar';
import Summary from 'components/workReport/workReportStatisticQuery/Summary';
import PushSituation from 'components/workReport/workReportStatisticQuery/PushSituation';

const {  Row, Col } =  window.antd;

class WorkReportStatisticQuery extends React.PureComponent {

  changeNav = (payload) => {
    this.props.dispatch({
      type: 'workReportStatisticQuery/changeNav',
      payload
    });
  }

  handleSubmit = (payload) => {
    // 是否需要查询子部门
    if(payload.needSubDepartment === undefined){
      payload.needSubDepartment = this.props.needSubDepartment;
    }

    this.props.dispatch({
      type: 'workReportStatisticQuery/getInfo',
      payload
    });
  }

  onChildrenDepartChange = (e) => {
    const {
      departmentName,
      departmentId,
      reportTime,
      isSelfDepartment
    } = this.props;

    this.handleSubmit({
      departmentName,
      departmentId,
      reportTime,
      needSubDepartment: e.target.checked,
      isSelfDepartment
    });
  }

  render() {
    const { isGetingInfo, isGetingSelfDepartmentInfo, isGotInfo, selectedNavKey, submitList, unSubmitList, departmentTreeData, departmentName, myUnSbmitReport,reportTime,needSubDepartment } = this.props;

    const isGeting = (isGetingInfo === true)
     || (isGetingSelfDepartmentInfo === true);

    const submitCount = isGeting
      ? -1
      : (submitList ? submitList.length : -1);

    return (
      <BasicLayout>
        <Separate size={1} />
        {/* <StatusNav
          activeNavVal={selectedNavKey}
          activeNav={WORK_REPORT_NAV_CONFIG}
          toggleNav={this.changeNav}
        /> */}
        <div className='content-wrapper'>
          <SearchBar
            isGetingInfo={isGetingInfo}
            isGetingSelfDepartmentInfo={isGetingSelfDepartmentInfo}
            handleSubmit={this.handleSubmit}
            selectedNavKey={selectedNavKey}
            treeData={departmentTreeData}
          />
          {
            isGotInfo
              ? (
                  <div className="statistic-wraper">
                    <Summary
                      departmentName={departmentName}
                      submitCount={submitCount}
                      myUnSbmitReport={myUnSbmitReport}
                    />
                    <Row gutter={16}>
                      <Col span={24}>
                        <PushSituation
                          needSubDepartment={needSubDepartment}
                          reportTime={reportTime}
                          onChildrenDepartChange={this.onChildrenDepartChange}
                          isGotInfo={isGotInfo}
                          submitList={submitList}
                          unSubmitList={unSubmitList}
                        />
                      </Col>
                      {/*<Col span={12}>
                        <Rank />
                        </Col>*/}
                    </Row>
                </div>
              )
              : null
          }
        </div>
      </BasicLayout>
    );
  }
}

export default connect(({ workReportStatisticQuery, loading }) => ({ ...workReportStatisticQuery, loading }))(WorkReportStatisticQuery);


