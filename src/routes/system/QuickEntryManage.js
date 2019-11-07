/*
 * @Description: 快捷入口管理
 * @Author: danding
 * @Date: 2019-04-23 09:38:22
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-23 21:41:38
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import SearchBar from 'components/system/quickEntryManage/SearchBar';
import EntryTable from 'components/system/quickEntryManage/EntryTable';
import EntryEdit from 'components/system/quickEntryManage/EntryEdit';

class QuickEntryManage extends React.PureComponent {
  showModal = () => {
    this.props.dispatch({
      type: 'quickEntryManage/showModal'
    });
  }

  hideModal = () => {
    this.props.dispatch({
      type: 'quickEntryManage/hideModal'
    });
  }

  getList = (payload) => {
    this.props.dispatch({
      type: 'quickEntryManage/getList',
      payload
    });
  }

  submitEntry = (payload) => {
    this.props.dispatch({
      type: 'quickEntryManage/submit',
      payload
    });
  }

  render() {
    const { showModal, entryItemMsg } = this.props;
    return (
      <BasicLayout>
        <SearchBar
          onAdd={this.showModal}
          handleSubmit={this.getList}
        />
        <EntryTable />
        <EntryEdit
          hideModal={this.hideModal}
          visible={showModal}
          handleSubmit={this.submitEntry}
          entryItemMsg={entryItemMsg}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ quickEntryManage, loading }) => ({ ...quickEntryManage, loading }))(QuickEntryManage);


