/*
 * @Description: 审批流程创建/编辑
 * @Author: danding
 * @Date: 2019-09-10 12:23:05
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-10 13:05:15
 */

import dva from 'dva';
import processConfigEdit from 'models/process/processConfigEdit';
import ProcessConfigEdit from 'routes/process/ProcessConfigEdit';
import 'styles/process/processConfigEdit.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(processConfigEdit);

// 4. Router
app.router(() => <ProcessConfigEdit />);

// 5. Start
app.start('#root');
