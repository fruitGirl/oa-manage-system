import TreeSelectComptent from 'components/businessCommon/TreeSelectComptent';
const { Modal, Form, Select, Checkbox } = window.antd;
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

class PowerGroup extends React.Component {
  state = {
    checkedList: this.props.checkedArray,
    indeterminate: !!this.props.checkedArray.length && this.props.checkedArray.length < this.props.item.children.length,
    checkAll: this.props.checkedArray.length === this.props.item.children.length && this.props.item.children.length
  };

  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this.props.item.children.length,
      checkAll: checkedList.length === this.props.item.children.length && this.props.item.children.length
    });
  };

  onCheckAllChange = (e) => {
    let list = this.props.item.children;
    let array = [];
    list.forEach((item) => {
      array.push(item.id);
    });
    this.setState({
      checkedList: e.target.checked ? array : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      checkedList: nextProps.checkedArray,
      indeterminate: !!nextProps.checkedArray.length && nextProps.checkedArray.length < nextProps.item.children.length,
      checkAll: nextProps.checkedArray.length === nextProps.item.children.length && nextProps.item.children.length
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let item = this.props.item;
    let powerChildrenList = item.children;

    getFieldDecorator(`authorityIds-${this.props.index}`, { initialValue: this.state.checkedList });
    return (
      <div
        key={item.id}
        style={{
          borderTop: '1px solid #E9E9E9',
          padding: '10px 0'
        }}
      >
        <div>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
            style={{
              fontWeight: 'bold'
            }}
          >
            {item.label}
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup
          style={{
            width: '100%'
          }}
          value={this.state.checkedList}
          onChange={this.onChange}
        >
          {powerChildrenList.map((it) => {
            return (
              <Checkbox
                value={it.id}
                key={it.id}
                style={{
                  marginLeft: '20px',
                  marginBottom: '5px'
                }}
              >
                {it.authorityName}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      </div>
    );
  }
}

//创建权限组件
const GrantRoleAuthorityModal = Form.create()((props) => {
  const {
    authorityVisible,
    handleModalCancel,
    handldGrantAuthorityModalOk,
    form,
    currentItem,
    authorityData,
    checkedList,
    backFillSelectChange,
    domainVal,
    roleQuery,
    dispatch,
    btnLoading,
    handleDomainChange
  } = props;
  const { getFieldDecorator } = form;
  let roleNameOption = '';
  let domainConfigOption = '';
  let domainConfigItem;
  let powerParentGroupTotal = [];
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 }
  };
  if (authorityData) {
    const domainConfigList = authorityData['domainConfigList']; //作用域
    const roleList = authorityData['roleList']; //授权角色
    const authorityTypeCodeAndNameMap = authorityData['authorityTypeCodeAndNameMap']; //权限对应的一级菜单
    const authorityTypeCodeAndAuthoritysMap = authorityData['authorityTypeCodeAndAuthoritysMap']; //权限对应的二级菜单、
    //作用域的下拉框
    domainConfigItem = domainConfigList.map((item) => {
      const domainConfigData = {
        name: item.name,
        message: item.message
      };
      return domainConfigData;
    });
    //授权角色的下拉框
    roleNameOption = roleList.map((item) => {
      return (
        <Option value={item.id} key={item.id}>
          {item.roleName}
        </Option>
      );
    });
    domainConfigOption = domainConfigItem.map((item, index) => {
      return (
        <Option value={item.name} key={index}>
          {item.message}
        </Option>
      );
    });

    //权限
    //循环一级的权限菜单
    for (var key in authorityTypeCodeAndNameMap) {
      //得到权限列表关系数组
      powerParentGroupTotal.push({
        label: authorityTypeCodeAndNameMap[key],
        children: authorityTypeCodeAndAuthoritysMap[key]
      });
    }
  }

  const treeSelectComptentConfig = {
    dispatch: dispatch,
    pageData: roleQuery,
    nameSpace: 'roleQuery',
    backFillSelectChange
  };
  return (
    <Modal
      visible={authorityVisible}
      title="设置权限"
      okText="创建"
      onCancel={handleModalCancel}
      onOk={handldGrantAuthorityModalOk}
      confirmLoading={btnLoading}
      className="role-modal"
    >
      <Form className="antd_form_horizontal creat_from_modify">
        <FormItem {...formItemLayout} label="授权角色" key="roleId" className="formLable" colon={false}>
          {getFieldDecorator('roleId', {
            initialValue: currentItem.id,
            rules: [{ required: true, message: '请选择授权角色' }]
          })(
            <Select style={{ width: '202px' }} onChange={(value) => backFillSelectChange(value, 'roleId')}>
              {roleNameOption}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="作用域" key="domain" className="formLable" colon={false}>
          {getFieldDecorator('domain', {
            initialValue: domainConfigItem ? domainConfigItem[0]['name'] : '',
            rules: [{ required: true, message: '请选择作用域' }]
          })(
            <Select style={{ width: '202px' }} onChange={(value) => handleDomainChange(value)}>
              {domainConfigOption}
            </Select>
          )}
        </FormItem>
        {domainVal === 'OA' ? (
          <div>
            <FormItem {...formItemLayout} label="可操作部门" key="departmentId" colon={false} className="formLable">
              {getFieldDecorator('departmentId', {})(<TreeSelectComptent {...treeSelectComptentConfig} />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="是否包含子部门"
              key="isIncludeChildDept"
              colon={false}
              className="formLable"
            >
              {getFieldDecorator('isIncludeChildDept', {
                initialValue: 'false'
              })(
                <Select
                  style={{ width: '202px' }}
                  onChange={(value) => backFillSelectChange(value, 'isIncludeChildDept')}
                >
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              )}
            </FormItem>
          </div>
        ) : (
          ''
        )}
        <div style={{ paddingLeft: '26px', paddingTop: '10px' }}>权限</div>
        <div className="check-box">
          {powerParentGroupTotal.map((item, index) => {
            let checkedArray = [];
            item.children.forEach((it) => {
              if (checkedList.indexOf(it.id) !== -1) {
                checkedArray.push(it.id);
              }
            });
            return <PowerGroup item={item} index={index} checkedArray={checkedArray} key={item.label} form={form} />;
          })}
        </div>
      </Form>
    </Modal>
  );
});

export default GrantRoleAuthorityModal;
