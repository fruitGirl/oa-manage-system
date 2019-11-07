import { PureComponent } from 'react';
import { connect } from 'dva';
import SalarColumnsSelect from 'components/businessCommon/SalaryColumnsSelect';
import Separate from 'components/common/Separate';
import BasicLayout from 'layouts/BasicLayout';
import qs from 'qs';

const { Button } = window.antd;

class SalaryModify extends PureComponent {
  componentDidMount() {
    const { id } = qs.parse(window.location.search,
      { ignoreQueryPrefix: true }
    );
    this.id = id;
  }

  saveColumns = () => {
    const checkedList = this.salaryColumnsRef.getColumns();
    this.props.dispatch({
      type: 'salaryModify/saveColumns',
      payload: { userSalaryStatusEnumList: checkedList, id: this.id }
    });
  }

  render() {
    const defaultCheckList = CONFIG.selectedList || [];
    return (
      <BasicLayout>
        <SalarColumnsSelect
          ref={ref => { this.salaryColumnsRef = ref; }}
          visibleSelectedColumn={false}
          defaultCheckList={defaultCheckList}
        />
        <Separate size={25} />
        <Button type="primary" onClick={this.saveColumns}>保存</Button>
      </BasicLayout>
    );
  }
}

export default connect(({ salaryModify }) => ({ ...salaryModify }))(SalaryModify);
