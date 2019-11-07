/*
 * @Description: 系统-组织架构管理
 * @Author: qianqian
 * @Date: 2019-02-15 19:08:50
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 17:57:55
 */
import React from 'react';
import dva, { connect } from 'dva';
import BasicLayout from 'layouts/BasicLayout';
import EditDepaModal from 'components/businessCommon/EditDepaModal';
import 'styles/user/organizationStructureQuery.less';
import organizationStructureQuery from 'models/user/organizationStructureQuery';
import { ADD_TOP_DEPA, ADD_CHILD_DEPA, ADD_MODE, EDIT_MODE, } from 'constants/components/common/editDepaModal';
import Separate from 'components/common/Separate';

const { Button, Modal, Tree, LocaleProvider, zh_CN, Form, Input, message, Icon } = window.antd;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

//给树节点增加hasChild属性，使之可展开
const renderChildStatus = (data, id, hasChild) => {
  let list = data;
  list.forEach((item) => {
    if (item.id === id) {
      item.hasChild = hasChild;
    } else {
      if (item.children) {
        renderChildStatus(item.children, id, hasChild);
      }
    }
  });
  return list;
};
//当树节点有children时，再给该节点添加子节点可由前端自己填入
const addChildIfHasChildren = (data, parentId, values) => {
  let list = data;
  list.forEach((item) => {
    if (item.id === parentId && item.children) {
      item.children.push(values);
    } else {
      if (item.children) {
        addChildIfHasChildren(item.children, parentId, values);
      }
    }
  });
  return list;
};
//循环节点，找到要删除的节点 删除
const loopDeleteList = (data, id) => {
  let list = data;
  list.forEach((item, index) => {
    if (item.id === id) {
      list.splice(index, 1);
    } else {
      if (item.children) {
        loopDeleteList(item.children, id);
      }
    }
  });

  return list;
};
//循环节点，找到要编辑的节点 编辑
const loopEditList = (data, id, values) => {
  let list = data;
  list.forEach((item) => {
    if (item.id === id) {
      Object.assign(item, values);
    } else {
      if (item.children) {
        loopEditList(item.children, id, values);
      }
    }
  });
  return list;
};
const AddCompanyModal = Form.create()((props) => {
  const { getFieldDecorator } = props.form;
  const { visible, cancel, submit, loading, title, okText } = props;
  const formlayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
  };
  return (
    <Modal title={title} visible={visible} onCancel={cancel} onOk={submit} okText={okText} confirmLoading={loading}>
      <Form hideRequiredMark={true}>
        <FormItem label="简称" {...formlayout}>
          {getFieldDecorator('shortName', {
            rules: [{ required: true, message: '请输入公司简称!' }]
          })(<Input maxLength={20} />)}
        </FormItem>
        <FormItem label="全称" {...formlayout}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入公司全称!' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="地址" {...formlayout}>
          {getFieldDecorator('address')(<Input />)}
        </FormItem>
        <FormItem label="联系人" {...formlayout}>
          {getFieldDecorator('contacter')(<Input />)}
        </FormItem>
        <FormItem label="电话" {...formlayout}>
          {getFieldDecorator('cell')(<Input />)}
        </FormItem>
        <FormItem label="官网" {...formlayout}>
          {getFieldDecorator('companyUrl')(<Input />)}
        </FormItem>
      </Form>
    </Modal>
  );
});
const SetCompanyModal = Form.create()((props) => {
  const { getFieldDecorator } = props.form;
  const {
    visible,
    cancel,
    submit,
    editLoading,
    list,
    addChildCompany,
    deleteCompany,
    editChildCompany,
    deleteChildCompany
  } = props;
  const formlayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
  };
  return (
    <Modal title="编辑公司" visible={visible} onCancel={cancel} footer={false} className="edit-company-modal">
      <span className="title">基本信息</span>
      <Form hideRequiredMark={true}>
        <FormItem label="简称" {...formlayout}>
          {getFieldDecorator('shortName', {
            rules: [{ required: true, message: '请输入公司简称!' }]
          })(<Input maxLength={20} />)}
        </FormItem>
        <FormItem label="全称" {...formlayout}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入公司全称!' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="地址" {...formlayout}>
          {getFieldDecorator('address', {})(<Input />)}
        </FormItem>
        <FormItem label="联系人" {...formlayout}>
          {getFieldDecorator('contacter', {})(<Input />)}
        </FormItem>
        <FormItem label="电话" {...formlayout}>
          {getFieldDecorator('cell', {})(<Input />)}
        </FormItem>
        <FormItem label="官网" {...formlayout}>
          {getFieldDecorator('companyUrl', {})(<Input />)}
        </FormItem>
      </Form>
      <div className="title">
        <span>子公司维护</span>
        <a className="add-btn" onClick={addChildCompany}>
          添加子公司
        </a>
      </div>
      <ul className="company-list">
        {list.length ? (
          list.map((item) => {
            return (
              <li key={item.id} className="list-li">
                <span className="text">{item.shortName}</span>
                <a className="edit-btn" onClick={() => editChildCompany(item.id)}>
                  编辑
                </a>
                <Icon type="delete" onClick={() => deleteChildCompany(item.id)} />
              </li>
            );
          })
        ) : (
          <div className="no-data">暂无数据</div>
        )}
      </ul>

      <div className="footer">
        <Button className="footer-btn" type="primary" loading={editLoading} onClick={submit}>
          保存
        </Button>
        <Button className="footer-btn" type="danger" onClick={deleteCompany}>
          删除公司
        </Button>
        <Button className="footer-btn" onClick={cancel}>
          取消
        </Button>
      </div>
    </Modal>
  );
});

class App extends React.Component {
  state = {
    treeData: [],
    addCompanyModalVisible: false, //添加公司
    addCompanyLoading: false, //添加公司时弹框按钮loding
    showCompanySetVisible: false, //是否显示中间部门列表，公司设置
    setCompanyModalVisible: false, //设置公司的弹框显示
    childCompanyData: [], //点击左侧公司得到的子公司列表
    departmentTreeData: [], //点击左侧公司得到的部门列表
    currentCompanyInfo: null, //点击左侧公司得到的该公司详情
    childCompanyModalVisible: false, //添加子公司，编辑子公司的弹框显示
    childCompanyModalLoading: false,
    currentChildCompanyInfo: null, //当前编辑的子公司信息
    isEditChild: false, //是否是编辑子公司
    addDepartmentShow: false, //添加部门输入框显示
    addDepartmentLoading: false,
    showDepartmentMaintain: false, //是否显示部门维护区域
    currentDepartmentInfo: null, //当前点击的部门信息
    currentDepartmentInputValue: null, //当前部门信息的input输入框值
    childDepartmentInputIdAndNameMap: null, //子部门id和name的对象，id为key，用来更新循环出来的受控input组件的value
    childDepartmentData: [], //子部门数据列表
    addChildDepartmentShow: false, //添加子部门按钮显示
    addChildDepartmentLoading: false,
    // companyExpandedKeys: [],
    // departmentExpandedKeys: [],
    idAndManagerNameMap: {}, // 负责人集合对象
    showDepartmentModule: false, // 显示部门列表
  };
  onLoadData = (treeNode, treeType) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      let url;
      if (treeType === 'company') {
        url = CONFIG.option.getDirectChildCompanyUrl;
      } else if (treeType === 'department') {
        url = CONFIG.option.childDepartmentUrl;
      }
      T.get(url, {
        id: treeNode.props.dataRef.id
      })
        .then((data) => {
          if (treeType === 'company') {
            treeNode.props.dataRef.children = data.companyList;
            this.setState({
              treeData: this.state.treeData
            });
          } else {
            treeNode.props.dataRef.children = data.dateList;
            this.setState({
              departmentTreeData: this.state.departmentTreeData
            });
          }

          resolve();
        })
        .catch((data) => {
          T.showError(data);
        });
    });
  };
  renderTreeNodes(data, type) {
    if (data) {
      return data.map((item) => {
        let name = type === 'company' ? item.shortName : item.departmentName;
        if (item.hasChild) {
          return (
            <TreeNode title={name} key={item.id} dataRef={item}>
              {this.renderTreeNodes(item.children, type)}
            </TreeNode>
          );
        }
        return <TreeNode title={name} key={item.id} dataRef={item} isLeaf={true} />;
      });
    }
  }
  getCompanyTreeRootData() {
    T.get(CONFIG.option.getRootCompanyUrl)
      .then((data) => {
        this.setState({
          treeData: data.companyList
        });
      })
      .catch((data) => {
        T.showError(data);
      });
  }
  onTreeSelect = (selectedKey, e, type) => {

    let key = selectedKey.join(',');
    if (type === 'company') {
      if (key) {
        this.fetchCompanyInfo(key);
        this.fetchRootDepartment(key);
      } else {
        this.setState({
          showCompanySetVisible: false,
          showDepartmentMaintain: false
        });
      }

      // 解决部门展开问题
      this.setState({
        showDepartmentModule: false
      }, () => {
        setTimeout(() => {
          this.setState({
            showDepartmentModule: true
          });
        }, 350);
      });

    } else {

      if (key) {
        this.fetchDepartmentInfo(key);
      } else {
        this.setState({
          showDepartmentMaintain: false
        });
      }

    }
  };
  // onCompanyExpand = (expandedKeys, { expanded, node }) => {

  //   //展开节点完全改为由自己来控制，通过修改expandedKeys来展开收起节点

  //   if (expanded) {
  //     this.setState({
  //       companyExpandedKeys: [...new Set([...this.state.companyExpandedKeys, ...expandedKeys])]
  //     });
  //   } else {
  //     let list = this.state.companyExpandedKeys;
  //     list.forEach((item, index) => {
  //       if (item === node.props.eventKey) {
  //         list.splice(index, 1);
  //       }
  //     });
  //     this.setState({
  //       companyExpandedKeys: [...list]
  //     });
  //   }
  // }
  // onDepartmentExpand = (expandedKeys, { expanded, node }) => {

  //   //展开节点完全改为由自己来控制，通过修改expandedKeys来展开收起节点

  //   if (expanded) {
  //     this.setState({
  //       departmentExpandedKeys: [...new Set([...this.state.departmentExpandedKeys, ...expandedKeys])]
  //     });
  //   } else {
  //     let list = this.state.departmentExpandedKeys;
  //     list.forEach((item, index) => {
  //       if (item === node.props.eventKey) {
  //         list.splice(index, 1);
  //       }
  //     });
  //     this.setState({
  //       departmentExpandedKeys: [...list]
  //     });
  //   }
  // }
  showAddCompanyModal = () => {
    this.setState({
      addCompanyModalVisible: true
    });
    //清空表格
    if (this.addCompanyForm) {
      this.resetCompanyModal(this.addCompanyForm);
    }
  };
  addCompanyCancel = () => {
    this.setState({
      addCompanyModalVisible: false
    });
  };
  showSetCompanyModal = () => {
    this.setState({
      setCompanyModalVisible: true
    });
    //回填设置里的公司
    this.backFillCompanyInfo(this.setCompanyForm, this.state.currentCompanyInfo);
  };
  setCompanyCancel = () => {
    this.setState({
      setCompanyModalVisible: false
    });
  };
  saveAddCompanyFormRef = (form) => {
    this.addCompanyForm = form;
  };
  savesetCompanyFormRef = (form) => {
    this.setCompanyForm = form;
  };
  addCompanySubmit = () => {
    this.addCompanyForm.validateFields((err, values) => {
      if (!err) {
        let _data = {
          ...values,
          ...{
            parentId: 0
          }
        };
        this.setState({
          addCompanyLoading: true
        });
        T.get(CONFIG.option.companyCreateUrl, _data)
          .then((data) => {
            this.setState({
              treeData: [
                {
                  id: data.id,
                  shortName: data.shortName
                },
                ...this.state.treeData,
              ],
              addCompanyModalVisible: false
            });
            message.success('添加成功');

            this.setState({
              addCompanyLoading: false
            });
          })
          .catch((data) => {
            this.setState({
              addCompanyLoading: false
            });
            T.showError(data);
          });
      }
    });
  };
  fetchRootDepartment(id) {
    T.get(CONFIG.option.getRootDepartmentUrl, {
      id
    })
      .then((data) => {
        this.setState({
          departmentTreeData: data.dateList
        });
      })
      .catch((data) => {
        T.showError(data);
      });
  }
  fetchCompanyInfo(id) {
    T.get(CONFIG.option.getCompanyAndChildCompanyUrl, {
      id
    })
      .then((data) => {
        this.setState({
          childCompanyData: data.companyList,
          currentCompanyInfo: data.company,
          showCompanySetVisible: true,
          showDepartmentMaintain: false //隐藏最右边的
        });
      })
      .catch((data) => {
        T.showError(data);
      });
  }
  //回填设置的弹框里的公司信息
  backFillCompanyInfo(form, info) {
    form.setFieldsValue({ shortName: info.shortName });
    form.setFieldsValue({ name: info.name });
    form.setFieldsValue({ address: info.address });
    form.setFieldsValue({ contacter: info.contacter });
    form.setFieldsValue({ cell: info.cell });
    form.setFieldsValue({ companyUrl: info.companyUrl });
  }
  //清空公司弹框里的信息
  resetCompanyModal(form) {
    form.resetFields();
  }
  setCompanyModalSubmit = () => {
    this.setCompanyForm.validateFields((err, values) => {
      if (!err) {
        let _data = {
          ...values,
          ...{
            id: this.state.currentCompanyInfo.id
          }
        };
        this.setState({
          setCompanyEditLoading: true
        });
        T.post(CONFIG.option.companyModify, _data)
          .then((data) => {
            let list = this.state.treeData;

            list.forEach((item) => {
              if (item.id === _data.id) {
                //找到当前编辑的这个公司
                Object.assign(item, values);
              }
            });

            this.setState({
              treeData: list,
              setCompanyModalVisible: false
            });
            message.success('编辑成功');

            this.setState({
              setCompanyEditLoading: false
            });
          })
          .catch((data) => {
            T.showError(data);
            this.setState({
              setCompanyEditLoading: false
            });
          });
      }
    });
  };
  setCompanyDelete = () => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      onOk: () => {
        T.get(CONFIG.option.companyDelete, {
          id: this.state.currentCompanyInfo.id
        })
          .then((data) => {
            let list = loopDeleteList(this.state.treeData, this.state.currentCompanyInfo.id);

            message.success('删除成功');
            this.setState({
              treeData: list,
              setCompanyModalVisible: false,
              showCompanySetVisible: false
            });
          })
          .catch((data) => {
            T.showError(data);
          });
      }
    });
  };
  saveChildCompanyFormRef = (form) => {
    this.childCompanyForm = form;
  };
  childCompanyModalCreate = () => {
    this.childCompanyForm.validateFields((err, values) => {
      if (!err) {
        let _data = {
          ...values,
          ...{
            parentId: this.state.currentCompanyInfo.id
          }
        };
        this.setState({
          childCompanyModalLoading: true
        });
        T.get(CONFIG.option.companyCreateUrl, _data)
          .then((data) => {
            let list = renderChildStatus(this.state.treeData, this.state.currentCompanyInfo.id, true);
            let addChildList = addChildIfHasChildren(list, this.state.currentCompanyInfo.id, {
              id: data.id,
              shortName: data.shortName
            });
            this.setState({
              childCompanyData: [
                ...this.state.childCompanyData,
                {
                  id: data.id,
                  shortName: data.shortName
                }
              ],
              childCompanyModalVisible: false,
              treeData: addChildList
            });
            message.success('添加成功');

            this.setState({
              childCompanyModalLoading: false
            });
          })
          .catch((data) => {
            T.showError(data);
            this.setState({
              childCompanyModalLoading: false
            });
          });
      }
    });
  };
  childCompanyModalModify = () => {
    this.childCompanyForm.validateFields((err, values) => {
      if (!err) {
        let _data = {
          ...values,
          ...{
            id: this.state.currentChildCompanyInfo.id
          }
        };
        this.setState({
          childCompanyModalLoading: true
        });
        T.post(CONFIG.option.companyModify, _data)
          .then((data) => {
            let list = loopEditList(this.state.childCompanyData, this.state.currentChildCompanyInfo.id, values);
            let parentList = loopEditList(this.state.treeData, this.state.currentChildCompanyInfo.id, values);

            this.setState({
              childCompanyData: list,
              treeData: parentList,
              childCompanyModalVisible: false
            });
            message.success('编辑成功');

            this.setState({
              childCompanyModalLoading: false
            });
          })
          .catch((data) => {
            T.showError(data);
          });
      }
    });
  };
  addChildCompany = () => {
    this.setState({
      childCompanyModalVisible: true,
      isEditChild: false
    });
    this.resetCompanyModal(this.childCompanyForm);
  };
  childCompanyModalCancel = () => {
    this.setState({
      childCompanyModalVisible: false
    });
  };
  editChildCompany = (id) => {
    this.setState({
      isEditChild: true
    });
    T.get(CONFIG.option.companyModifyInit, {
      id
    })
      .then((data) => {
        this.setState({
          childCompanyModalVisible: true,
          currentChildCompanyInfo: data.company
        });
        this.backFillCompanyInfo(this.childCompanyForm, data.company);
      })
      .catch((data) => {
        T.showError(data);
      });
  };
  deleteChildCompany = (id) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      onOk: () => {
        T.get(CONFIG.option.companyDelete, {
          id
        })
          .then((data) => {
            let list = loopDeleteList(this.state.childCompanyData, id);
            let parentList = loopDeleteList(this.state.treeData, id);
            message.success('删除成功');
            this.setState({
              childCompanyData: list,
              treeData: parentList
            });
          })
          .catch((data) => {
            T.showError(data);
          });
      }
    });
  };

  switchShowAddDepartment = () => {
    this.props.dispatch({
      type: 'organizationStructureQuery/showDepaModal',
      payload: {
        mode: ADD_MODE,
        level: ADD_TOP_DEPA
      }
    });
  };
  switchShowAddChildDepartment = () => {
    this.props.dispatch({
      type: 'organizationStructureQuery/showDepaModal',
      payload: {
        mode: ADD_MODE,
        level: ADD_CHILD_DEPA
      }
    });
  };
  //添加部门
  addDepartment = () => {
    let input = this.refs.addDepartmentInput.input;
    //如果输入框内的值不为空
    if (input.value.trim()) {
      this.setState({
        addDepartmentLoading: true
      });
      T.post(CONFIG.option.departmentCreate, {
        departmentName: input.value,
        parentId: 0,
        companyId: this.state.currentCompanyInfo.id
      })
        .then((data) => {
          this.setState({
            departmentTreeData: [
              ...this.state.departmentTreeData,
              {
                id: data.id,
                departmentName: data.departmentName
              }
            ],
            addDepartmentShow: false
          });
          message.success('添加成功');

          this.setState({
            addDepartmentLoading: false
          });
        })
        .catch((data) => {
          this.setState({
            addDepartmentLoading: false
          });
          T.showError(data);
        });
    }
  };
  fetchDepartmentInfo = (id) => {
    T.get(CONFIG.option.getDirectChildDepartment, { id })
      .then((data) => {
        const { dateList = [], company = {}, idAndManagerNameMap, parentDepartment = {} } = data;
        let childDepartmentInputIdAndNameMap = {};
        dateList.forEach((item) => {
          childDepartmentInputIdAndNameMap[item.id] = item.departmentName;
        });
        this.setState({
          showDepartmentMaintain: true,
          childDepartmentData: dateList,
          currentDepartmentInfo: {
            ...company,
            parentDepartment: parentDepartment.departmentName
          },
          idAndManagerNameMap,
          currentDepartmentInputValue: company.departmentName,
          childDepartmentInputIdAndNameMap
        });
      })
      .catch((data) => {
        T.showError(data);
      });
  };
  blurToEdit = (id, oldValue, type) => {
    let _data;
    if (type === 'current') {
      _data = {
        id,
        departmentName: this.state.currentDepartmentInputValue
      };
    } else {
      _data = {
        id,
        departmentName: this.state.childDepartmentInputIdAndNameMap[id]
      };
    }
    const loopList = (data, id) => {
      let list = data;
      list.forEach((item) => {
        if (item.id === id) {
          item.departmentName = _data.departmentName;
        } else {
          if (item.children) {
            loopList(item.children, id);
          }
        }
      });
      return list;
    };
    const resetValue = (id, oldValue) => {
      if (type === 'current') {
        this.setState({
          currentDepartmentInputValue: oldValue
        });
      } else {
        this.setState({
          childDepartmentInputIdAndNameMap: {
            ...this.state.childDepartmentInputIdAndNameMap,
            ...{ [id]: oldValue }
          }
        });
      }
    };
    //离开焦点时输入框内的值未改变，则不请求接口
    if (oldValue === _data.departmentName) return;
    if (!_data.departmentName) {
      //输入框值为空时直接恢复
      resetValue(id, oldValue);
      return;
    }
    T.post(CONFIG.option.departmentModifyUrl, _data)
      .then((data) => {
        let list = loopEditList(this.state.departmentTreeData, id, {
          departmentName: _data.departmentName
        });
        this.setState({
          departmentTreeData: list
        });
        if (type === 'current') {
          //将旧的value值更新
          this.setState({
            currentDepartmentInfo: {
              ...this.state.currentDepartmentInfo,
              ...{ departmentName: _data.departmentName }
            }
          });
        } else {
          //将旧的value值更新
          let list = loopEditList(this.state.childDepartmentData, id, {
            departmentName: _data.departmentName
          });
          this.setState({
            childDepartmentData: list
          });
        }
        message.success('编辑成功');
      })
      .catch((data) => {
        //修改接口失败时 恢复输入框内的值
        resetValue(id, oldValue);
        T.showError(data);
      });
  };
  deleteDepartment = (id, type) => {
    Modal.confirm({
      title: '提示',
      content: '确定删除吗？',
      onOk: () => {
        T.get(CONFIG.option.departmentDelete, {
          departmentId: id
        })
          .then((data) => {
            if (type === 'current') {
              let list = loopDeleteList(this.state.departmentTreeData, id);

              this.setState({
                showDepartmentMaintain: false,
                currentDepartmentInfo: null,
                departmentTreeData: list
              });
            } else {
              let childList = loopDeleteList(this.state.childDepartmentData, id);
              let parentList = loopDeleteList(this.state.departmentTreeData, id);

              this.setState({
                childDepartmentData: childList,
                departmentTreeData: parentList
              });
            }
          })
          .catch((data) => {
            T.showError(data);
          });
      }
    });
  };
  currentDepartmentInputChange = (e) => {
    this.setState({
      currentDepartmentInputValue: e.target.value
    });
  };
  childDepartmentInputChange = (e, id) => {
    this.setState({
      childDepartmentInputIdAndNameMap: {
        ...this.state.childDepartmentInputIdAndNameMap,
        ...{ [id]: e.target.value }
      }
    });
  };
  addChildDepartment = () => {
    const input = this.refs.addChildDepartmentInput.input;
    const parentDepartmentId = this.state.currentDepartmentInfo.id;
    //如果输入框内的值不为空
    if (input.value.trim()) {
      this.setState({
        addChildDepartmentLoading: true
      });
      T.post(CONFIG.option.departmentCreate, {
        departmentName: input.value,
        parentId: parentDepartmentId,
        companyId: this.state.currentCompanyInfo.id
      })
        .then((data) => {
          let list = renderChildStatus(this.state.departmentTreeData, parentDepartmentId, true);
          let renderChildList = addChildIfHasChildren(list, parentDepartmentId, {
            id: data.id,
            departmentName: input.value
          });

          this.setState({
            childDepartmentData: [
              ...this.state.childDepartmentData,
              {
                id: data.id,
                departmentName: data.departmentName
              }
            ],
            childDepartmentInputIdAndNameMap: {
              ...this.state.childDepartmentInputIdAndNameMap,
              ...{ [data.id]: data.departmentName }
            },
            addChildDepartmentShow: false,
            departmentTreeData: renderChildList
            // departmentExpandedKeys: [...this.state.departmentExpandedKeys, parentDepartmentId]
          });
          message.success('添加成功');
          // setTimeout(() => {
          //   this.setState({
          //     departmentExpandedKeys: [...this.state.departmentExpandedKeys, parentDepartmentId]
          //   })
          // }, 3000);

          this.setState({
            addChildDepartmentLoading: false
          });
        })
        .catch((data) => {
          T.showError(data);
          this.setState({
            addChildDepartmentLoading: false
          });
        });
    }
  };

  componentDidMount() {
    this.getCompanyTreeRootData();
  }

  hideDepaModal = () => {
    this.props.dispatch({
      type: 'organizationStructureQuery/hideDepaModal'
    });
  }

  editDepaModal = (payload) => {
    this.props.dispatch({
      type: 'organizationStructureQuery/editDepa',
      payload
    });
  }

  // 提交部门弹窗数据
  handleSumbitDepaModal = (values) => {
    this.setState({ showCompanySetVisible: false });
    const { depaModalMode } = this.props;
    if (depaModalMode === ADD_MODE) {
      this.handleAddDepa(values);
    } else if (depaModalMode === EDIT_MODE) {
      this.handleModifyDepa(values);
    }
  }

  // 新增部门
  async handleAddDepa(values) {
    const { currentDepartmentInfo, currentCompanyInfo } = this.state;
    const { addDepaLevel } = this.props;
    const isAddTopDepa = addDepaLevel === ADD_TOP_DEPA;
    try {
      await T.post('/user/departmentCreate.json', {
        ...values,
        parentId: isAddTopDepa
          ? 0
          : currentDepartmentInfo.id,
        companyId: currentCompanyInfo.id
      });
      message.success('新增成功');
      if (isAddTopDepa) {
        this.onTreeSelect([currentCompanyInfo.id], null, 'company');
      } else {
        this.onTreeSelect([currentCompanyInfo.id], null, 'company');
        this.onTreeSelect([currentDepartmentInfo.id], null, 'department');
      }
      this.hideDepaModal();
    } catch (err) {
      T.showErrorMessage(err);
    } finally {
      this.setState({ showCompanySetVisible: true });
    }
  }

  // 修改部门
  async handleModifyDepa(values) {
    const { currentCompanyInfo, currentDepartmentInfo, } = this.state;
    const { editDepaData } = this.props;
    const { id } = editDepaData;
    try {
      await T.post('/user/departmentModify.json', {
        ...values,
        id,
        companyId: currentCompanyInfo.id
      });
      message.success('修改成功');
      this.onTreeSelect([currentCompanyInfo.id], null, 'company');
      this.onTreeSelect([currentDepartmentInfo.id], null, 'department');
      this.hideDepaModal();
    } catch (err) {
      T.showErrorMessage(err);
    } finally {
      this.setState({ showCompanySetVisible: true });
    }
  }

  render() {
    const { showDepaModal, depaModalMode, editDepaData } = this.props;
    const { idAndManagerNameMap, currentDepartmentInfo = {} } = this.state;
    const isTopDep = !!(currentDepartmentInfo && (currentDepartmentInfo.parentId == 0)); // eslint-disable-line

    return (
      <React.Fragment>
        <div className="cp-list-wrap">
          <div className="cp-list-head">
            <h2 className="title">公司列表</h2>
            <Button className="cp-add" onClick={this.showAddCompanyModal}>
              添加公司
            </Button>
          </div>
          <div className="cp-list">
            {this.state.treeData.length ? (
              <Tree
                showLine
                // expandedKeys={this.state.companyExpandedKeys}
                loadData={(treeNode) => this.onLoadData(treeNode, 'company')}
                onSelect={(selectedKeys, e) => this.onTreeSelect(selectedKeys, e, 'company')}
                autoExpandParent={false}
                // onExpand={this.onCompanyExpand}
              >
                {this.renderTreeNodes(this.state.treeData, 'company')}
              </Tree>
            ) : (
              <div className="no-data">暂无数据</div>
            )}
          </div>
        </div>
        {this.state.showCompanySetVisible ? (
          <div className="cp-list-wrap">
            <div className="cp-list-head">
              <h2 className="title">{this.state.currentCompanyInfo.shortName}</h2>
              <Button className="cp-add" onClick={this.showSetCompanyModal}>
                设置
              </Button>
              <Button type="primary mr10 pull_right" onClick={this.switchShowAddDepartment}>
                添加部门
              </Button>
            </div>
            <div className="cp-list">
              <h2 className="list-title">部门列表</h2>
              {this.state.departmentTreeData.length && this.state.showDepartmentModule ? (
                <Tree
                  showLine
                  // expandedKeys={this.state.departmentExpandedKeys}
                  loadData={(treeNode) => this.onLoadData(treeNode, 'department')}
                  onSelect={(selectedKeys, e) => this.onTreeSelect(selectedKeys, e, 'department')}
                  autoExpandParent={false}
                  // onExpand={this.onDepartmentExpand}
                >
                  {this.renderTreeNodes(this.state.departmentTreeData, 'department')}
                </Tree>
              ) : null}
              <div className="add-form-area clearfix">
                {this.state.addDepartmentShow ? (
                  <div
                    className={
                      this.state.departmentTreeData.length
                        ? 'ant-form ant-form-inline form-area'
                        : 'ant-form ant-form-inline form-area no-data-additem'
                    }
                  >
                    <div className="ant-form-item">
                      <Input ref="addDepartmentInput" />
                    </div>
                    <div className="ant-form-item">
                      <Button onClick={this.addDepartment} loading={this.state.addDepartmentLoading}>
                        添加
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
              {this.state.departmentTreeData.length ? null : (
                <div className={this.state.addDepartmentShow ? 'no-data no-data-addshow' : 'no-data'}>暂无数据</div>
              )}
            </div>
          </div>
        ) : null}
        {this.state.showDepartmentMaintain ? (
          <div className="cp-list-wrap sub-department-list-container">
            <div className="cp-list-head">
              <Button type="primary pull_right" onClick={this.switchShowAddChildDepartment}>
                添加子部门
              </Button>
            </div>
            <div className="cp-list sub-department-container">
              <h2 className="list-title">部门维护</h2>

              <div className="department-wrap">
                <div className="current-department">
                  <div className="input">
                    <div className="pull-left deparate-name">
                      {this.state.currentDepartmentInputValue}
                    </div>
                    <div className="pull-right manager">
                      <Icon type="user" />
                      <Separate isVertical={false} size={5} />
                      <span>{idAndManagerNameMap[currentDepartmentInfo.manager]}</span>
                    </div>
                  </div>
                  <Icon
                    type="delete"
                    onClick={() => this.deleteDepartment(currentDepartmentInfo.id, 'current')}
                  />
                  <Separate isVertical={false} size={10} />
                  <Icon
                    type="edit"
                    onClick={() => this.editDepaModal({
                      isTopDep,
                      parentDepartmentName: currentDepartmentInfo.parentDepartment,
                      ...currentDepartmentInfo,
                    })}
                  />
                </div>
                <Separate size={20} />
                {this.state.childDepartmentData.length ? (
                  <ul className="department-list">
                    {this.state.childDepartmentData.map((item) => {
                      return (
                        <li className="department-li" key={item.id}>
                          <div className="input">
                            <div className="pull-left deparate-name">
                              {this.state.childDepartmentInputIdAndNameMap[item.id]}
                            </div>
                            <div className="pull-right manager">
                              <Icon type="user" />
                              <Separate isVertical={false} size={5} />
                              <span>{idAndManagerNameMap[item.manager]}</span>
                            </div>
                          </div>
                          <Icon type="delete" onClick={() => this.deleteDepartment(item.id, 'child')} />
                          <Separate isVertical={false} size={10} />
                          <Icon
                            type="edit"
                            onClick={() => this.editDepaModal({
                              isTopDep: false,
                              parentDepartmentName: currentDepartmentInfo.departmentName,
                              parentId: currentDepartmentInfo.id,
                              ...item,
                            })}
                          />
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
              <div className="add-form-area">
                {this.state.addChildDepartmentShow ? (
                  <div className="ant-form ant-form-inline form-area">
                    <div className="ant-form-item">
                      <Input ref="addChildDepartmentInput" />
                    </div>
                    <div className="ant-form-item">
                      <Button onClick={this.addChildDepartment} loading={this.state.addChildDepartmentLoading}>
                        添加
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <AddCompanyModal
          visible={this.state.addCompanyModalVisible}
          title="添加公司基本信息"
          okText="创建"
          cancel={this.addCompanyCancel}
          submit={this.addCompanySubmit}
          loading={this.state.addCompanyLoading}
          ref={this.saveAddCompanyFormRef}
        />

        {/* 添加子公司，编辑子公司弹框 */}
        <AddCompanyModal
          visible={this.state.childCompanyModalVisible}
          cancel={this.childCompanyModalCancel}
          title={this.state.isEditChild ? '编辑子公司基本信息' : '添加子公司基本信息'}
          okText={this.state.isEditChild ? '编辑' : '创建'}
          submit={this.state.isEditChild ? this.childCompanyModalModify : this.childCompanyModalCreate}
          loading={this.state.childCompanyModalLoading}
          ref={this.saveChildCompanyFormRef}
        />

        {this.state.currentCompanyInfo ? (
          <SetCompanyModal
            visible={this.state.setCompanyModalVisible}
            submit={this.setCompanyModalSubmit}
            cancel={this.setCompanyCancel}
            editLoading={this.state.setCompanyEditLoading}
            deleteCompany={this.setCompanyDelete}
            addChildCompany={this.addChildCompany}
            editChildCompany={(id) => this.editChildCompany(id)}
            deleteChildCompany={(id) => this.deleteChildCompany(id)}
            list={this.state.childCompanyData}
            ref={this.savesetCompanyFormRef}
          />
        ) : null}
        <EditDepaModal
          mode={depaModalMode}
          visible={showDepaModal}
          hideModal={this.hideDepaModal}
          loading={false}
          handleSumbit={this.handleSumbitDepaModal}
          dataProvider={editDepaData}
        />
      </React.Fragment>
    );
  }
}

const ConnectApp = connect(({ organizationStructureQuery }) => ({ ...organizationStructureQuery, }))(App);
const app = dva({
  initialState: {}
});
app.model(organizationStructureQuery);
app.router(() => (
    <LocaleProvider locale={zh_CN}>
      <BasicLayout>
        <ConnectApp />
      </BasicLayout>
    </LocaleProvider>
  )
);
app.start('#root');

