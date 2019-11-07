/*
 * @Description: 会议室预定-列表
 * @Author: danding
 * @Date: 2019-04-26 18:21:37
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-30 18:52:26
 */

import React from 'react';
import { connect } from 'dva';
import ReservePane from 'components/system/meetingRoomReserve/ReservePane';
import { INTERVAL_STAMP } from 'constants/system/meetingRoomReserve';

const { Spin, Empty, } = window.antd;

class ReserveList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startMarkPaneId: '',
      startMarkPaneStamp: ''
    };
  }

  doReserve = (data) => {
    let { startMarkIdx, endMarkIdx, id, name } = data;
    endMarkIdx = (typeof endMarkIdx === 'number')
      ? endMarkIdx
      : startMarkIdx;
    if (startMarkIdx > endMarkIdx) { // 逆序选择
      const wrapperIdx = startMarkIdx;
      startMarkIdx = endMarkIdx;
      endMarkIdx = wrapperIdx;
    }
    const { searchData } = this.props;
    let { reserve } = searchData;
    const timeStramp = T.date.toDate(reserve).getTime();
    const startStamp = timeStramp + INTERVAL_STAMP * startMarkIdx;
    const endStamp = timeStramp + INTERVAL_STAMP * (endMarkIdx + 1);

    this.props.dispatch({
      type: 'meetingRoomReserve/doReserve',
      payload: {
        name,
        gmtReserve: reserve,
        meetingRoomConfigId: id,
        gmtEnd: T.date.format(new Date(endStamp), 'yyyy-MM-dd hh:mm'),
        gmtStart: T.date.format(new Date(startStamp), 'yyyy-MM-dd hh:mm'),
      }
    });
  }

  startMark = (id) => {
    this.setState({
      startMarkPaneId: id,
      startMarkPaneStamp: Date.now()
    });
  }

  render() {
    const { startMarkPaneStamp, startMarkPaneId } = this.state;
    const { list, loading, searchData } = this.props;
    const { reserve } = searchData;
    const listLoading = loading.effects['meetingRoomReserve/search'];

    return (
          <Spin spinning={listLoading}>
            {
              list.map(i => {
                const curMarking = i.id === startMarkPaneId;
                return (
                  <ReservePane
                    key={i.id}
                    dataProvider={i}
                    reserve={reserve}
                    restartTime={startMarkPaneStamp}
                    curMarking={curMarking}
                    disabledIdxArr={i.reservedIdxArr}
                    doReserve={(data) => this.doReserve({
                      ...i,
                      ...data
                    })}
                    startMark={this.startMark}
                  />
                );
              })
            }
            {
              list.length
                ? null
                : <div className="empty-wrapper"><Empty /></div>
            }
          </Spin>
      );
  }
}

export default connect(({ meetingRoomReserve, loading }) => ({ loading, ...meetingRoomReserve, }))(ReserveList);
