/*
 * @Description: 新增文章
 * @Author: danding
 * @Date: 2019-04-19 15:31:35
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-19 15:31:35
 */

import dva from 'dva';
import InfoCreate from 'routes/system/InfoCreate';
import infoCreate from 'models/system/infoCreate';
import 'styles/system/infoCreate.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(infoCreate);
app.router(() => <InfoCreate />);
app.start('#root');
