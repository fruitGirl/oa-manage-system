/*
 * @Description: 个人-用户主页
 * @Author: danding
 * @Date: 2019-03-18 17:05:42
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-27 13:21:40
 */

import dva from 'dva';
import UserHomePage from 'routes/user/UserHomePage';
import userHomePage from 'models/user/userHomePage';
import 'styles/user/userHomePage.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(userHomePage);
app.router(() => <UserHomePage />);
app.start('#root');
