/*
 * @Description: 工具-工资条发放
 * @Author: danding
 * @Date: 2019-03-20 17:48:54
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:50:30
 */

import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import Separate from 'components/common/Separate';
import UploadFile from 'components/salary/salarySend/UploadFile';
import CheckSalary from 'components/salary/salarySend/CheckSalary';
import ColumnsSelectWrapper from 'components/salary/salarySend/ColumnsSelectWrapper';
import SalaryList from 'components/salary/salarySend/SalaryList';
import {
  UPLOAD_FILE_MODULE,
  CHECK_SALARY_MODULE,
  COLUMNS_SELECT_MODULE,
  SALARY_LIST_MODULE
} from 'constants/salary/salarySend';

class SalarySend extends PureComponent {
  componentDidMount() {
    this.initPage();
  }

  // 初始化模块展示，赋值工资列表
  initPage() {
    this.props.dispatch({
      type: 'salarySend/initPage',
      payload: CONFIG.salarys
    });
  }

  render() {
    const { showModule } = this.props;

    return (
      <BasicLayout>
        {
          showModule === UPLOAD_FILE_MODULE
            ? (
              <Fragment>
                <Separate size={100} />
                <UploadFile />
              </Fragment>
            )
            : null
        }
        {
          showModule === CHECK_SALARY_MODULE
            ? <CheckSalary />
            : null
        }
        {
          showModule === COLUMNS_SELECT_MODULE
            ? <ColumnsSelectWrapper />
            : null
        }
        {
          showModule === SALARY_LIST_MODULE
            ? <SalaryList />
            : null
        }
      </BasicLayout>
    );
  }
}

export default connect(({ salarySend }) => ({ ...salarySend }))(SalarySend);
