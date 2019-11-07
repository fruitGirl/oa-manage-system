import React from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';

const { LocaleProvider, zh_CN } = window.antd;

class Index extends React.PureComponent {
  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <BasicLayout>
        </BasicLayout>
      </LocaleProvider>
    );
  }
}

export default connect(({ monthReportCreate, loading }) => ({ ...monthReportCreate, loading }))(Index);


