import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import CustomBreadcrumb from 'components/common/CustomBreadcrumb';
import { WEEK_REPORT_BREADCRUMB } from 'constants/workReport/detailBreadcrumb';
import WorkReportCommit from 'components/businessCommon/WorkReportCommit';
import Separate from 'components/common/Separate';

const { Table, Spin, Icon, Tooltip } = window.antd;

const nowColumns = [
  {
    title: '工作内容',
    dataIndex: 'content',
    key: 'content',
    width: '40%',
    render: (r) => {
      return <div dangerouslySetInnerHTML={{ __html: r }}></div>;
    }
  },
  {
    title: (<div>
      预期
      <Separate size={3} isVertical={false} />
      <Tooltip title="此任务预估在本周可实现的进度">
        <Icon type="question-circle" />
      </Tooltip>
    </div>),
    dataIndex: 'expectRate',
    key: 'expectRate',
    width: 100,
    render: (rate) => {
      return rate > -1 ? `${rate}%` : '-';
    }
  },
  {
    title: (<div>
      实际
      <Separate size={3} isVertical={false} />
      <Tooltip title="此任务在本周实际实现的进度">
        <Icon type="question-circle" />
      </Tooltip>
    </div>),
    dataIndex: 'actualRate',
    key: 'actualRate',
    width: 100,
    render: (rate) => {
      return rate > -1 ? `${rate}%` : '-';
    }
  },
  {
    title: '备注说明',
    dataIndex: 'memo',
    key: 'memo',
    render: (r) => {
      return <div dangerouslySetInnerHTML={{ __html: r }}></div>;
    }
  }
];

const nextColumns = [
  {
    title: '工作内容',
    dataIndex: 'content',
    key: 'content',
    width: '40%',
    render: (r) => {
      return <div dangerouslySetInnerHTML={{ __html: r }}></div>;
    }
  },
  {
    title: (<div>
      预期
      <Separate size={3} isVertical={false} />
      <Tooltip title="此任务预估在下周可实现的进度">
        <Icon type="question-circle" />
      </Tooltip>
    </div>),
    dataIndex: 'expectRate',
    key: 'expectRate',
    width: 200,
    render: (rate) => {
      return rate > -1 ? `${rate}%` : '-';
    }
  },
  {
    title: '备注说明',
    dataIndex: 'memo',
    key: 'memo',
    render: (r) => {
      return <div dangerouslySetInnerHTML={{ __html: r }}></div>;
    }
  }
];

class UserWeekReportForCommonQuery extends React.PureComponent {
  componentDidMount(){
    this.getInfo();
    this.initConfig();
    this.getInitCommitList();
  }

  getInfo() {
    this.props.dispatch({
      type: 'userWeekReportForCommonQuery/getInfo',
      payload: {
         workReportId: window.CONFIG.pageData && window.CONFIG.pageData.workReportId
      }
    });
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

  // 配置面包屑标题
  renderTitle() {
    const { workReport, userInfo } = this.props;
    const { userId, nickName } = userInfo;
    const workNo = workReport.reportTime
      ? workReport.reportTime.split('-')[1]
      : '';
    const startTime = workReport.startTime
      ? workReport.startTime.substr(0, 10)
      : '';
    const endTime = workReport.endTime
      ? workReport.endTime.substr(0, 10)
      : '';
    const isSelf = userId === CONFIG.userId; // 是否是自己的周报

    return (
      <div>
        {
          isSelf
            ? null
            : (
                <span>
                  {`${nickName || ''}的周报`}
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

  changePage =(payload) => {
    this.getCommitList(payload);
  }

  getInitCommitList() {
    this.getCommitList({ currentPage: 1 });
  }

  getCommitList = (payload) => {
    this.props.dispatch({
      type: 'userWeekReportForCommonQuery/getCommitList',
      payload
    });
  }

  handleSubmitCommit = (payload) => {
    this.props.dispatch({
      type: 'userWeekReportForCommonQuery/submitCommit',
      payload
    });
  }

  render() {
    const {
      isLoading,
      nowList,
      nextList,
      userInfo,
      commitList,
      paginator,
      loading,
    } = this.props;
    const title = this.renderTitle();
    const config = userInfo.userId === CONFIG.userId
      ? []
      : this.config;
    const isSubmitingCommit = loading.effects['userWeekReportForCommonQuery/submitCommit'];

    return (
        <BasicLayout>
          <Spin spinning={isLoading}>
            {
              isLoading
                ? null
                : <CustomBreadcrumb config={config} title={title} />
            }
            <div className="content">
              <div>
                <h3 className="week-title">本周工作内容</h3>
                <Table
                  rowKey={r => r.id}
                  columns={nowColumns}
                  dataSource={nowList}
                  pagination={false}
                />
              </div>
              <div>
                <h3 className="week-title">下周工作计划</h3>
                <Table
                  rowKey={r => r.id}
                  columns={nextColumns}
                  dataSource={nextList}
                  pagination={false}
                />
              </div>
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

export default connect(({ userWeekReportForCommonQuery, loading }) => ({ ...userWeekReportForCommonQuery, loading }))(UserWeekReportForCommonQuery);
