/*
 * @Description: 快捷入口管理
 * @Author: danding
 * @Date: 2019-04-19 15:35:08
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-19 15:35:08
 */

import dva from 'dva';
import QuickEntryManage from 'routes/system/QuickEntryManage.js';
import quickEntryManage from 'models/system/quickEntryManage.js';
import 'styles/system/quickEntryManage.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(quickEntryManage);
app.router(() => <QuickEntryManage />);
app.start('#root');
