/*
 * @Description: 系统-授予员工权限
 * @Author: qianqian
 * @Date: 2019-02-18 14:46:56
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 15:16:56
 */
import dva from 'dva';
import grantUserAuthorityModels from 'models/user/grantUserAuthority';
import GrantUserAuthority from 'routes/user/GrantUserAuthority';
import 'styles/user/grantUserAuthority.less';

// 1. Initialize
const app = dva({
  initialState: {
    grantUserAuthority: {
      departmentId: ''
    }
  }
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(grantUserAuthorityModels);
// 4. Router
app.router(() => <GrantUserAuthority />);

// 5. Start
app.start('#root');
