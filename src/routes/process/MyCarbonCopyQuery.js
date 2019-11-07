/*
 * @Description: 流程-抄送
 * @Author: moran
 * @Date: 2019-09-11 18:13:35
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-14 16:10:00
 */
import { connect } from 'dva';
import React from 'react';
import BasicLayout from 'layouts/BasicLayout';
import ApprovalCard from 'components/businessCommon/ApprovalCard';
const { Pagination, Spin } = window.antd;

class CarbonCopy extends React.Component {

  componentDidMount() {
    this.getLists({ currentPage: 1 });
  }

  // 分页跳转
  handlePageChange = (current) => {
    this.getLists({ currentPage: current || 1 });
  }

  // 抄送列表获取
  getLists = (payload) => {
    this.props.dispatch({
      type: 'myCarbonCopyQuery/getMyCarbonCopy',
      payload
    });
  }

  render() {
    const { myCarbonCopyLists, paginator, loading } = this.props;
    const { items, itemsPerPage, page } = paginator;
    const carbonCopyListsLen = myCarbonCopyLists.length;
    const myCarbonCopyLoading = loading.effects['myCarbonCopyQuery/getMyCarbonCopy'];
    return (
      <BasicLayout>
        <Spin spinning={myCarbonCopyLoading}>
          {
            myCarbonCopyLists.map((i, index) => {
              return (
                <div className="carbon-copy-box" key={index}>
                  <ApprovalCard
                    cardConfig={i}
                    type={2}
                    isShowBtn={false}/>
                </div>
              );
            })
          }
          {
            carbonCopyListsLen ?
            <Pagination
              className="pagination-right"
              onChange={this.handlePageChange}
              current={page}
              pageSize={itemsPerPage}
              total={items}
              showTotal={(total) => `总共${total}条`}
              showQuickJumper={true}
            /> :
            <div className="no-data-box">暂无数据</div>
          }
        </Spin>
      </BasicLayout>
    );
  }
}

export default connect(({ myCarbonCopyQuery, loading }) => ({ ...myCarbonCopyQuery, loading }))(CarbonCopy);
