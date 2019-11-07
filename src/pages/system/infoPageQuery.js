/*
 * @Description: 更多文章
 * @Author: danding
 * @Date: 2019-04-19 15:33:58
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-19 15:33:58
 */

import dva from 'dva';
import InfoPageQuery from 'routes/system/InfoPageQuery';
import infoPageQuery from 'models/system/infoPageQuery';
import 'styles/system/infoPageQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(infoPageQuery);
app.router(() => <InfoPageQuery />);
app.start('#root');
