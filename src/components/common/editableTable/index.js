/*
 * @Description: 可编辑表格
 * @Author: danding
 * @Date: 2019-05-15 19:26:55
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-16 19:12:10
 */

import React from 'react';
import EditableContext from 'components/common/editableTable/EditableContext';
import EditableCell from 'components/common/editableTable/EditableCell';
import 'styles/components/common/editableTable.less';

const { Form, Table, Button } = window.antd;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = this.props.customColumns;
    this.nodeRefs = {};
  }

  handleAdd = () => {
    this.props.handleAdd && this.props.handleAdd();
  }

  handleSave = row => {
    this.props.handleSave && this.props.handleSave(row);
  }

  isPassValid = () => {
    let isPassValid = true;
    const {
      dataSource,
      rowId, // 唯一主键名
      recordId, // 记录主键名（后端返回的主键）
    } = this.props;
    Object.keys(this.nodeRefs).forEach(i => {
      const itemRef = this.nodeRefs[i];
      if (itemRef) {
        const rowKey = i.slice(0, i.lastIndexOf("_"));
        const matchItem = dataSource.find(i => i[rowId] === rowKey);
        if (matchItem && matchItem[recordId]) {
          itemRef.validateFields((errors, values) => {
            if (errors) {
              isPassValid = false;
            }
          });
        }
      }
    });
    return isPassValid;
  }

  render() {
    const { title, dataSource, rowId, ...restProps } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      const { title, type, rules, componentProps, editable, dataIndex } = col;
      return {
        ...col,
        onCell: record => {
          return ({
            record,
            editable: editable,
            dataIndex: dataIndex,
            title: title,
            handleSave: this.handleSave,
            rules,
            componentProps,
            type,
            formRef: ref => {
              this.nodeRefs[`${record[rowId]}_${dataIndex}`] = ref;
            }
          });
        },
      };
    });
    return (
      <Table
        rowKey={r => r[rowId]}
        title={() => (
          <div className="clearfix table-title">
            <span className="pull-left">{title}</span>
            <Button
              size="small"
              className="pull-right add-btn"
              onClick={this.handleAdd}
            >添加</Button>
          </div>
        )}
        rowClassName={() => 'editable-row'}
        components={components}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        locale={{emptyText: '请添加数据'}}
        { ...restProps }
      />
    );
  }
}

export default EditableTable;
