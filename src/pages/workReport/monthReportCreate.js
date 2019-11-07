import dva from 'dva';
import MonthReportCreate from 'routes/workReport/MonthReportCreate';
import monthReportCreate from 'models/workReport/monthReportCreate';
import 'styles/workReport/monthReportCreate.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(monthReportCreate);
app.router(() => <MonthReportCreate />);
app.start('#root');
