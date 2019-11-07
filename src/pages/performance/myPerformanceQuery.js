/*
 * @Description: 我的绩效
 * @Author: lanlan
 * @Date: 2019-02-19 14:53:36
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-26 11:46:23
 */

import { Component } from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/performance/myPerformanceQuery.less';
import { createColumns } from 'constants/performance/myPerformanceQuery';

const { Table } = window.antd;

class MyPerformance extends Component {
  state = {
    loading: false,
    tableDataLists: [],
    paginator: {}
  };

  componentDidMount() {
    this.handleQuery();
  }

  handleQuery = (currentPage = 1, pageSize = 10) => {
    const url = T.getFrontPath('/performance/myPerformanceQuery.json');

    this.setLoadingState(true);

    T.get(url, {
      currentPage,
      pageSize
    })
      .then((data) => {
        const {
          departmentName,
          nickName,
          result: { list = [], paginator = {} }
        } = data;

        const tableDataLists = list.map((item) => {
          const {
            id,
            name,
            gmtModified,
            objectType: { name: objectTypeName, message: objectTypeMsg },
            status: { name: statusName, message: statusMsg },
            superiorTotalScore,
            year,
            performanceTypeCode,
            timeRange
          } = item;

          const href = `${
            CONFIG.frontPath
          }/performance/myPerformanceEdit.htm?id=${id}&objectType=${objectTypeName}&status=${statusName}`;
          const operation = statusName === 'SET_GOALS' || statusName === 'SELF_ASSESSMENT' ? '编辑' : '查看';
          const superiorScore = superiorTotalScore ? superiorTotalScore['value'] : '--';
          return {
            id,
            departmentName,
            nickName,
            name,
            gmtModified,
            objectTypeMsg:
              objectTypeName === 'PERFORMANCE_ASSESSMENT'
                ? '正式版'
                : objectTypeName === 'PERFORMANCE_DRAFT'
                ? <span style={{color: '#faad14'}}>草稿</span>
                : objectTypeMsg, // 版本
            statusMsg, // 当前阶段
            superiorScore, // 上级评分
            href,
            operation,
            year: year,
            timeRange: performanceTypeCode === 'ANNUAL_PERFORMANCE'
              ? '-'
              : timeRange,
            performanceTypeCode: performanceTypeCode === 'ANNUAL_PERFORMANCE'
              ? '年度考核'
              : '季度考核'
          };
        });
        this.setState(
          {
            tableDataLists,
            paginator: paginator
          },
          () => {
            this.setLoadingState(false);
          }
        );
      })
      .catch((err) => {
        T.showErrorMessage(err);
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

  render() {
    const { loading, tableDataLists, paginator } = this.state;

    return (
      <BasicLayout>
        <Table
          className="table-wrapper"
          rowKey="id"
          columns={createColumns()}
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
    );
  }
}

ReactDOM.render(<MyPerformance />, document.getElementById('root'));
