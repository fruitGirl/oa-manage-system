/*
 * @Description: 系统-员工创建
 * @Author: qianqian
 * @Date: 2019-02-15 18:40:53
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-15 18:41:53
 */

import dva from 'dva';

import userCreateModels from 'models/user/userCreate';
import UserCreate from 'routes/user/UserCreate';
import 'styles/user/userCreate.less';

// let Klass = {
//   init() {
//     // 是否是修改页面
//     if(CONFIG.processInstanceId) {

//     } else {
//       CONFIG.educationKeys.push(1);
//       ++CONFIG.educationUuid;

//       CONFIG.workExperienceKeys.push(1);
//       ++CONFIG.workExperienceUuid;

//       CONFIG.familyMemberKeys.push(1);
//       ++CONFIG.familyMemberUuid;
//     }

//   },

// };

// Klass.init();

// 1. Initialize
const app = dva({
  initialState: {
    userCreate: {
      departmentId: CONFIG.departmentId,
      departmentName: CONFIG.departmentName
    }
  }
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(userCreateModels);
// 4. Router
app.router(() => <UserCreate />);

// 5. Start
app.start('#root');
