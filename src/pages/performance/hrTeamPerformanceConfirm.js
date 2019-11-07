/*
 * @Description: 人事绩效确认详情
 * @Author: danding
 * @Date: 2019-07-09 10:10:30
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-09 15:04:58
 */

import dva from 'dva';
import hrTeamPerformanceConfirm from 'models/performance/hrTeamPerformanceConfirm';
import HrTeamPerformanceConfirm from 'routes/performance/HrTeamPerformanceConfirm';
import 'styles/performance/hrTeamPerformanceConfirm.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(hrTeamPerformanceConfirm);

// 4. Router
app.router(() => <HrTeamPerformanceConfirm />);

// 5. Start
app.start('#root');
