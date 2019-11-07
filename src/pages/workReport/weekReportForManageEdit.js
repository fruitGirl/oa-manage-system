/*
 * @Description: 周报-主管模板
 * @Author: danding
 * @Date: 2019-05-15 19:23:57
 * @Last Modified by: juyang
 * @Last Modified time: 2019-05-20 18:04:59
 */

import dva from 'dva';
import WeekReportForManageEdit from 'routes/workReport/WeekReportForManageEdit';
import weekReportForManageEdit from 'models/workReport/weekReportForManageEdit';
import 'styles/workReport/weekReportForManageEdit.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(weekReportForManageEdit);
app.router(() => <WeekReportForManageEdit />);
app.start('#root');
