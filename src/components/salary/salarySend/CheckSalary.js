import { PureComponent } from 'react';
import { connect } from 'dva';
import UploadWarnAlert from 'components/salary/salarySend/UploadWarnAlert';
import CheckTable from 'components/salary/salarySend/CheckTable';

class CheckSalary extends PureComponent {
  changePage = (payload) => {
    this.props.dispatch({
      type: 'salarySend/changeCheckTablePage',
      payload
    });
  }

  // 切换模块
  switchModule = (payload) => {
    this.props.dispatch({
      type: 'salarySend/switchModule',
      payload
    });
  }

  // 改变实发工资选项
  changeColumn = (payload) => {
    this.props.dispatch({
      type: 'salarySend/changeColumn',
      payload
    });
  }

  render() {
    const { unexistList, pageList, paginator, selectedColumn, loading, } = this.props;
    const tableLoading = loading.effects['salarySend/changeCheckTablePage'];

    return (
      <div>
        <h5>工资条发放</h5>
        { (unexistList && unexistList.length)
          ? <UploadWarnAlert list={unexistList} />
          : null
        }
        <CheckTable
          list={pageList}
          paginator={paginator}
          changePage={this.changePage}
          switchModule={this.switchModule}
          selectedColumn={selectedColumn}
          changeColumn={this.changeColumn}
          loading={tableLoading}
        />
      </div>
    );
  }
}

export default connect(({ salarySend, loading, }) => ({ ...salarySend.checkSalary, loading }))(CheckSalary);
