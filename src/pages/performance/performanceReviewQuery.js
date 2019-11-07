/*
 * @Description: 绩效点评
 * @Author: lanlan
 * @Date: 2019-02-19 15:59:45
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-16 11:16:11
 */

import { Component } from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';

const { Radio, Table, LocaleProvider, zh_CN, message } = window.antd;

const columns = [
  {
    title: '考核名称',
    dataIndex: 'name'
  },
  {
    title: '部门',
    dataIndex: 'departmentName'
  },
  {
    title: '考核对象',
    dataIndex: 'nickName'
  },
  {
    title: '更新时间',
    dataIndex: 'gmtModified'
  },
  {
    title: '版本',
    dataIndex: 'objectTypeMsg'
  },
  {
    title: '当前阶段',
    dataIndex: 'statusMsg'
  },
  {
    title: '上级评分',
    dataIndex: 'superiorScore',
    className: 'text-center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    render: (text, record) => {
      return <a href="javascript:;" onClick={() => {
        if (record.hasReadRole) { // 访问权限
          window.open(record.href);
        } else {
          message.warning('权限不足');
        }
      }}>查看</a>;
    }
  }
];

const statusList = [
  {
    value: 'ALL',
    content: '全部'
  },
  {
    value: 'CONFIRM_GOALS',
    content: '确认目标'
  },
  {
    value: 'SUPERIOR_ASSESSMENT',
    content: '上级点评'
  },
  {
    value: 'MANAGER_CONFIRM',
    content: '团队负责人确认'
  },
  {
    value: 'HR_CONFIRM',
    content: '人事确认'
  },
  {
    value: 'FINISH',
    content: '结束'
  }
];

class PerformanceReview extends Component {
  state = {
    status: 'ALL',
    loading: true,
    tableDataLists: [],
    paginator: {}
  };

  componentDidMount() {
    this.handleQuery();
  }

  handleQuery = (currentPage = 1, pageSize = 10) => {
    const url = T.getFrontPath('/performance/performanceReviewQuery.json');
    let status = this.state.status;
    status = status === 'ALL' ? '' : status;
    this.setLoadingState(true);

    T.get(url, {
      currentPage,
      pageSize,
      status
    })
      .then((data) => {
        const {
          userIdAndDeptNameMap = {},
          userIdAndLoginNameMap = {},
          authorityResult = {},
          pageQueryResult: { list = [], paginator = {} }
        } = data;

        const tableDataLists = list.map((item) => {
          const {
            assessObjectId,
            id,
            name,
            gmtModified,
            // objectType: { message: objectTypeMsg },
            status: { name: statusName, message: statusMsg },
            superiorTotalScore
          } = item;
          const departmentName = userIdAndDeptNameMap[assessObjectId];
          const nickName = userIdAndLoginNameMap[assessObjectId];
          const superiorScore = superiorTotalScore ? superiorTotalScore['value'] : '--';
          const href = `${CONFIG.frontPath}/performance/performanceReviewEdit.htm?id=${id}&status=${statusName}`;
          return {
            id,
            departmentName,
            nickName,
            name,
            gmtModified,
            statusMsg,
            superiorScore,
            objectTypeMsg: '正式版',
            href,
            hasReadRole: authorityResult[assessObjectId],
            operation: (statusName === 'CONFIRM_GOALS') || (statusName === 'SUPERIOR_ASSESSMENT')
                ? '点评'
                : '查看'
          };
        });

        this.setState(
          {
            tableDataLists,
            paginator
          },
          () => {
            this.setLoadingState(false);
          }
        );
      })
      .catch((data) => {
        T.showErrorMessage(data);
        this.setState(
          {
            tableDataLists: [],
            paginator: {}
          },
          () => {
            this.setLoadingState(false);
          }
        );
      });
  };

  handlePageSubmit = (current) => {
    this.handleQuery(current);
  };

  setLoadingState = (isLoading) => {
    this.setState({
      loading: isLoading
    });
  };

  handleStatusChange = (e) => {
    const status = e.target.value;
    if (this.state.loading) {
      return;
    }

    this.setState(
      {
        status
      },
      () => {
        this.handleQuery(1);
      }
    );
  };

  renderStatusButton = () => {
    return statusList.map(({ value, content }) => {
      return (
        <Radio.Button key={value} value={value} onClick={this.handleStatusChange}>
          {content}
        </Radio.Button>
      );
    });
  };

  render() {
    const { status, loading, tableDataLists, paginator } = this.state;

    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <div className="text-center">
            当前阶段：
            <Radio.Group value={status}>{this.renderStatusButton()}</Radio.Group>
          </div>

          <Table
            rowKey="id"
            className="table-wrapper"
            columns={columns}
            dataSource={tableDataLists}
            loading={loading}
            pagination={{
              showQuickJumper: true,
              total: paginator.items,
              current: paginator.page,
              onChange: this.handlePageSubmit,
              showTotal: (total) => {
                return `共${total}条`;
              }
            }}
          />
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

ReactDOM.render(<PerformanceReview />, document.getElementById('root'));
