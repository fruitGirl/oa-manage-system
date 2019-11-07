import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import SearchBar from 'components/user/departmentQuery/SearchBar';
import DepartmentTable from 'components/user/departmentQuery/DepartmentTable';
import EditDepaModal from 'components/businessCommon/EditDepaModal';
import { EDIT_MODE } from 'constants/components/common/editDepaModal';
import MemberModal from 'components/user/departmentQuery/MemberModal';

const { LocaleProvider, zh_CN } = window.antd;

class DepartmentQuery extends React.PureComponent {
  getList = (payload) => {
    this.props.dispatch({
      type: 'departmentQuery/getList',
      payload
    });
  }

  hideDepaModal = () => {
    this.props.dispatch({
      type: 'departmentQuery/hideDepaModal'
    });
  }

  hideMemberModal = () => {
    this.props.dispatch({
      type: 'departmentQuery/hideMemberModal'
    });
  }

  render() {
    const { showDepaModal, showMemberModal } = this.props;
    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
          <SearchBar handleSubmit={this.getList} />
          <DepartmentTable />
          <EditDepaModal
            visible={showDepaModal}
            mode={EDIT_MODE}
            hideModal={this.hideDepaModal}
          />
          <MemberModal
            visible={showMemberModal}
            loading={false}
            hideModal={this.hideMemberModal}
            list={[]}
            msg={{}}
          />
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

export default connect(({ loading }) => ({ loading }))(DepartmentQuery);


