import dva from 'dva';
import WorkReportStatisticQuery from 'routes/workReport/WorkReportStatisticQuery';
import workReportStatisticQuery from 'models/workReport/workReportStatisticQuery';
import 'styles/workReport/workReportStatisticQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(workReportStatisticQuery);
app.router(() => <WorkReportStatisticQuery />);
app.start('#root');
