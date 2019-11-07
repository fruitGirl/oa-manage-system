/*
 * @Description: 我的预定
 * @Author: danding
 * @Date: 2019-04-19 15:34:50
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-19 15:34:50
 */

import dva from 'dva';
import MyMeetingRoomQuery from 'routes/system/MyMeetingRoomQuery';
import myMeetingRoomQuery from 'models/system/myMeetingRoomQuery';
import 'styles/system/myMeetingRoomQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(myMeetingRoomQuery);
app.router(() => <MyMeetingRoomQuery />);
app.start('#root');
