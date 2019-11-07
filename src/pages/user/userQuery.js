/*
 * @Description: 系统-员工查询
 * @Author: qianqian
 * @Date: 2019-02-15 18:24:19
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-15 18:26:40
 */

import dva from 'dva';

import userQueryModels from 'models/user/userQuery';
import UserQuery from 'routes/user/UserQuery';
import 'styles/user/userQuery.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {
    userQuery: {
      departmentId: '',
      departmentName: ''
    }
  }
});


// 2. Plugins
// app.use({});

app.use(createLoading());

// 3. Model
app.model(userQueryModels);
// 4. Router
app.router(() => <UserQuery />);

// 5. Start
app.start('#root');
