/*
 * @Description: 审批流程管理
 * @Author: danding
 * @Date: 2019-09-10 12:23:05
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-10 12:56:52
 */

import dva from 'dva';
import processConfigQuery from 'models/process/processConfigQuery';
import ProcessConfigQuery from 'routes/process/ProcessConfigQuery';
import 'styles/process/processConfigQuery.less';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  initialState: {}
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
app.model(processConfigQuery);

// 4. Router
app.router(() => <ProcessConfigQuery />);

// 5. Start
app.start('#root');
