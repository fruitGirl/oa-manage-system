/*
 * @Description: 团队绩效确认详情
 * @Author: danding
 * @Date: 2019-07-09 10:10:30
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-09 14:49:22
 */

import dva from 'dva';
import teamPerformanceConfirm from 'models/performance/teamPerformanceConfirm';
import TeamPerformanceConfirm from 'routes/performance/TeamPerformanceConfirm';
import 'styles/performance/teamPerformanceConfirm.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(teamPerformanceConfirm);

// 4. Router
app.router(() => <TeamPerformanceConfirm />);

// 5. Start
app.start('#root');
