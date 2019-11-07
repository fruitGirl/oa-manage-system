/*
 * @Description: 工资条发放-工资可见列配置
 * @Author: danding
 * @Date: 2019-03-28 10:42:26
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-08 14:30:11
 */

import { PureComponent, Fragment, } from 'react';
import PropTypes from 'prop-types';
import 'styles/components/common/salaryColumnsSelect.less';
import Separate from 'components/common/Separate';
import { SALARY_SEND_CONFIGS, } from 'constants/components/common/salarySend';

const { Form, Input, Checkbox, Row, Col, } = window.antd;
const CheckboxGroup = Checkbox.Group;
const ALL_VALS = SALARY_SEND_CONFIGS.map(i => i.value);

class SalarColumnsSelect extends PureComponent {
  constructor(props) {
    super(props);
    const defaultCheckList = props.defaultCheckList || ALL_VALS; // 默认的选择配置
    this.state = {
      checkedList: defaultCheckList, // 选中的配置项
      checkAll: defaultCheckList.length === SALARY_SEND_CONFIGS.length, // 是否选择全部
    };
  }

  onChange = (checkedList) => {
    this.setState({
      checkedList,
      checkAll: checkedList.length === SALARY_SEND_CONFIGS.length,
    });
  }

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? ALL_VALS : [],
      checkAll: e.target.checked,
    });
  }

  // public method
  getColumns() {
    return this.state.checkedList;
  }

  render() {
    const { selectedColumn, visibleSelectedColumn = true, } = this.props;
    const matched = SALARY_SEND_CONFIGS.find(i => i.value === selectedColumn);
    const selectedColumnName = matched ? matched.label : ''; // 选择的实发工资名称

    return (
      <div className="salary-column-select">
         <h5>工资条发放</h5>
         <Separate size={6} />
         <h6 className="module-title">薪资项显示设置</h6>
         { visibleSelectedColumn
          ? <Form className="column-form-wrapper">
              <Form.Item
                label={(
                  <Fragment>
                    <span className="tip-icon">*</span>
                    <span>实发工资</span>
                  </Fragment>
                )}
                labelCol= {{ span: 8 }}
                wrapperCol= {{ span: 16 }}
                rules={[{required: true}]}
              >
                <Input value={selectedColumnName} disabled />
              </Form.Item>
            </Form>
          : null
        }
        <div className="checkbox-wrapper">
          <Checkbox
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
          <Separate size={18} />
          <CheckboxGroup value={this.state.checkedList} onChange={this.onChange}>
            <Row>
              {
                SALARY_SEND_CONFIGS.map(i => (
                  <Col className="item-wrapper" lg={5} xl={4} xxl={3}>
                    <Checkbox value={i.value}>{i.label}</Checkbox>
                  </Col>
                ))
              }
            </Row>
          </CheckboxGroup>
        </div>
      </div>
    );
  }
}

SalarColumnsSelect.propTypes = {
  selectedColumn: PropTypes.String, // 选择的实发工资字段
  visibleSelectedColumn: PropTypes.bool, // 是否可见实发工资字段
};

SalarColumnsSelect.defaultProps = {
  selectedColumn: '',
  visibleSelectedColumn: false
};

export default SalarColumnsSelect;
