/*
 * @Description: 团队绩效确认列表
 * @Author: danding
 * @Date: 2019-07-09 10:10:30
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-09 12:03:53
 */

import dva from 'dva';
import teamPerformanceConfirmTimeRangeModels from 'models/performance/teamPerformanceConfirmTimeRange';
import TeamPerformanceConfirmTimeRange from 'routes/performance/TeamPerformanceConfirmTimeRange';
import 'styles/performance/TeamPerformanceConfirmTimeRange.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(teamPerformanceConfirmTimeRangeModels);

// 4. Router
app.router(() => <TeamPerformanceConfirmTimeRange />);

// 5. Start
app.start('#root');
