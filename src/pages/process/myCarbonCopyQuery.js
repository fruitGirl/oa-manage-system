/*
 * @Description: 流程-抄送
 * @Author: qianqian
 * @Date: 2019-02-12 19:43:09
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-09 15:43:35
 */
import dva from 'dva';
import carbonCopyModels from 'models/process/myCarbonCopyQuery';
import MyApprovalQueryModels from 'models/process/myApprovalQuery';
import CarbonCopy from 'routes/process/MyCarbonCopyQuery';
import createLoading from 'dva-loading';
import 'styles/process/myCarbonCopyQuery.less';
// 抄送
// 1. Initialize
const app = dva({
  initialState: {
  }
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(carbonCopyModels);
app.model(MyApprovalQueryModels);

// 4. Router
app.router(() => <CarbonCopy />);

// 5. Start
app.start('#root');
