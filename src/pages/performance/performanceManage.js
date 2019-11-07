/*
 * @Description: 绩效管理页面
 * @Author: moran 
 * @Date: 2019-08-06 14:35:00 
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-06 14:35:21
 */

import dva from 'dva';
import performanceManage from 'models/performance/performanceManage';
import PerformanceManage from 'routes/performance/performanceManage';
import 'styles/performance/performanceManage.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(performanceManage);

// 4. Router
app.router(() => <PerformanceManage />);

// 5. Start
app.start('#root');
