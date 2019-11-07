/*
 * @Description: 主管周报详情
 * @Author: danding
 * @Date: 2019-05-21 09:45:44
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:01:04
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import CurrentWeek from 'components/workReport/weekReportForManageQuery/CurrentWeek';
import NextWeek from 'components/workReport/weekReportForManageQuery/NextWeek';
import CustomBreadcrumb from 'components/common/CustomBreadcrumb';
import { WEEK_REPORT_BREADCRUMB } from 'constants/workReport/detailBreadcrumb';
import WorkReportCommit from 'components/businessCommon/WorkReportCommit';

const { Spin } = window.antd;

class WeekReportForManageQuery extends React.PureComponent {
  componentDidMount() {
    this.initConfig();
    this.getInfo();
    this.getInitCommitList();
  }

  // 配置面包屑配置
  initConfig() {
    const fromUrl = document.referrer;
    const matchItem = WEEK_REPORT_BREADCRUMB.find(i => {
      const reg = new RegExp(i.link);
      return (reg).test(fromUrl);
    });
    const unknowOrigin = { label: '未知来源' };
    const origin = matchItem ? matchItem : unknowOrigin;
    this.config = [origin, { label: '周报' }];
  }

  // 获取详情
  getInfo() {
    const { workReportId } = CONFIG.pageData;
    this.props.dispatch({
      type: 'weekReportForManageQuery/getInfo',
      payload: {
        workReportId
      }
    });
  }

  // 配置面包屑标题
  renderTitle() {
    const { workReport, user } = this.props;
    const { userId } = user;
    const workNo = workReport.reportTime
      ? workReport.reportTime.split('-')[1]
      : '';
    const startTime = workReport.gmtStart
      ? workReport.gmtStart.substr(0, 10)
      : '';
    const endTime = workReport.gmtEnd
      ? workReport.gmtEnd.substr(0, 10)
      : '';
    const isSelf = userId === CONFIG.userId; // 是否是自己的周报

    return (
      <div>
        {
          isSelf
            ? null
            : (
                <span>
                  {`${user.nickName || ''}的周报`}
                  &nbsp;&nbsp;&nbsp;
                </span>
            )
        }
        <span className="time">
          {`第${workNo}周 ${startTime}/${endTime}`}
        </span>
      </div>
    );
  }

  changePage = (payload) => {
    this.getCommitList(payload);
  }

  getInitCommitList() {
    this.getCommitList({ currentPage: 1 });
  }

  getCommitList = (payload) => {
    this.props.dispatch({
      type: 'weekReportForManageQuery/getCommitList',
      payload
    });
  }

  handleSubmitCommit = (payload) => {
    this.props.dispatch({
      type: 'weekReportForManageQuery/submitCommit',
      payload
    });
  }

  render() {
    const { loading, user, commitList, paginator,   } = this.props;
    const title = this.renderTitle();
    const pageLoading = loading.effects['weekReportForManageQuery/getInfo'];
    const config = user.userId === CONFIG.userId
      ? []
      : this.config;
    const isSubmitingCommit = loading.effects['weekReportForManageQuery/submitCommit'];

    return (
      <BasicLayout>
        <Spin spinning={pageLoading}>
          {
            pageLoading
              ? null
              : <CustomBreadcrumb config={config} title={title} />
          }
          <div className="content">
            <CurrentWeek />
            <NextWeek />
          </div>
          <div className="content">
              <WorkReportCommit
                isSubmiting={isSubmitingCommit}
                submitCommit={this.handleSubmitCommit}
                changePage={this.changePage}
                list={commitList}
                paginator={paginator}
              />
            </div>
        </Spin>
      </BasicLayout>
    );
  }
}

export default connect(({ weekReportForManageQuery, loading }) => ({ ...weekReportForManageQuery, loading }))(WeekReportForManageQuery);


