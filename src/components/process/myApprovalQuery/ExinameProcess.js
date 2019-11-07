/*
 * @Description: 审批流程
 * @Author: moran 
 * @Date: 2019-09-11 15:15:53 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-10 17:23:28
 */

 import React from 'react';
 import { connect } from 'dva';
 import InfoBlock from 'components/businessCommon/InfoBlock';
 import 'styles/components/process/myApprovalQuery/exinameProcess.less';
 const { Input, Form, Button, message } = window.antd;
 const { TextArea } = Input;
 const FormItem = Form.Item;

 class ExinameProcess extends React.PureComponent {
   //  同意、驳回、否决
   handleNodeClick= (resultEnum) => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { approveDetailId, id, statusEnum } = this.props.approvalNodes;
          const { memo } = values;
          const payload = {
            resultEnum,
            memo,
            processApproveNodeInstanceDetailId: approveDetailId,
            id,
            statusEnum
          };
          if (resultEnum !== 'AGREED' && (!memo)) { // 同意，备注不是必填的。驳回和否认是必填的
            message.error('请输入原因');
          } else {
            this.props.dispatch({
              type: 'myApprovalQuery/processApprove',
              payload
            });
            this.props.close();
            this.props.form.resetFields(['memo']);
          }
        }
      });
   }
  
   render() {
    const {
      form,
      approvalNodes
    } = this.props;
    const { processNodeInstanceInfoList, approveDetailId } = approvalNodes;
    const { getFieldDecorator } = form;
     return (
       <div className="exiname-process-box">
         <InfoBlock configs={processNodeInstanceInfoList}/>
         {approveDetailId ? <div>
              <p className="ft-gray note-divide">备注</p>
              <Form>
                <FormItem label="" colon={false} style={{marginLeft: '31px'}}>
                  {getFieldDecorator('memo', {
                    // rules: [
                    //   { required: true, message: '请输入原因' }
                    // ]
                  })(
                  <TextArea
                    rows={3}
                    maxLength={1000}
                    placeholder="请输入原因，最多1000字" />
                  )}
                  
                </FormItem>
              </Form>
              <div className="btn-box">
                <Button
                  type="primary"
                  onClick={() => this.handleNodeClick('AGREED')}>
                  同意
                </Button>
                <Button
                  type="danger"
                  className="btn-rejected"
                  onClick={() => this.handleNodeClick('REJECT')}>
                  驳回
                </Button>
                <Button
                  type="danger"
                  className="btn-rejected"
                  onClick={() => this.handleNodeClick('VETOED')}>
                  否决
                </Button>
              </div>
          </div> : null}
         </div>
         
     );
   }
 }

 ExinameProcess.propTypes = {
  approvalNodes: PropTypes.object, // 审批流程数据源
  };

  ExinameProcess.defaultProps = {
    approvalNodes: {},
  };

export default connect (({ myApprovalQuery }) => ({ ...myApprovalQuery }))(Form.create()(ExinameProcess));
