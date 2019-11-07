/*
 * @Description: 流程-我的审批
 * @Author: qianqian
 * @Date: 2019-02-12 19:12:21
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-09 15:43:30
 */
import dva from 'dva';
import MyApprovalQueryModels from 'models/process/myApprovalQuery';
import MyApprovalQuery from 'routes/process/MyApprovalQuery';
import createLoading from 'dva-loading';
import 'styles/process/myApprovalQuery.less';
// 我的审批
// 1. Initialize
const app = dva({
  // history: browserHistory(),
  initialState: {
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(MyApprovalQueryModels);

// 4. Router
app.router(() => <MyApprovalQuery />);

// 5. Start
app.start('#root');
