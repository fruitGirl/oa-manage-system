/*
 * @Description: 工具-工资条发放（令牌验证）
 * @Author: danding
 * @Date: 2019-03-20 10:41:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-27 14:06:27
 */

import dva from 'dva';
import SalaryOperateWeixinTokenValidate from 'routes/salary/salaryOperateWeixinTokenValidate';
import salaryOperateWeixinTokenValidate from 'models/salary/salaryOperateWeixinTokenValidate';
import 'styles/salary/salaryOperateWeixinTokenValidate.less';
const app = dva({
  initialState: {}
});
app.model(salaryOperateWeixinTokenValidate);
app.router(() => <SalaryOperateWeixinTokenValidate />);
app.start('#root');
