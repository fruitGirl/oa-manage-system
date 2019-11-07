/*
 * @Description: 文章管理
 * @Author: danding
 * @Date: 2019-04-19 15:32:11
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-19 15:32:11
 */

import dva from 'dva';
import InfoManage from 'routes/system/InfoManage';
import infoManage from 'models/system/InfoManage';
import 'styles/system/infoManage.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(infoManage);
app.router(() => <InfoManage />);
app.start('#root');
