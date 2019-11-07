/*
 * @Description: 流程-发起审批-添加人员
 * @Author: moran 
 * @Date: 2019-09-12 15:47:55 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-10 15:15:42
 */

 import React from 'react';
 const { Modal, Select, Form, message } = window.antd;
 const { Option } = Select;
 const FormItem = Form.Item;

 class AddPersonModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataValues: {} // 回填人员数据
    };
  }
  
  // 确定选择人员
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { selfSelectedNumber, processNodeConfigId } = this.props.configs;
        const dataValues = { ...this.state.dataValues, ...values };
        this.setState({ dataValues });
        if (dataValues[processNodeConfigId].length !== selfSelectedNumber) {
          message.error(`请选择${selfSelectedNumber}个自选人员`);
        } else {
          this.props.sumbit(values);
        }
      }
    });
  }
   render() {
     const { visible, form, configs } = this.props;
     const { dataValues } = this.state;
     const { optionDatas = {}, processNodeConfigId = 'field1' } = configs;
     const { getFieldDecorator } = form;
     return (
       <Modal
        title="选择人员"
        width={500}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.props.cancel}
       >
         <Form>
           <FormItem>
            {getFieldDecorator(processNodeConfigId, {
                initialValue: dataValues[processNodeConfigId],
                rules: [
                  { required: true, message: '请选择人员' }
                ]
              })(
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择"
                >
                  {
                    Object.keys(optionDatas).map(key => {
                      const values = {};
                      values[key] = optionDatas[key];
                      return (<Option key={key}>{optionDatas[key]}</Option>);
                    })
                  }
                </Select>
              )}
           </FormItem>
         </Form>
       </Modal>
     );
   }
 }

AddPersonModal.propTypes = {
  visible: PropTypes.bool, // 弹框展开
  configs: PropTypes.object // 选择人员数据
};
AddPersonModal.defaultProps = {
  configs: {},
};

export default Form.create()(AddPersonModal);
