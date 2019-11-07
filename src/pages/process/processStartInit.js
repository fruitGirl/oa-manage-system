import dva from 'dva';
import processInit from 'models/process/processInit';
import ProcessInit from 'routes/process/ProcessInit';
import createLoading from 'dva-loading';
// import 'styles/process/approvalQuery.less';

//审批查阅
// 1. Initialize
const app = dva({
  initialState: {
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(processInit);

// 4. Router
app.router(() => <ProcessInit />);

// 5. Start
app.start('#root');