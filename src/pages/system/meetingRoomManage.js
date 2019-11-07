/*
 * @Description: 会议室管理
 * @Author: danding
 * @Date: 2019-04-19 15:34:17
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-19 15:34:17
 */

import dva from 'dva';
import MeetingRoomManage from 'routes/system/MeetingRoomManage';
import meetingRoomManage from 'models/system/meetingRoomManage';
import 'styles/system/meetingRoomManage.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(meetingRoomManage);
app.router(() => <MeetingRoomManage />);
app.start('#root');
