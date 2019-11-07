const { Input, Tree, Icon, Tabs } = window.antd;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const TabPane = Tabs.TabPane;

class TreeCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      copyTreeData: [],
      searchError: false,
      searchErrorMsg: ''
    };
  }

  componentDidMount() {
    T.get(`${T.userPath}/getRootCompany.json`)
      .then(this.querySuccess)
      .catch((err) => {
        T.showError(err);
      });
  }

  querySuccess = (data) => {
    const companyList = data['companyList'];
    let l = companyList.length;
    const treeData = [];

    if (l === 0) {
      return;
    }

    for (let i = 0; i < l; i++) {
      let item = companyList[i];
      treeData.push({
        id: item['id'],
        key: item['id'],
        pid: item['parentId'],
        title: item['shortName'],
        isLeaf: !(item['hasChild'] || item['hasDepartment']),
        treeType: 'company'
      });
    }

    this.setState({
      treeData: [...this.state.treeData, ...treeData],
      copyTreeData: [...this.state.treeData, ...treeData]
    });
  };

  onLoadData = (node) => {
    return this.getChildrenData(node);
  };

  getChildrenData = (node) => {
    const { dispatch, nameSpace, userNameCheckedKeys, treeKey, checkedKeys, checkedMap } = this.props;

    return new Promise((resolve) => {
      const props = node.props;
      if (props.children) {
        resolve();
        return;
      }

      const isCompany = props.treeType === 'company';
      const url = isCompany
        ? `${T['userPath']}/getDirectCompantAndDepartmentListByCompanyId.json`
        : `${T['userPath']}/getDirectDepartmentAndUserListByDepartmentId.json`;
      const id = props.id;
      const params = isCompany ? { companyId: id } : { departmentId: id };

      let expandedKeys = this.props.expandedKeys;
      if (T.IsInArray(id, expandedKeys) === -1) {
        expandedKeys.push(id);
      }

      T.get(url, params)
        .then((data) => {
          let directChildCompany = [];
          let rootDepartment = [];
          let userList = [];
          let directChildDepartment = [];

          const dataRef = props.dataRef;

          // 有子公司数据
          if (data.directChildCompany) {
            directChildCompany = this.addTreeData({
              name: 'shortName',
              hasChild: ['hasChild', 'hasDepartment'],
              data: data.directChildCompany,
              rootName: 'directChildCompany',
              dataRef,
              type: 'company'
            });
          }

          // 有部门数据
          if (data.rootDepartment) {
            rootDepartment = this.addTreeData({
              pid: 'companyId',
              name: 'departmentName',
              hasChild: ['hasChild', 'hasUser'],
              data: data.rootDepartment,
              rootName: 'rootDepartment',
              dataRef,
              type: 'department'
            });
          }

          // 有子部门数据
          if (data.directChildDepartment) {
            directChildDepartment = this.addTreeData({
              name: 'departmentName',
              hasChild: ['hasChild', 'hasUser'],
              data: data.directChildDepartment,
              rootName: 'directChildDepartment',
              dataRef,
              type: 'department'
            });
          }

          // 员工数据
          if (data.userList) {
            userList = this.addTreeData({
              id: 'userId',
              pid: 'departmentId',
              name: 'nickName',
              data: data.userList,
              rootName: 'userList',
              dataRef,
              type: 'user'
            });
          }

          dataRef.children = [...directChildCompany, ...rootDepartment, ...directChildDepartment, ...userList];

          this.setState({
            treeData: [...this.state.treeData],
            copyTreeData: [...this.state.treeData, ...dataRef.children]
          });

          // 修改页面回填数据 赋予checkedKeys
          let childrenCheckedKeys = checkedKeys || [];
          let childrenCheckedMap = {};
          let childrenUserNameCheckedKeys = [];
          let nameCheckedKeys = [];

          // 父节点已勾选，需要手动将子节点的key加入到checkedKeys
          if (node.props.checked) {
            const children = node.props.children;
            const l = children.length;
            for (let i = 0; i < l; i++) {
              const childrenNode = children[i];
              const childrenNodeProps = childrenNode.props;
              const childrenNodeId = childrenNodeProps.id;
              childrenCheckedKeys.push(childrenNodeId);
              childrenCheckedMap = {
                ...childrenCheckedMap,
                [childrenNodeId]: {
                  title: childrenNodeProps.title,
                  cell: childrenNodeProps.cell
                }
              };

              // 真正需要传给后台的员工id的数组
              if (childrenNode['props']['treeType'] === 'user') {
                childrenUserNameCheckedKeys.push(childrenNodeId);
              }
            }

            nameCheckedKeys = checkedKeys.filter((key) => key !== id);
            delete checkedMap[id];
          }

          dispatch({
            type: `${nameSpace}/treeSelect`,
            payload: {
              key: treeKey,
              [treeKey]: {
                autoExpandParent: false,
                expandedKeys: expandedKeys,
                checkedKeys: [...nameCheckedKeys, ...childrenCheckedKeys],
                checkedMap: { ...checkedMap, ...childrenCheckedMap },
                userNameCheckedKeys: [...userNameCheckedKeys, ...childrenUserNameCheckedKeys]
              }
            }
          });

          resolve();
        })
        .catch((err) => {
          T.showError(err);
        });
    });
  };

  addTreeData = ({ id = 'id', pid = 'parentId', name, hasChild, data, rootName, dataRef, type }) => {
    const l = data ? data.length : 0;

    if (l === 0) {
      return [];
    }

    let dataArr = [];
    for (let i = 0; i < l; i++) {
      let item = data[i];
      const treeNodeId = item[id];
      const isLeaf = hasChild ? !(item[hasChild[0]] || item[hasChild[1]]) : true;

      let param = {
        id: treeNodeId,
        key: treeNodeId,
        pid: item[pid],
        title: item[name],
        isLeaf,
        treeType: type
      };

      if (type === 'user') {
        param = { ...param, cell: item.cell };
      }

      dataArr.push(param);
    }

    return dataArr;
  };

  // 渲染树的节点
  renderTreeNodes = (data) => {
    return data.map((item) => {
      const title = item.title;

      if (item.children) {
        return (
          <TreeNode {...item} title={title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} title={title} key={item.key} dataRef={item} />;
    });
  };

  onCheck = (checkedKeys, { checked, checkedNodes, node, event }) => {
    const { dispatch, nameSpace, treeKey } = this.props;
    let checkedMap = {};
    let nameCheckedKeys = [];
    let userNameCheckedKeys = [];

    for (let i = 0; i < checkedNodes.length; i++) {
      const checkedNode = checkedNodes[i];
      const key = checkedNode['key'];
      // 提出父节点
      if (!checkedNode['props']['children']) {
        checkedMap = {
          ...checkedMap,
          [key]: {
            title: checkedNode['props']['title'],
            cell: checkedNode['props']['cell']
          }
        };

        nameCheckedKeys.push(key);
      }
      // 后台只需要员工的数据
      if (checkedNode['props']['treeType'] === 'user') {
        userNameCheckedKeys.push(key);
      }
    }

    dispatch({
      type: `${nameSpace}/treeSelect`,
      payload: {
        key: treeKey,
        [treeKey]: {
          checkedKeys: nameCheckedKeys,
          checkedMap,
          userNameCheckedKeys
        }
      }
    });
  };

  // 筛选含有搜索框中内容的节点，高亮显示
  filterTreeNode = (node) => {
    const searchValue = this.props.searchValue;

    if (!searchValue) {
      return;
    }
    return node.props.title.indexOf(searchValue) > -1;
  };
  onSearchChange = (e) => {
    this.setState({
      searchError: false,
      searchErrorMsg: ''
    });
  };
  onSearch = (value) => {
    if (!value) {
      return;
    }
    const { nameSpace, treeKey, dispatch } = this.props;

    T.get(`${T.userPath}/getUserOrganizationInfo.json`, {
      nickName: value
    })
      .then((data) => {
        dispatch({
          type: `${nameSpace}/treeSelect`,
          payload: {
            key: treeKey,
            [treeKey]: {
              expandedKeys: data.userOrganizationInfoIds,
              searchValue: value,
              autoExpandParent: true
            }
          }
        });
        this.setState({
          searchError: true,
          searchErrorMsg: ''
        });

        // 有延时
        const time = setInterval(() => {
          if (
            document.getElementsByClassName('filter-node') &&
            document.getElementsByClassName('filter-node').length !== 0
          ) {
            setTimeout(() => {
              document.getElementsByClassName('filter-node')[0].scrollIntoViewIfNeeded();
            }, 500);
            clearInterval(time);
          }
        }, 300);
      })
      .catch((data) => {
        this.setState({
          searchError: true,
          searchErrorMsg: T.getError(data)
        });
      });
  };

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  // 删除一个人名
  remove = ({ item }) => {
    const { checkedKeys, nameSpace, checkedMap, userNameCheckedKeys, treeKey, dispatch } = this.props;

    let nameCheckedKeys = item ? checkedKeys.filter((key) => key !== item) : [];
    let realNameCheckedKeys = item ? userNameCheckedKeys.filter((key) => key !== item) : [];

    if (!item) {
      delete checkedMap[item];
    }

    dispatch({
      type: `${nameSpace}/treeSelect`,
      payload: {
        key: treeKey,
        [treeKey]: {
          checkedKeys: nameCheckedKeys,
          userNameCheckedKeys: realNameCheckedKeys,
          checkedMap: item ? checkedMap : []
        }
      }
    });
  };

  onExpand = (expandedKeys) => {
    const { dispatch, nameSpace, treeKey } = this.props;
    dispatch({
      type: `${nameSpace}/treeSelect`,
      payload: {
        key: treeKey,
        [treeKey]: {
          expandedKeys,
          autoExpandParent: false
        }
      }
    });
  };

  render() {
    const {
      checkedKeys,
      userNameCheckedKeys,
      treeKey,
      autoExpandParent,
      isMultiselect,
      checkedMap
    } = this.props;
    let expandedKeys = this.props.expandedKeys;

    //将选中的姓名放到右边显示
    const TreeSelectName = () => {
      const html = () =>
        userNameCheckedKeys.map((item) => {
          return (
            <li key={item}>
              <span className="pull_left">{checkedMap[item].title}</span>
              <Icon className="close_icon" type="close" onClick={() => this.remove({ item })} />
            </li>
          );
        });

      return (
        <div className="select_name_box">
          <header>
            <span className="pull_left">已选({userNameCheckedKeys.length})</span>
            {isMultiselect ? (
              ''
            ) : !isMultiselect && userNameCheckedKeys.length > 1 ? (
              <span className="text-primary pull_left" style={{ marginLeft: '15px' }}>
                已超出(1条)
              </span>
            ) : (
              ''
            )}
            <span className="pull_right" style={{ cursor: 'pointer' }} onClick={() => this.remove({ item: false })}>
              清空
            </span>
          </header>
          <ul>{html()}</ul>
        </div>
      );
    };

    return (
      <div className="clearfix">
        <div className="left_box">
          <Search
            style={{ marginBottom: 8 }}
            placeholder="请输入员工名称"
            enterButton
            onSearch={(value) => this.onSearch(value)}
            onChange={(e) => this.onSearchChange(e)}
          />
          {this.state.searchError ? <p className="text-primary">{this.state.searchErrorMsg}</p> : ''}
          <div className="card-container nav_name_tree">
            <Tabs type="card">
              <TabPane tab="人员" key="1">
                <ul className="tree_type_tag">
                  <li>按部门</li>
                </ul>
                <Tree
                  className="antd_tree_box"
                  checkable
                  loadData={this.onLoadData}
                  checkedKeys={checkedKeys}
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  filterTreeNode={this.filterTreeNode}
                  onCheck={this.onCheck}
                  key={treeKey}
                >
                  {this.renderTreeNodes(this.state.treeData)}
                </Tree>
              </TabPane>
            </Tabs>
          </div>
        </div>
        {TreeSelectName()}
      </div>
    );
  }
}

export default TreeCreate;
