/*
 * @Description: 工具-工资发放-工资项配置
 * @Author: danding
 * @Date: 2019-03-22 19:47:26
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:01:46
 */

import { PureComponent } from 'react';
import { connect } from 'dva';
import SalaryColumnsSelect from 'components/businessCommon/SalaryColumnsSelect';
import Separate from 'components/common/Separate';
import { CHECK_SALARY_MODULE, } from 'constants/salary/salarySend';

const { Button } = window.antd;

class ColumnsSelectWrapper extends PureComponent {
  switchModule = (payload) => {
    this.props.dispatch({
      type: 'salarySend/switchModule',
      payload
    });
  }

  saveSalary = () => {
    const payload = this.salaryColumnsRef.getColumns();
    this.props.dispatch({
      type: 'salarySend/saveSalary',
      payload
    });
  }

  render() {
    const { checkSalary, loading, } = this.props;
    const { selectedColumn } = checkSalary;
    const saveLoading = loading.effects['salarySend/saveSalary'];

    return (
      <div>
        <SalaryColumnsSelect
          ref={ref => { this.salaryColumnsRef = ref; }}
          selectedColumn={selectedColumn}
        />
        <Separate size={25} />
        <Button onClick={() => this.switchModule(CHECK_SALARY_MODULE)}>上一步</Button>
        <Separate isVertical={false} />
        <Button
          loading={saveLoading}
          disabled={saveLoading}
          type="primary"
          onClick={this.saveSalary}
        >下一步</Button>
      </div>
    );
  }
}

export default connect(({ salarySend, loading, }) => ({ ...salarySend, loading }))(ColumnsSelectWrapper);
