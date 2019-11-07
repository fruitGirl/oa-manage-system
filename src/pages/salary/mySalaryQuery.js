/*
 * @Description: 工具-我的工资条
 * @Author: danding
 * @Date: 2019-03-20 10:41:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-27 18:27:59
 */

import dva from 'dva';
import MySalaryQuery from 'routes/salary/MySalaryQuery';
import mySalaryQuery from 'models/salary/mySalaryQuery';
import 'styles/salary/mySalaryQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(mySalaryQuery);
app.router(() => <MySalaryQuery />);
app.start('#root');
