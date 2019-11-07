/*
 * @Description: 工具-工资发放-审核工资列表
 * @Author: danding
 * @Date: 2019-03-22 19:47:47
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 17:56:37
 */

import { PureComponent, Fragment, } from 'react';
import PropTypes from 'prop-types';
import 'styles/components/salary/salarySend/checkTable.less';
import Separate from 'components/common/Separate';
import { createColumns } from 'constants/components/salary/checkTable';
import { UPLOAD_FILE_MODULE, COLUMNS_SELECT_MODULE, } from 'constants/salary/salarySend';
import { SALARY_SEND_CONFIGS, } from 'constants/components/common/salarySend';

const { Select, Form, Table, Button, } = window.antd;
const Option = Select.Option;

class CheckTable extends PureComponent {
  componentDidMount() {
    this.calculateTableHeight();
  }

  // 计算表格的高度
  calculateTableHeight() {
    const surplusHeight = 460; // 多余高度（除去表格高度）
    const wrapperHeight = document.documentElement.clientHeight || document.body.clientHeight;
    this.tableHeight = (wrapperHeight && (wrapperHeight > surplusHeight))
      ? (wrapperHeight - surplusHeight)
      : false; // 表格高度
  }

  render() {
    const {
      list,
      paginator,
      changePage,
      switchModule,
      selectedColumn,
      changeColumn,
      loading,
    } = this.props;
    const { itemsPerPage, items, page } = paginator;
    const pagination = {
      current: page,
      total: items,
      pageSize: itemsPerPage,
      showQuickJumper: true,
      showTotal: () => `共 ${items} 条`
    };
    const { tableHeight } = this;

    return (
      <Fragment>
        <Form className="check-table-form">
          <Form.Item
            label={(
              <Fragment>
                <span className="tip-icon">*</span>
                <span>系统字段“实发工资”是你表格中的</span>
              </Fragment>
            )}
            labelCol= {{ span: 14 }}
            wrapperCol= {{ span: 10 }}
            rules={[{required: true}]}
          >
            <Select value={selectedColumn} onChange={changeColumn}>
              {
                SALARY_SEND_CONFIGS.map(i => (<Option value={i.value}>{i.label}</Option>))
              }
            </Select>
          </Form.Item>
        </Form>
        <Table
          loading={loading}
          columns={createColumns(selectedColumn)}
          dataSource={list}
          pagination={pagination}
          scroll={{ x: 2600, y: tableHeight }}
          rowKey={r => `${r.jobNumber}${r.nickName}`}
          onChange={(pagination) => { changePage(pagination.current); }}
        />
        <Separate size={20} />
        <Button
          type="primary"
          onClick={() => switchModule(UPLOAD_FILE_MODULE)}
        >重新上传</Button>
        <Separate isVertical={false} />
        <Button onClick={() => switchModule(COLUMNS_SELECT_MODULE)}>下一步</Button>
      </Fragment>
    );
  }
}

CheckTable.propTypes = {
  list: PropTypes.array, // 列表
  paginator: PropTypes.object, // 分页
  changePage: PropTypes.func, // 换页
  switchModule: PropTypes.func, // 切换模块
  selectedColumn: PropTypes.string, // 选择的实发工资
  changeColumn: PropTypes.func, // 修改实发工资
  loading: PropTypes.bool, // 是否加载
};

CheckTable.defaultProps = {
  list: [],
  paginator: {},
  changePage: () => {},
  switchModule: () => {},
  selectedColumn: '',
  changeColumn: () => {},
  loading: false,
};

export default CheckTable;
