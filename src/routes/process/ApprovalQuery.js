/*
 * @Description: 流程-审批查询
 * @Author: moran
 * @Date: 2019-09-24 18:17:10
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-14 16:02:12
 */

import { connect } from 'dva';
import React from 'react';
import BasicLayout from 'layouts/BasicLayout';
import ApprovalDetailDrawer from 'components/businessCommon/ApprovalDetailDrawer';
import { columns } from 'constants/process/approvalQuery';
import SearchBar from 'components/process/approvalQuery/SearchBar';

const { Table } = window.antd;

class ApprovalQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 详情抽屉
      searchObj: {
        currentPage: 1 // 搜索参数
      }
    };
  }

  // 翻页
  handlePageSubmit = ({ current }) => {
    this.setState({
      searchObj: { ...this.state.searchObj, currentPage: current || 1 }
    }, ()=> {
      this.props.dispatch({
        type: 'approvalQuery/getApprovalList',
        payload: this.state.searchObj
      });
    });
  }

  // 搜索
  handleSearch = (values) => {
    this.setState({
      searchObj: { ...this.state.searchObj, ...values }
    });
    this.props.dispatch({
      type: 'approvalQuery/getApprovalList',
      payload: values
    });
  }

  // 详情
  handleDetail = (row) => {
    const { id } = row;
    this.setState({
      visible: true,
    });
    this.props.dispatch({
      type: 'myApprovalQuery/getProcessDetail',
      payload: { processInstanceId: id }
    });
  }

  // 关闭抽屉
  handleClose = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    const {
      paginators,
      approvalLists,
      loading,
      processFormDataList,
      processNodeInstanceInfoList
    } = this.props;
    const { visible } = this.state;
    const {
      itemsPerPage,
      items,
      page
    } = paginators;

    // 分页数据
    const pagination = {
      current: page,
      total: items,
      pageSize: itemsPerPage,
      showQuickJumper: true,
      showTotal: () => `共 ${items} 条`
    };

    // 详情抽屉数据
    const processConfigs = {
      processFormDataList,
      processNodeInstanceInfoList,
    };
    const tableLoading = loading.effects['approvalQuery/getApprovalList'];

    return (
      <BasicLayout>
        <div className="antd_form_horizontal form-inline">
          <SearchBar onSearch={this.handleSearch}/>
        </div>
        <div className="ant-table-wrapper bg-white">
            <Table
              columns={columns({
                detail: this.handleDetail
              })}
              dataSource={approvalLists}
              pagination={pagination}
              loading={tableLoading}
              rowKey={(r) => r.id}
              onChange={this.handlePageSubmit}
            />
        </div>
        {/* 详情抽屉 */}
        <ApprovalDetailDrawer
          processConfigs={processConfigs}
          visible={visible}
          close={this.handleClose}
          isShowBtn={false}/>
      </BasicLayout>
    );
  }
}

export default connect(({ approvalQuery, myApprovalQuery, loading }) => ({ ...approvalQuery, ...myApprovalQuery, loading }))(ApprovalQuery);
