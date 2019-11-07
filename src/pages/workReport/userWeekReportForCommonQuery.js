/*
 * @Description: 查询员工周报
 * @Author: juyang
 * @Date: 2019-05-17 17:18:23
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-21 11:11:43
 */
import dva from 'dva';
import UserWeekReportForCommonQuery from 'routes/workReport/userWeekReportForCommonQuery';
import userWeekReportForCommonQuery from 'models/workReport/userWeekReportForCommonQuery';
import 'styles/workReport/userWeekReportForCommonQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(userWeekReportForCommonQuery);
app.router(() => <UserWeekReportForCommonQuery />);
app.start('#root');
