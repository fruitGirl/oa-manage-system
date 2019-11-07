/*
 * @Description: 团队配置
 * @Author: danding
 * @Date: 2019-07-09 10:10:30
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-09 10:41:26
 */

import dva from 'dva';
import teamQueryModels from 'models/performance/teamQuery';
import TeamQuery from 'routes/performance/TeamQuery';
import 'styles/performance/teamQuery.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(teamQueryModels);

// 4. Router
app.router(() => <TeamQuery />);

// 5. Start
app.start('#root');
