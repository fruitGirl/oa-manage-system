/*
 * @Description: 系统-角色权限关联查询
 * @Author: qianqian
 * @Date: 2019-02-18 15:24:13
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 15:28:36
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
import 'styles/user/roleAuthorityLinkQuery.less';
const { Form, Select, Button, message, Icon, LocaleProvider, zh_CN } = window.antd;

const FormItem = Form.Item;
const Option = Select.Option;
const getTypeOption = (list) => {
  return list.map((i) => (
    <Option key={i.id} value={i.id}>
      {i.value}
    </Option>
  ));
};

// 变更类型
const getRoleIdOption = getTypeOption(CONFIG.roleList);

class roleAuthorityLinkQueryForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      loading: false,
      success: false,
      firstLoading: false,
      authoritySimpleList: [],
      deptIdAndDeptStrMap: {}
    };
  }
  // 进入页面要运行的函数
  componentDidMount() {}

  // 去空
  strTrim(str) {
    return str.replace(/\s/g, '');
  }

  //表单提交验证
  handleSubmit(e) {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (e) {
        e.preventDefault();
      }

      if (errors) {
        return;
      }

      const url = CONFIG.roleAuthorityLinkQueryJsonUrl;

      const params = {
        roleId: values['roleId']
      };

      // 提交按钮不可点
      this.setState({
        disabled: true,
        loading: true,
        firstLoading: true
      });

      T.post(url, params)
        .then((data) => {
          const authoritySimpleList = data.authoritySimpleList ? data.authoritySimpleList : [];
          const deptIdAndDeptStrMap = data.deptIdAndDeptStrMap ? data.deptIdAndDeptStrMap : {};

          // 提交按钮可点
          this.setState({
            disabled: false,
            loading: false,
            success: true,
            authoritySimpleList: authoritySimpleList,
            deptIdAndDeptStrMap: deptIdAndDeptStrMap
          });
        })
        .catch((data) => {
          // 提交按钮可点
          this.setState({
            disabled: false,
            loading: false,
            success: true,
            authoritySimpleList: [],
            deptIdAndDeptStrMap: {}
          });
          T.showError(data);
        });
    });
  }
  // 修改是否包含子部门
  modifyIncludeChildDept(e) {
    e.preventDefault();

    const btn = e.target;

    const params = this.getParams(btn);

    // console.log(params);
    this.getData({
      btn: btn,
      url: CONFIG.authorityModifyIncludeChildDeptUrl,
      params: params
    });
  }
  //是否把包含子部门设为无效
  modifyDisabled(e) {
    e.preventDefault();
    const btn = e.target;
    const params = this.getParams(btn);
    this.getData({
      btn: btn,
      url: CONFIG.authorityDeptLinkModifyDisabledUrl,
      params: params
    });
  }
  //操作 设为无效
  setDisabled(e) {
    e.preventDefault();
    const btn = e.target;
    let params = {
      roleAuthorityLinkId: btn.getAttribute('data-linkid')
    };

    this.getData({
      btn: btn,
      url: CONFIG.authoritySetDisabledUrl,
      params: params
    });
  }

  getParams(btn) {
    let params = {
      departmentId: btn.getAttribute('data-departmentid'),
      includeChildDept: btn.getAttribute('data-isincludechilddept'),
      roleAuthorityLinkId: btn.getAttribute('data-linkid')
    };

    return params;
  }

  getData(options) {
    // 按钮操作中
    options.btn.setAttribute('disabled', true);

    T.get(options['url'], options['params'])
      .then(() => {
        message.success('操作成功！');
        options.btn.removeAttribute('disabled');
        // 处理数据
        let authoritySimpleList = this.state.authoritySimpleList;
        let l = authoritySimpleList.length;
        // 包含 不包含按钮
        if (options.btn.getAttribute('data-isincludechilddept') !== null) {
          for (let i = 0; i < l; i++) {
            const item = authoritySimpleList[i];
            if (item.linkId === options.params.roleAuthorityLinkId) {
              const isincludechilddept = options.btn.getAttribute('data-isincludechilddept');

              if (isincludechilddept === 'true') {
                item['departmentIdAndIncludeChildDepartmentMap'][options.btn.getAttribute('data-departmentid')] = true;
              } else {
                item['departmentIdAndIncludeChildDepartmentMap'][options.btn.getAttribute('data-departmentid')] = false;
              }
              break;
            }
          }
        } else {
          //成功之后删除当前行
          for (let i = 0; i < l; i++) {
            const item = authoritySimpleList[i];
            if (item.linkId === options.params.roleAuthorityLinkId) {
              authoritySimpleList.splice(i, 1);
              break;
            }
          }
        }
        // 更新数据
        this.setState({
          authoritySimpleList: authoritySimpleList
        });
      })
      .catch((data) => {
        options.btn.removeAttribute('disabled');
        message.error(T.getError(data));
      });
  }

  // 是否包含子项
  createButton(map, key, i) {
    if (CONFIG.hasRoleAuthorityLinkManage === 'true') {
      if (!map[key]) {
        return (
          <span>
            否&nbsp;
            <button
              className="ant-btn"
              type="button"
              data-linkid={i.linkId}
              data-departmentid={key}
              data-isincludechilddept="true"
              onClick={(e) => this.modifyIncludeChildDept(e)}
            >
              包含
            </button>
            &nbsp;
            <button
              className="ant-btn"
              type="button"
              data-linkid={i.linkId}
              data-departmentid={key}
              onClick={(e) => this.modifyDisabled(e)}
            >
              设为无效
            </button>
          </span>
        );
      } else {
        return (
          <span>
            是&nbsp;
            <button
              className="ant-btn"
              type="button"
              data-linkid={i.linkId}
              data-departmentid={key}
              data-isincludechilddept="false"
              onClick={(e) => this.modifyIncludeChildDept(e)}
            >
              不包含
            </button>
            &nbsp;
            <button
              className="ant-btn"
              type="button"
              data-linkid={i.linkId}
              data-departmentid={key}
              onClick={(e) => this.modifyDisabled(e)}
            >
              设为无效
            </button>
          </span>
        );
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { disabled, loading, success, firstLoading, authoritySimpleList, deptIdAndDeptStrMap } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 2 }
      }
    };

    return (
      <Form
        name="roleAuthorityLinkQueryForm"
        method="post"
        id="roleAuthorityLinkQueryForm"
        noValidate="novalidate"
        onSubmit={(e) => this.handleSubmit(e)}
        className="bg-white antd_form_horizontal"
      >
        <FormItem {...formItemLayout} label="角色名" key="roleId" colon={false}>
          {getFieldDecorator('roleId', {
            rules: [{ required: true, message: '请选择角色名' }]
          })(
            <Select
              className="input_width"
              placeholder="请选择"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {getRoleIdOption}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayoutWithOutLabel} style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" className="oa-btn" disabled={disabled}>
            查询
          </Button>
        </FormItem>
        <div className={firstLoading ? 'ant-table' : 'ant-table hide'}>
          <h3 className="result-title">查询结果</h3>
          <table className="table" style={{ width: '100%' }}>
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <thead className="ant-table-thead">
              <tr>
                <th>权限id</th>
                <th>关联id</th>
                <th>作用域</th>
                <th>权限代码</th>
                <th>权限名称</th>
                <th>可操作部门</th>
                <th>是否包含子部门</th>
                {CONFIG.hasRoleAuthorityLinkManage === 'true' ? <th>操作</th> : ''}
              </tr>
            </thead>
            <tbody className={loading ? 'loading-table' : 'loading-table hide'}>
              <tr>
                <td colSpan={0} />
                <td colSpan={0} />
                <td colSpan={0} />
                <td colSpan={0} />
                <td>
                  <Icon type="loading" spin={true} />
                  加载中...
                </td>
                <td colSpan={0} />
                <td colSpan={0} />
                <td colSpan={0} />
              </tr>
            </tbody>
            <tbody className={!loading && success ? 'ant-table-tbody' : 'ant-table-tbody hide'}>
              {authoritySimpleList.length > 0 ? (
                authoritySimpleList.map((i, index) => {
                  const map = i.departmentIdAndIncludeChildDepartmentMap;
                  const mapKeyArr = Object.keys(map);
                  const mapSize = mapKeyArr.length;

                  if (mapSize === 0) {
                    return (
                      <tr key={`${index}_a`}>
                        <td>{i.id}</td>
                        <td>{i.linkId}</td>
                        <td>{i.domain}</td>
                        <td>{i.authorityCode}</td>
                        <td>{i.authorityName}</td>
                        <td />
                        <td />
                        <td>
                          <button
                            className="ant-btn"
                            type="button"
                            data-linkid={i.linkId}
                            onClick={(e) => this.setDisabled(e)}
                          >
                            设为无效
                          </button>
                        </td>
                      </tr>
                    );
                  } else {
                    let count = 0;
                    return mapKeyArr.map((key, index) => {
                      count++;
                      if (count === 1) {
                        return (
                          <tr key={`${index}_b`}>
                            <td rowSpan={mapSize}>{i.id}</td>
                            <td rowSpan={mapSize}>{i.linkId}</td>
                            <td rowSpan={mapSize}>{i.domain}</td>
                            <td rowSpan={mapSize}>{i.authorityCode}</td>
                            <td rowSpan={mapSize}>{i.authorityName}</td>
                            <td>{deptIdAndDeptStrMap[key]}</td>
                            <td>{this.createButton(map, key, i)}</td>
                            <td rowSpan={mapSize}>
                              {CONFIG.hasRoleAuthorityLinkManage === 'true' ? (
                                <button
                                  className="ant-btn"
                                  type="button"
                                  data-linkid={i.linkId}
                                  onClick={(e) => this.setDisabled(e)}
                                >
                                  设为无效
                                </button>
                              ) : (
                                ''
                              )}
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={`${index}_c`}>
                            <td>{deptIdAndDeptStrMap[key]}</td>
                            <td>{this.createButton(map, key, i)}</td>
                          </tr>
                        );
                      }
                    });
                  }
                })
              ) : (
                <tr>
                  <td colSpan={0} />
                  <td colSpan={0} />
                  <td colSpan={0} />
                  <td colSpan={0} />
                  <td>
                    <div>暂无数据</div>
                  </td>
                  <td colSpan={0} />
                  <td colSpan={0} />
                  <td colSpan={0} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Form>
    );
  }
}

const WrappedroleAuthorityLinkQueryForm = Form.create()(roleAuthorityLinkQueryForm);
const mountNode = document.getElementById('root');

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <BasicLayout>
      <WrappedroleAuthorityLinkQueryForm />
    </BasicLayout>
  </LocaleProvider>,
  mountNode
);
