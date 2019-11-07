/*
 * @Description: 工具-工资条发放（工资项配置）
 * @Author: danding
 * @Date: 2019-03-20 10:41:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-22 18:08:19
 */

import dva from 'dva';
import SalaryModify from 'routes/salary/SalaryModify';
import salaryModify from 'models/salary/salaryModify';
import 'styles/salary/salaryModify.less';

const app = dva({
  initialState: {}
});
app.model(salaryModify);
app.router(() => <SalaryModify />);
app.start('#root');
