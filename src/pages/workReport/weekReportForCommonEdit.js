/*
 * @Description: 周报-普通模板
 * @Author: danding
 * @Date: 2019-05-15 19:23:05
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-15 19:23:05
 */

import dva from 'dva';
import WeekReportForCommonEdit from 'routes/workReport/WeekReportForCommonEdit';
import weekReportForCommonEdit from 'models/workReport/weekReportForCommonEdit';
import 'styles/workReport/weekReportForCommonEdit.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(weekReportForCommonEdit);
app.router(() => <WeekReportForCommonEdit />);
app.start('#root');
