/*
 * @Description: 绩效查询
 * @Author: lanlan
 * @Date: 2019-02-19 14:53:36
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-07 11:27:29
 */

import dva from 'dva';
import userPerformanceQuery from 'models/performance/userPerformanceQuery';
import UserPerformanceQuery from 'routes/performance/UserPerformanceQuery';
import 'styles/performance/userPerformanceQuery.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(userPerformanceQuery);

// 4. Router
app.router(() => <UserPerformanceQuery />);

// 5. Start
app.start('#root');
