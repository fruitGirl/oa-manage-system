/*
 * @Description: 登录
 * @Author: qianqian
 * @Date: 2019-02-18 11:36:29
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 11:46:47
 */
import dva from 'dva';
import login from 'models/user/login';
import Login from 'routes/user/Login';
import 'styles/user/login.less';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(login);
// 4. Router
app.router(() => <Login />);

// 5. Start
app.start('#root');
