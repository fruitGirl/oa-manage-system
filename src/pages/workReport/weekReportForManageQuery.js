import dva from 'dva';
import WeekReportForManageQuery from 'routes/workReport/WeekReportForManageQuery';
import weekReportForManageQuery from 'models/workReport/weekReportForManageQuery';
import 'styles/workReport/weekReportForManageQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(weekReportForManageQuery);
app.router(() => <WeekReportForManageQuery />);
app.start('#root');
