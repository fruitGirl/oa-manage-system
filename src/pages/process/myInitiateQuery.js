/*
 * @Description: 流程-我的发起
 * @Author: qianqian
 * @Date: 2019-02-12 19:28:22
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-09 15:43:39
 */
import dva from 'dva';
import MySendModels from 'models/process/myInitiateQuery';
import MyApprovalQueryModels from 'models/process/myApprovalQuery';
import MyInitiateQuery from 'routes/process/MyInitiateQuery';
import createLoading from 'dva-loading';
import 'styles/process/myInitiateQuery.less';

// 我的发起
// 1. Initialize
const app = dva({
  // history: browserHistory(),
  initialState: {
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(MySendModels);
app.model(MyApprovalQueryModels);

// 4. Router
app.router(() => <MyInitiateQuery />);

// 5. Start
app.start('#root');
