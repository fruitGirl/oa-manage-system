/*
 * @Description: 工具-工资条发放-工资条编辑/查看
 * @Author: danding
 * @Date: 2019-03-20 10:41:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-26 16:53:38
 */

import dva from 'dva';
import SalaryManage from 'routes/salary/SalaryManage';
import salaryManage from 'models/salary/salaryManage';
import 'styles/salary/salaryManage.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(salaryManage);
app.router(() => <SalaryManage />);
app.start('#root');
