import { PureComponent } from 'react';
import { connect } from 'dva';
import 'styles/components/salary/salaryManage/modifySalaryModal.less';
import { MODIFY_SALARY_CONFIG } from 'constants/components/salary/modifySalaryModal';

const { Modal, Form, Input } = window.antd;
const formLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 12 }
};
const commonRules = [
  { required: true, message: '必填项' }
];
const numberRules = [
  ...commonRules,
  {
    transform: (val) => Number(val || 0),
    type: 'number',
    pattern: /^\\d+(\\.\\d+)?$/,
    message: '请输入数字'
  }
];

class ModifySalaryModal extends PureComponent {
  hideModal = () => {
    this.props.dispatch({
      type: 'salaryManage/hideModal'
    });
  }

  submitSalary = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const values = this.props.form.getFieldsValue();
        this.props.dispatch({
          type: 'salaryManage/submitSalary',
          payload: values
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    // 修改的工资信息不同时，设置弹窗内的输入框值
    if (this.props.userSalary !== prevProps.userSalary) {
      const salarys = {};
      MODIFY_SALARY_CONFIG.forEach(i => {
        salarys[i.field] = this.props.userSalary[i.field];
      });
      this.props.form.setFieldsValue(salarys);
    }
  }

  render() {
    const { getFieldDecorator, } = this.props.form;
    const { showModal, userSalary} = this.props;
    const { nickName } = userSalary;

    return (
      <Modal
        title={`${nickName || ''} 工资|明细`}
        okText="保存"
        visible={showModal}
        width={520}
        onOk={this.submitSalary}
        onCancel={this.hideModal}
        className="modify-form"
      >
        <h6 className="tip">工资条属于敏感信息，请注意保密</h6>
        <Form hideRequiredMark className="form-warpper">
          {
            MODIFY_SALARY_CONFIG.map(i => {
              const isNumberType = (i.type === 'number');

              return (
                <Form.Item { ...formLayout } label={i.label}>
                  {getFieldDecorator(i.field, {
                    rules: isNumberType
                      ? numberRules
                      : commonRules,
                  })(<Input />)}
                </Form.Item>
              );
            })
          }
        </Form>
      </Modal>
    );
  }
}

export default connect(({ salaryManage }) => ({ ...salaryManage }))(Form.create()(ModifySalaryModal));
