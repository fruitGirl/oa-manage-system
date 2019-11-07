/*
 * @Description: 会议室-我的预约
 * @Author: danding
 * @Date: 2019-04-23 09:38:08
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:49:24
 */

import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import { NAV_CONFIG } from 'constants/components/system/statusNav';
import StatusNav from 'components/system/myMeetingRoomQuery/StatusNav';
import List from 'components/system/myMeetingRoomQuery/List';

class MyMeetingRoomQuery extends React.PureComponent {
  componentDidMount() {
    this.initData();
  }

  toggleNav = (val) => {
    this.props.dispatch({
      type: 'myMeetingRoomQuery/shiftNav',
      payload: val
    });
  }

  initData = () => {
    const { meetingRoomReserveList, meetingRoomConfigList } = CONFIG;
    this.props.dispatch({
      type: 'myMeetingRoomQuery/resolveData',
      payload: { meetingRoomReserveList, meetingRoomConfigList }
    });
  }

  changePage = (page) => {
    this.props.dispatch({
      type: 'myMeetingRoomQuery/getList',
      payload: { currentPage: page }
    });
  }

  cancelReserve = (payload) => {
    this.props.dispatch({
      type: 'myMeetingRoomQuery/cancelReserve',
      payload
    });
  }

  endReserve = (payload) => {
    this.props.dispatch({
      type: 'myMeetingRoomQuery/endReserve',
      payload
    });
  }

  render() {
    const { activeNavVal, list, paginator } = this.props;

    return (
          <BasicLayout>
            <StatusNav
              toggleNav={this.toggleNav}
              activeNav={NAV_CONFIG}
              activeNavVal={activeNavVal}
            />
            <List
              onChange={this.changePage}
              paginator={paginator}
              list={list}
              activeNavVal={activeNavVal}
              cancelReserve={this.cancelReserve}
              endReserve={this.endReserve}
            />
          </BasicLayout>
    );
  }
}

export default connect(({ myMeetingRoomQuery, loading }) => ({ ...myMeetingRoomQuery, loading }))(MyMeetingRoomQuery);


