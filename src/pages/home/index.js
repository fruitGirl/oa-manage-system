/*
 * @Description: 首页
 * @Author: danding
 * @Date: 2019-04-15 16:29:56
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-15 16:31:38
 */

import dva from 'dva';
import Index from 'routes/home';
import index from 'models/home';
import 'styles/home/index.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(index);
app.router(() => <Index />);
app.start('#root');
