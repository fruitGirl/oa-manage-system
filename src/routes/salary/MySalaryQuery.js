/*
 * @Description: 个人-我的工资条
 * @Author: danding
 * @Date: 2019-03-20 16:14:57
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-29 18:06:40
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import { createColumns } from 'constants/salary/mySalaryQuery';
import WxCodeValidModal from 'components/salary/mySalaryQuery/WxCodeValidModal';
import SalaryModal from 'components/salary/mySalaryQuery/SalaryModal';

const { Table, } = window.antd;

class MySalaryQuery extends PureComponent {
  // 查看工资详情
  lookDetail = (params) => {
    this.props.dispatch({
      type: 'mySalaryQuery/lookDetail',
      payload: { salaryId: params }
    });
  }

  // 微信令牌验证
  onValid = (payload) => {
    this.props.dispatch({
      type: 'mySalaryQuery/onValid',
      payload
    });
  }

  // 隐藏工资弹框
  hideSalaryModal = () => {
    this.props.dispatch({
      type: 'mySalaryQuery/hideSalaryModal'
    });
  }

  // 隐藏微信令牌验证弹框
  hideValidModal = () => {
    this.props.dispatch({
      type: 'mySalaryQuery/hideValidModal'
    });
  }

  // 上一条
  onPrev = () => {
    const { curLookSalaryIdx } = this.props;
    const { id } = CONFIG.userSalaryList[curLookSalaryIdx - 1];
    this.lookDetail(id);
  }

  // 下一条
  onNext = () => {
    const { curLookSalaryIdx } = this.props;
    const { id } = CONFIG.userSalaryList[curLookSalaryIdx + 1];
    this.lookDetail(id);
  }

  render() {
    const {
      showValidModal,
      showSalaryModal,
      userSalary,
      curLookSalaryIdx,
      loading,
      visibleFields,
    } = this.props;
    const {
      lookDetail,
      onValid,
      hideSalaryModal,
      hideValidModal,
      onPrev,
      onNext,
    } = this;
    const salaryModalLoading = loading.effects['mySalaryQuery/lookDetail'];

    return (
      <BasicLayout>
        <h5 className="page-title">工资条属于敏感信息，请注意保密</h5>
        <div className="ant-table-wrapper bg-white">
          <Table
            rowKey={r => r.id}
            columns={createColumns({ lookDetail })}
            dataSource={CONFIG.userSalaryList}
            pagination={false}
          />
        </div>
        <WxCodeValidModal
          hideModal={hideValidModal}
          visible={showValidModal}
          onValid={onValid}
        />
        <SalaryModal
          curLookSalaryIdx={curLookSalaryIdx}
          visible={showSalaryModal}
          dataProvider={userSalary}
          onPrev={onPrev}
          onNext={onNext}
          hideModal={hideSalaryModal}
          loading={salaryModalLoading}
          visibleFields={visibleFields}
        />
      </BasicLayout>
    );
  }
}

export default connect(({ mySalaryQuery, loading }) => ({ ...mySalaryQuery, loading }))(MySalaryQuery);

