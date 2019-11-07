import dva from 'dva';
import WorkReportQuery from 'routes/workReport/WorkReportQuery';
import workReportQuery from 'models/workReport/workReportQuery';
import 'styles/workReport/workReportQuery.less';
import createLoading from 'dva-loading';
const app = dva({
  initialState: {}
});

app.use(createLoading());
app.model(workReportQuery);
app.router(() => <WorkReportQuery />);
app.start('#root');
