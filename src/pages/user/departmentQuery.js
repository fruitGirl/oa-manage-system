import dva from 'dva';
import DepartmentQuery from 'routes/user/DepartmentQuery';
import departmentQuery from 'models/user/departmentQuery';
import 'styles/user/departmentQuery.less';
import createLoading from 'dva-loading';

const app = dva({
  initialState: {}
});
app.use(createLoading());
app.model(departmentQuery);
app.router(() => <DepartmentQuery />);
app.start('#root');
