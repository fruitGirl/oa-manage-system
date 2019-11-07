/*
 * @Description: 会议室预定
 * @Author: danding
 * @Date: 2019-04-19 15:34:41
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-19 15:34:41
 */

import dva from 'dva';
import MeetingRoomReserve from 'routes/system/MeetingRoomReserve';
import meetingRoomReserve from 'models/system/meetingRoomReserve';
import 'styles/system/meetingRoomReserve.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(meetingRoomReserve);
app.router(() => <MeetingRoomReserve />);
app.start('#root');
