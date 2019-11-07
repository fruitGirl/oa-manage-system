import dva from 'dva';
import MyWorkReportQuery from 'routes/workReport/MyWorkReportQuery';
import myWorkReportQuery from 'models/workReport/myWorkReportQuery';
import 'styles/workReport/myWorkReportQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(myWorkReportQuery);
app.router(() => <MyWorkReportQuery />);
app.start('#root');
