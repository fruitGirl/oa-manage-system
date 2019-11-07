/*
 * @Description: 个人-用户信息查询列表
 * @Author: danding
 * @Date: 2019-03-20 10:41:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-29 17:49:53
 */

import dva from 'dva';
import UserPersonalHomePageQuery from 'routes/user/userPersonalHomePageQuery';
import userPersonalHomePageQuery from 'models/user/userPersonalHomePageQuery';
import 'styles/user/userPersonalHomePageQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(userPersonalHomePageQuery);
app.router(() => <UserPersonalHomePageQuery />);
app.start('#root');
