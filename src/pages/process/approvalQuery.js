/*
 * @Description: 流程-审批查询
 * @Author: qianqian
 * @Date: 2019-02-12 19:50:08
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-09 15:43:25
 */
import dva from 'dva';
import approvalQueryModels from 'models/process/approvalQuery';
import MyApprovalQueryModels from 'models/process/myApprovalQuery';
import ApprovalQuery from 'routes/process/ApprovalQuery';
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
app.model(approvalQueryModels);
app.model(MyApprovalQueryModels);

// 4. Router
app.router(() => <ApprovalQuery />);

// 5. Start
app.start('#root');
