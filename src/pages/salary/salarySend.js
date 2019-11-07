/*
 * @Description: 工具-工资条发放
 * @Author: danding
 * @Date: 2019-03-20 10:41:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-26 15:13:02
 */

import dva from 'dva';
import SalarySend from 'routes/salary/salarySend';
import salarySend from 'models/salary/salarySend';
import 'styles/salary/salarySend.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(salarySend);
app.router(() => <SalarySend />);
app.start('#root');
