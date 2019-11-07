/*
 * @Description: 系统-权限类型管理
 * @Author: qianqian
 * @Date: 2019-02-18 11:49:45
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 11:51:33
 */
import dva from 'dva';

import authorityTypeQueryModels from 'models/user/authorityTypeQuery';
import AuthorityTypeQuery from 'routes/user/AuthorityTypeQuery';
import 'styles/user/authorityTypeQuery.less';
// 1. Initialize
const app = dva({
  initialState: {
    authorityTypeQuery: {}
  }
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(authorityTypeQueryModels);
// 4. Router
app.router(() => <AuthorityTypeQuery />);

// 5. Start
app.start('#root');
