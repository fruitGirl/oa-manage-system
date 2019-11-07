/*
 * @Description: 文章详情
 * @Author: danding
 * @Date: 2019-04-19 15:31:54
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-19 15:31:54
 */

import dva from 'dva';
import InfoDetailQuery from 'routes/system/InfoDetailQuery';
import infoDetailQuery from 'models/system/infoDetailQuery';
import 'styles/system/infoDetailQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(infoDetailQuery);
app.router(() => <InfoDetailQuery />);
app.start('#root');
