/*
 * @Description: 系统-职位管理
 * @Author: qianqian
 * @Date: 2019-02-15 19:21:36
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-15 19:23:44
 */
import dva from 'dva';

import positionQueryModels from 'models/user/positionQuery';
import PositionQuery from 'routes/user/PositionQuery';
import 'styles/user/positionQuery.less';
// 1. Initialize
const app = dva({
  initialState: {
    positionQuery: {}
  }
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(positionQueryModels);
// 4. Router
app.router(() => <PositionQuery />);

// 5. Start
app.start('#root');
