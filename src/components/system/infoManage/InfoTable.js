/*
 * @Description: 新闻管理-表格
 * @Author: danding
 * @Date: 2019-04-23 09:42:43
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-25 14:53:29
 */

import React from 'react';
import { connect } from 'dva';
import 'styles/components/system/infoManage/infoTable.less';
import { createColumns } from 'constants/components/system/infoTable';
import Separate from 'components/common/Separate';

const { Button, Table, Modal, Spin } = window.antd;

class InfoTable extends React.PureComponent {
  changePage = ({ current }) => {
    const { searchData } = this.props;
    this.props.dispatch({
      type: 'infoManage/getList',
      payload: { ...searchData, currentPage: current, }
    });
  }

  changeSelected = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'infoManage/recordRows',
      payload: { selectedRowKeys, selectedRows }
    });
  }

  preview = (payload) => {
    this.props.dispatch({
      type: 'infoManage/preview',
      payload
    });
  }

  updatePublish = (payload) => {
    this.props.dispatch({
      type: 'infoManage/updatePublish',
      payload
    });
  }

  edit = (id) => {
    T.tool.redirectTo(`${CONFIG.frontPath}/system/infoModify.htm?id=${id}`);
  }

  remove = (payload) => {
    this.props.dispatch({
      type: 'infoManage/remove',
      payload
    });
  }

  batchUpdatePublish = (publishOperate) => {
    let { selectedRows } = this.props;
    const list = selectedRows.filter(i => i.published === !publishOperate);
    const idList = list.map(i => i.id);
    const len = list.length;
    const content = publishOperate
      ? (
        <div>
          <p>未发表：{len}条</p>
          <p>是否将所有选中未发表的文章全部发表？</p>
        </div>
      )
      : (
        <div>
          <p>已发表：{len}条</p>
          <p>是否将所有选中已发表的文章全部下架？</p>
        </div>
      );
    Modal.confirm({
      title: '批量操作?',
      content,
      onOk: () => {
        this.props.dispatch({
          type: 'infoManage/batchUpdatePublish',
          payload: {
            published: publishOperate,
            idList
          }
        });
      }
    });
  }

  render() {
    const { preview, edit, remove, updatePublish } = this;
    const { paginator, list, selectedRowKeys, loading, isSearched } = this.props;
    const { itemsPerPage = 0, items = 0, page = 1 } = paginator;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.changeSelected
    };

    const pagination = {
      current: page,
      total: items,
      pageSize: itemsPerPage,
      showQuickJumper: true,
      showTotal: () => `共 ${items} 条`
    };

    const disabled = !selectedRowKeys.length; // 批量操作按钮禁用
    const tableLoading = loading.effects['infoManage/getList']
     || loading.effects['infoManage/batchUpdatePublish']
     || loading.effects['infoManage/remove']
     || loading.effects['infoManage/updatePublish']
     || false;

    return isSearched
      ? (
        <Spin spinning={tableLoading}>
          <div className="info-table">
            <div className="action-btns">
              <Button
                disabled={disabled}
                type="primary"
                onClick={() => this.batchUpdatePublish(true)}
              >批量发表</Button>
              <Button
                disabled={disabled}
                type="primary"
                onClick={() => this.batchUpdatePublish(false)}
              >批量下架</Button>
            </div>
            <Separate size={20} />
            <Table
              rowKey={(r) => r.id}
              rowSelection={rowSelection}
              columns={createColumns({
                preview,
                updatePublish,
                edit,
                remove,
              })}
              dataSource={list}
              pagination={pagination}
              onChange={this.changePage}
            />
          </div>
        </Spin>
      )
      : null;
  }
}

export default connect(({ infoManage, loading, }) => ({ ...infoManage, loading }))(InfoTable);

