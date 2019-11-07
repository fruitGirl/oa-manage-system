const { Modal, Form, Input, Icon } = window.antd;
const FormItem = Form.Item;
let uuid = 0;
class ReportTypeMaintainModal extends React.Component {

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter((key) => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys
    });
    setTimeout(() => {
      document.getElementsByClassName('scrollDom')[0].scrollTop = document.getElementsByClassName(
        'scrollDom'
      )[0].scrollHeight;
    }, 100);
  };
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      reportModalVisible,
      handleModalCancel,
      handleReportModalOk,
      reportModalType,
      deleteInput,
      noBtn,
      tableNumData
    } = this.props;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    let reportTypeOption;
    if (reportModalType === 'positionQuery') {
      reportTypeOption = CONFIG.jobPositionTypeId.map((item) => {
        const listItem = (
          <FormItem key={item} className="formLable delete_formItem" colon={false}>
            {getFieldDecorator(`${item}`, {
              initialValue: CONFIG.jobPositionTypeName[item]
            })(
              <div>
                <Input value={CONFIG.jobPositionTypeName[item]} type="text" className="modal_input" disabled />
                <Icon type="delete" onClick={() => deleteInput(item)} />
              </div>
            )}
          </FormItem>
        );
        return listItem;
      });
    } else {
      if (noBtn && tableNumData) {
        reportTypeOption = tableNumData.map((item) => {
          const listItem = (
            <FormItem key={item.userId} className="formLable delete_formItem" colon={false}>
              {getFieldDecorator(`${item.userId}`, {
                initialValue: item.userId
              })(
                <div>
                  <Input type="text" value={item.nickName} className="modal_input" disabled />
                  <Icon type="delete" onClick={() => deleteInput(item.userId)} />
                </div>
              )}
            </FormItem>
          );
          return listItem;
        });
      } else {
        reportTypeOption = CONFIG.jobPositionId.map((item) => {
          const listItem = (
            <FormItem key={item} className="formLable delete_formItem" colon={false}>
              {getFieldDecorator(`${item}`, {
                initialValue: CONFIG.jobPositionName[item]
              })(
                <div>
                  <Input value={CONFIG.jobPositionName[item]} type="text" className="modal_input" disabled />
                  <Icon type="delete" onClick={() => deleteInput(item)} />
                </div>
              )}
            </FormItem>
          );
          return listItem;
        });
      }
    }

    const formItems = keys.map((k, index) => {
      return (
        <FormItem required={false} key={k} className="formLable delete_formItem">
          {getFieldDecorator(`names_${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请填写职位类型'
              }
            ]
          })(
            <Input
              placeholder={reportModalType === 'positionQuery' ? '请输入职位种类' : '请输入角色种类'}
              className="modal_input"
            />
          )}
          <Icon className="dynamic-delete-button delete" type="delete" onClick={() => this.remove(k)} />
        </FormItem>
      );
    });
    return (
      <Modal
        visible={reportModalVisible}
        title={
          reportModalType === 'positionQuery'
            ? '职位种类维护'
            : reportModalType === 'staff'
            ? '使用员工维护'
            : '角色种类维护'
        }
        okText={noBtn ? null : '创建'}
        onCancel={handleModalCancel}
        onOk={() => handleReportModalOk(this.props.form.getFieldValue('keys'))}
        width={410}
      >
        <Form className="antd_form_horizontal creat_from_modify">
          <div className="scrollDom">
            {reportTypeOption}
            {noBtn ? null : formItems}
          </div>
          <FormItem />
          {noBtn ? null : (
            <div className="add_box" onClick={this.add}>
              <i className="anticon anticon-plus" />
              增加
            </div>
          )}
        </Form>
      </Modal>
    );
  }
}
export default ReportTypeMaintainModal;
