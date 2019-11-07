/*
 * @Description: 会议室预定
 * @Author: danding
 * @Date: 2019-04-23 09:38:42
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-25 15:48:59
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import SearchBar from 'components/system/meetingRoomReserve/SearchBar';
import ReserveList from 'components/system/meetingRoomReserve/ReserveList';
import ReserveModal from 'components/system/meetingRoomReserve/ReserveModal';

class MeetingRoomReserve extends React.PureComponent {
  search = (payload) => {
    this.props.dispatch({
      type: 'meetingRoomReserve/search',
      payload
    });
  }

  hideModal = () => {
    this.props.dispatch({
      type: 'meetingRoomReserve/hideModal',
    });
  }

  reserveSubmit = (payload) => {
    this.props.dispatch({
      type: 'meetingRoomReserve/submitReserve',
      payload
    });
  }

  render() {
    const { showModal, reserveData, loading } = this.props;
    const modalLoading = loading.effects['meetingRoomReserve/submitReserve'];

    return (
      <BasicLayout>
        <SearchBar search={this.search} />
        <ReserveList />
        <ReserveModal
          loading={modalLoading}
          reserveData={reserveData}
          visible={showModal}
          hideModal={this.hideModal}
          reserveSubmit={this.reserveSubmit}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ meetingRoomReserve, loading }) => ({ ...meetingRoomReserve, loading }))(MeetingRoomReserve);


