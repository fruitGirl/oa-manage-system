import { PureComponent } from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import WxCodeValidate from 'components/businessCommon/WxCodeValidate';
import Separate from 'components/common/Separate';

class SalaryOperateWeixinTokenValidate extends PureComponent {
  onValid = (payload) => {
    this.props.dispatch({
      type: 'salaryOperateWeixinTokenValidate/onValid',
      payload
    });
  }

  render() {
    return (
      <BasicLayout>
        <Separate size={50} />
        <WxCodeValidate onValid={this.onValid} />
        <Separate size={80} />
      </BasicLayout>
    );
  }
}

export default connect(({ salaryOperateWeixinTokenValidate }) => ({ salaryOperateWeixinTokenValidate }))(SalaryOperateWeixinTokenValidate);
