import { PureComponent } from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import ManageTable from 'components/salary/salaryManage/ManageTable';
import ModifySalaryModal from 'components/salary/salaryManage/ModifySalaryModal';

class SalaryManage extends PureComponent {
  render() {
    return (
      <BasicLayout>
        <ManageTable />
        <ModifySalaryModal />
      </BasicLayout>
    );
  }
}

export default connect(({ salaryManage }) => ({ ...salaryManage }))(SalaryManage);
