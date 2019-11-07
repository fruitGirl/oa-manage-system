import dva from 'dva';
import userGroupManage from 'models/process/userGroupManage';
import UserGroupManage from 'routes/process/UserGroupManage';
import 'styles/process/approvalQuery.less';
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
app.model(userGroupManage);

// 4. Router
app.router(() => <UserGroupManage />);

// 5. Start
app.start('#root');