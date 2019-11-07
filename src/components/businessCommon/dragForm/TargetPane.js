/*
 * @Description: 流程配置-目标容器
 * @Author: danding
 * @Date: 2019-09-05 16:09:05
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-17 19:19:25
 */

import React from 'react';
import  Sortable  from 'react-sortablejs';
import PureFormItem from 'components/businessCommon/dragForm/PureFormItem';
import Separate from 'components/common/Separate';
import * as dragFormConst from 'constants/components/businessCommon/dragForm';

const { Icon, Form } = window.antd;
const FormItem = Form.Item;

// 布局
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class TargetPane extends React.PureComponent {
  onSort = (order, sortable, evt) => {
    const { type } = evt;
    (type === 'update') && this.props.changeConfigs(evt.newIndex, evt.oldIndex);
  }

  render() {
    const { configs = [], selectedItem, removeItem, selectItem } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="target-form-wrapper">
        <Sortable
          className="target-items-wrapper"
          options={{
            group: { name: 'shared', pull: false }
          }}
          onChange={this.onSort}
        >
          {
            configs.map(i => (
              <div
                key={i.paramName}
                data-id={i.paramName}
                className={`target-item ${i.paramName === selectedItem.paramName ? 'actived' : ''}`}
                onClick={() => { selectItem(i); }}
              >
                {
                  i.paramName === selectedItem.paramName
                    ? <Icon
                        type="close"
                        className="remove-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(i);
                        }}
                      />
                    : null
                }
                <FormItem
                  label={<div className="custom-label">{i.props.label || ' '}</div>}
                  {...formItemLayout}
                  colon={false}
                  className={`${(i.type === dragFormConst.RADIO_COMPONENT_TYPE) || (i.type === dragFormConst.CHECKBOX_COMPONENT_TYPE)
                    || (i.type === dragFormConst.UPLOAD_IMG_COMPONENT_TYPE)
                    ? 'custom-target-component-wrapper'
                    : ''
                  }`}
                >
                  {
                    getFieldDecorator(i.paramName, {
                      rules: [{ required: i.props.required }]
                    })(
                      <PureFormItem { ...i } />
                    )
                  }
                </FormItem>
              </div>
            ))
          }
          {
            !configs.length && (
              <div>
                <Separate size={75} />
                <div className="no-target-data">拖动左侧表单，添加控件</div>
              </div>
            )
          }
        </Sortable>
      </Form>
    );
  }
}

export default Form.create()(TargetPane);
