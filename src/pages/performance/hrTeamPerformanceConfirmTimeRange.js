/*
 * @Description: 团队绩效确认列表
 * @Author: danding
 * @Date: 2019-07-09 10:10:30
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-09 12:40:23
 */

import dva from 'dva';
import hrTeamPerformanceConfirmTimeRange from 'models/performance/hrTeamPerformanceConfirmTimeRange';
import HrTeamPerformanceConfirmTimeRange from 'routes/performance/HrTeamPerformanceConfirmTimeRange';
import 'styles/performance/hrTeamPerformanceConfirmTimeRange.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(hrTeamPerformanceConfirmTimeRange);

// 4. Router
app.router(() => <HrTeamPerformanceConfirmTimeRange />);

// 5. Start
app.start('#root');

