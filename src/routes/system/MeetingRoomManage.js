/*
 * @Description: 会议室管理
 * @Author: danding
 * @Date: 2019-04-23 09:38:58
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-23 12:21:32
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import SearchBar from 'components/system/meetingRoomManage/SearchBar';
import RoomTable from 'components/system/meetingRoomManage/RoomTable';
import RoomEdit from 'components/system/meetingRoomManage/RoomEdit';

class MeetingRoomManage extends React.PureComponent {
  handleSubmit = (payload) => {
    this.getList(payload);
  }

  getList = (payload) => {
    this.props.dispatch({
      type: 'meetingRoomManage/getList',
      payload
    });
  }

  showModal = () => {
    this.props.dispatch({
      type: 'meetingRoomManage/showModal'
    });
  }

  hideModal = () => {
    this.props.dispatch({
      type: 'meetingRoomManage/hideModal'
    });
  }

  submit = (payload) => {
    this.props.dispatch({
      type: 'meetingRoomManage/submit',
      payload
    });
  }

  render() {
    const { showModal, roomData } = this.props;
    return (
      <BasicLayout>
        <SearchBar
          showModal={this.showModal}
          handleSubmit={this.handleSubmit}
        />
        <RoomTable />
        <RoomEdit
          hideModal={this.hideModal}
          submit={this.submit}
          roomData={roomData}
          visible={showModal}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ meetingRoomManage, loading }) => ({ ...meetingRoomManage, loading }))(MeetingRoomManage);


