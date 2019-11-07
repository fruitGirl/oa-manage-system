/*
 * @Description: 个人-我的主页
 * @Author: danding
 * @Date: 2019-03-18 17:05:42
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-27 13:21:52
 */

import dva from 'dva';
import UserPersonalHomePage from 'routes/user/UserPersonalHomePage';
import userPersonalHomePage from 'models/user/userPersonalHomePage';
import 'styles/user/userPersonalHomePage.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(userPersonalHomePage);
app.router(() => <UserPersonalHomePage />);
app.start('#root');
