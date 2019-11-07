/*
 * @Description: 周报月报查询
 * @Author: danding
 * @Date: 2019-05-14 16:57:32
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:32:59
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import SearchBar from 'components/workReport/workReportQuery/SearchBar';
import Separate from 'components/common/Separate';
//import WorkReportTable from 'components/workReport/workReportQuery/WorkReportTable';

const {Table} = window.antd;
const columns = [
  {
    title:'日期',
    dataIndex: 'data',
    className: 'table-center'
  },{
    title: '花名',
    dataIndex: 'nickName',
    className: 'table-center'
  },{
    title: '部门',
    dataIndex: 'deptName',
    className: 'table-center'
  },{
    title: '状态',
    dataIndex: 'status',
    className: 'table-center'
  },{
    title: '评论数',
    dataIndex: 'commitCount',
    className: 'table-center',
    render(n) {
      return n || 0;
    }
  },{
    title: '提交时间',
    dataIndex: 'submitTime',
    className: 'table-center'
  },{
    title: '操作',
    dataIndex: 'canView',
    className: 'table-center',
    render: (text, record) => {
      const link = '/workReport/userWorkReportQuery.htm?workReportId='+ record.id;
      return text ? <a href={link} target="_blank" rel="noopener noreferrer">查看</a> : '-';
    }
  }
];

class WorkReportQuery extends React.Component {

  constructor(props){
    super(props);

    this.state = {

    };
  }

  changeNav = (payload) => {
    this.props.dispatch({
      type: 'workReportQuery/changeNav',
      payload
    });
  }

  handleSubmit = (payload) => {

    /** 点击查询后，存储数据 */
    this.setState({
      departmentId: payload.departmentId,
      typeCode: payload.typeCode,
      reportTime: payload.reportTime,
      needSubDepartment: payload.needSubDepartment,
      nickName: payload.nickName,
    });

    this.getList(payload);
  }

  getList = (payload) => {
    this.props.dispatch({
      type: 'workReportQuery/getList',
      payload
    });
  }

  onPageChange = (pagination ) =>{

    this.getList({currentPage:pagination.current, ...this.state });
  }

  render() {
    const { selectedNavKey, workReportData, pagination, isLoadingData, isSearched } = this.props;

    return (
        <BasicLayout>
          <Separate size={1} />
          <div className="content">
            <SearchBar
              selectedNavKey={selectedNavKey}
              handleSubmit={this.handleSubmit}
              isLoading={isLoadingData}
            />
          {
            isSearched
              ? <Table
                  columns={columns}
                  dataSource={workReportData}
                  pagination={pagination}
                  onChange={this.onPageChange}
                />
              : null
          }
          </div>
        </BasicLayout>
    );
  }
}

export default connect(({ workReportQuery, loading }) => ({ ...workReportQuery, loading }))(WorkReportQuery);


