import dva from 'dva';
import processCreate from 'models/process/processCreate';
import ProcessCreate from 'routes/process/ProcessCreate';
import createLoading from 'dva-loading';

//审批查阅
// 1. Initialize
const app = dva({
  initialState: {
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(processCreate);

// 4. Router
app.router(() => <ProcessCreate />);

// 5. Start
app.start('#root');