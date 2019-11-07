/*
 * @Description: 系统-角色管理
 * @Author: qianqian
 * @Date: 2019-02-18 11:36:29
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 11:46:47
 */
import dva from 'dva';

import roleQueryModels from 'models/user/roleQuery';
import RoleQuery from 'routes/user/RoleQuery';

import 'styles/user/roleQuery.less';

// 1. Initialize
const app = dva({
  initialState: {
    roleQuery: {
      departmentId: ''
    }
  }
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(roleQueryModels);
// 4. Router
app.router(() => <RoleQuery />);

// 5. Start
app.start('#root');
