/*
 * @Description: 人员分类树
 * @Author: moran
 * @Date: 2019-09-10 15:36:54
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-15 17:37:02
 */
import React from 'react';
import { connect } from 'dva';
import 'styles/components/process/personClassify/personClassifyTree.less';
const { Tree, Icon, Input, message, Modal, Tooltip } = window.antd;

const { TreeNode } = Tree;
const { Search } = Input;
let parentId = 1;

// 获取父元素key
const getParentKey = (id, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.groupInfoList) {
      if (node.groupInfoList.some(item => item.id === id)) {
        parentKey = node.id;
      } else if (getParentKey(id, node.groupInfoList)) {
        parentKey = getParentKey(id, node.groupInfoList);
      }
    }
  }
  return parentKey;
};

class PersonClassifyTree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [], // 树数据
      dataLists: [], // 树转换成的单个数组
      expandedKeys: [], // 需要展开树的key
      selectedKeys: '', // 选择的节点key
      searchValue: undefined // 搜索的关键字
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.groupInfoList !== prevProps.groupInfoList) {

      const { groupInfoList, treeConfigs } = this.props;
      const { groupInfoId } = treeConfigs;
      const { id } = groupInfoList[0];
      const defaultId = groupInfoId ? [groupInfoId] : [id];
      const singleLists = this.generateList(groupInfoList);
      // const rowData = singleLists.filter(item=> item.id === defaultId[0]);
      // const isRemove = rowData.length ? rowData[0].top : top;
      // const needNodeIdArr = this.getSelectIdArr(defaultId[0], groupInfoList); // 获取选择id数组
      this.setState({
        data: groupInfoList,
        dataLists: singleLists,
        expandedKeys: this.getExpandKeys(groupInfoList),
        selectedKeys: defaultId
      });
      // this.props.select({ groupId: defaultId, isRemove: !isRemove }, needNodeIdArr);
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'userGroupManage/getDepartMentTrees',
      payload: '',
    });
  }

  // 生成单一数组对象
  generateList = (data) => {
    let dataList = [];
    const generateFn = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { id, name, top } = node;
        dataList.push({ id, name, top });
        if (node.groupInfoList) {
          generateFn(node.groupInfoList);
        }
      }
    };
    generateFn(data);

    return dataList;
  }

  // 获取全部展开的key
  getExpandKeys = (lists) => {
    return lists.map(i => {
      return i.id;
    });
  }

  // 获取数组id
  getSelectIdArr = (id, arr) => {
    let needNodeIdArr = [];
    const parentId = getParentKey(id, arr);
    if (parentId) {
      needNodeIdArr.push(parentId, id);
    } else {
      needNodeIdArr.push(id);
    }
    return needNodeIdArr;
  }

  // 添加分类
  handleAddLabel = (e, item) => {
    e.stopPropagation();
    const { data } = this.state;
    const appendData = data.map(i => {
      if (i.id === item.id) {
        // 没有子节点添加一个子节点
        if (!i.groupInfoList) {
          i.groupInfoList = [];
        }
        const newChild = {name: undefined, parentId: `${item.id}`, isNew: true, top: false};
        i.groupInfoList.push(newChild);
      }
      return i;
    });
    this.setState({
      data: appendData
    }, () => {
      this.input && this.input.focus();
    });
  }

  // 取消
  handleCancle = (e, item, isEdit) => {
    e.stopPropagation();
    const { data } = this.state;
    if (!isEdit) { // 新增节点的取消
      let removeData = data.map((i) => {
        if (i.groupInfoList) { // 移除取消的节点
          i.groupInfoList.forEach((a, index) => {
            if (a.id === item.id) {
              i.groupInfoList.splice(index, 1);
            }
          });
        }
        return i;
      });
      // 取消父元素节点
      removeData = item.groupInfoList ? removeData.filter(a => a.id !== item.id) : removeData;
      this.setState({
        data: removeData
      });
    } else { // 编辑节点取消
      this.props.dispatch({
        type: 'userGroupManage/getDepartMentTrees',
        payload: '',
      });
      // const fixFieldData = data.map(i => {
      //   if (i.groupInfoList) { // 子节点取消恢复数据
      //     i.groupInfoList.forEach(a => {
      //       if (a.id === item.id) {
      //         a.isEdit = false;
      //       }
      //     });
      //   }
      //   if (i.id === item.id) { // 父节点取消
      //     i.isEdit = false;
      //   }
      //   return i;
      // });
      // this.setState({
      //   data: fixFieldData
      // });
    }
  }

  // 编辑
  handleEditor = (e, item) => {
    e.stopPropagation();
    // console.log('editor item', item);
    const { data } = this.state;
    let addFieldData;
    if (!item.groupInfoList) { // 子节点的编辑增加 isEdit 为true
      addFieldData = data.map(i => {
        if (i.groupInfoList) {
          i.groupInfoList.forEach(a => {
            if (a.id === item.id) {
              a.isEdit = true;
            }
          });
        }
        return i;
      });
    } else { // 父节点时 在父节点增加isEdit字段
      addFieldData = data.map(i => {
        if (i.id === item.id) {
          i.isEdit = true;
        }
        return i;
      });
    }

    this.setState({
      data: addFieldData
    });
  }

  // 拖动排序
  handleDrop = (info) => {
    const dropKey = info.node.props.eventKey;  // 目标位置的节点id
    const dragKey = info.dragNode.props.eventKey; // 拖拽节点id
    const dropChildren = info.node.props.children; // 目标位置的是否有children
    const dragChildren = info.dragNode.props.children;  // 拖拽节点是否有children字段
    const dropParentId = info.node.props.dataRef.parentId;  // 目标位置的父节点id
    const dragParentId = info.dragNode.props.dataRef.parentId; // 拖拽节点的父节点id
    const dropTop = info.node.props.dataRef.top;  // 目标是否固定头部
    const dragTop = info.dragNode.props.dataRef.top; // 拖拽的节点是否固定头部
    const parentCondition = dropChildren && dragChildren; // 父节点可拖拽条件
    const sonCondition = !dropChildren && !dragChildren && (dropParentId === dragParentId); // 子节点可拖拽条件
    const fixedCondition = dropTop || dragTop; // 默认固定不可拖拽条件
    if (fixedCondition) {
      message.error('默认和层级不允许拖动');
      return;
    }
    if (!(parentCondition || sonCondition)) {
      message.error('请在相同层级内拖动');
    } else {
      this.props.dispatch({
        type: 'userGroupManage/reSortGroupInfo',
        payload: { movedId: dragKey, targetId: dropKey }
      });
    }
  }

  // 展开
  handleExpand = (expandedKeys ) => {
    this.setState({
      expandedKeys
    });
  }

  // 搜索
  handleSearch = (e) => {
    e.persist();
    const { value } = e.target;
    const { data, dataLists } = this.state;
    const expandedKeys = dataLists
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, data);
        }
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);
      this.setState({
        expandedKeys,
        searchValue: value
      });
  }

  // 添加分类
  handleAddClass = (e) => {
    const { data } = this.state;

    parentId++;
    const newClass = { name: undefined, id: `parent-${parentId}`, isNew: true, top: false, groupInfoList: [] };
    this.setState({
      data: [...data, ...[newClass]]
    }, () => {
      this.input && this.input.focus();
    });
  }

  // 删除
  handleDelete = (e, item) => {
    e.stopPropagation();
    const { groupInfoList, id } = item;
    const self = this;
    Modal.confirm({
      title: '提示',
      content: groupInfoList ? '删除分类后会将分类内的标签全部删除，是否继续？' : '确定删除标签？',
      onOk() {
        // 调取删除接口
        self.props.dispatch({
          type: 'userGroupManage/deleteGroupInfo',
          payload: { id }
        });
      },
    });
  }

  // input框改变组装数据
  handleInputChange = (e, item) => {
    e.persist();
    e.stopPropagation();
    const { data } = this.state;
    const labelValue = e.target.value;
    let fixFieldLists;
    if (item.groupInfoList) { // 父节点
      fixFieldLists = data.map(i => {
        if (i.id === item.id) i.name = labelValue; // 修改title
        return i;
      });
    } else { // 子节点
      fixFieldLists = data.map(i => {
        i.groupInfoList.forEach(a => {
          if (a.id === item.id) a.name = labelValue;
        });
        return i;
      });
    }
    this.setState({
      data: fixFieldLists
    });
  }

  // 选中节点
  handleTreeSelect = (val, e) => {
    const rowNodeTop = e.node.props.dataRef.top;
    const isNew = e.node.props.dataRef.isNew;

    // 获取选择树选择id数组
    const needNodeIdArr = this.getSelectIdArr(val[0], this.props.groupInfoList);

    this.setState({
      selectedKeys: val
    });
    // 新建分类或者标签 以及没选中不触发查询接口
    if (!isNew && val.length) this.props.select({ groupId: val, isRemove: !rowNodeTop }, needNodeIdArr);
  }

  // 新增或者编辑保存
  handleSave = (e, item, isEdit) => {
    e.stopPropagation();
    const { groupInfoList, parentId, name, id } = item;
    if (!isEdit) {
      const params = {
        parentId: groupInfoList ? undefined : parentId,
        name
      };
      // 新增节点保存
      this.props.dispatch({
        type: 'userGroupManage/createGroupInfo',
        payload: params,
      });
    } else {
      // 编辑节点保存
      this.props.dispatch({
        type: 'userGroupManage/modifyGroupInfo',
        payload: { id, name }
      });
    }
  }

  // 层级树渲染
  renderTreeNodes = (data) => {
    const { searchValue } = this.state;
    return data.map((item) => {
      const { name, groupInfoList, top, isNew, isEdit, userNum } = item;
      const index = searchValue ? name.indexOf(searchValue) : -1; // 渲染数据中是否有搜索关键字
      const needUserNum = userNum ? `(${userNum})` : ''; // 人数显示
      const title = (name && name.length > 15) ? `${name}${needUserNum}` : null; // 提示框显示（超过15个字）
      let titleShow = <Tooltip title={title}>
        <span className={index > -1 ? 'red' : ''}>{name}{needUserNum}</span>
      </Tooltip>;
      
      if (!top) {
        titleShow = (
          <div>
            {!isEdit && !isNew && <span
              className={name !== undefined ? "spacing" : ''}
              >{titleShow}</span>
            }
            {/* icon显示 */}
            <span>
              {!isNew && !isEdit && <Icon
                className="small-spacing"
                type="edit"
                onClick={(e) => this.handleEditor(e, item)}/>
              }
              {!isNew && !isEdit && <Icon
                className="small-spacing"
                type="minus-circle"
                onClick={(e) => this.handleDelete(e, item)}/>
              }
              {groupInfoList && !isEdit && !isNew ? <Icon
                className="small-spacing"
                type="plus-circle"
                onClick={(e) => this.handleAddLabel(e, item)} /> : null
              }
              {!isNew && !isEdit && <Icon
                className="small-spacing"
                type="drag" />
              }
            </span>

            {/* 编辑新增 显示 */}
            {(isNew || isEdit) &&
              <span className="divide">
                <Input
                  ref={(input) => this.input = input}
                  className="divide"
                  maxLength={30}
                  placeholder={groupInfoList ? "分类名称，最多30字" : "标签名称，最多30字"}
                  defaultValue={name}
                  onChange={(e) => this.handleInputChange(e, item)}/>
                <span
                  className='tree-label'
                  onClick={(e) => this.handleCancle(e, item, isEdit)}>
                  取消
                </span>
                <span
                  className='tree-label'
                  onClick={(e) => this.handleSave(e, item, isEdit)}>
                  保存
                </span>
              </span>
            }
          </div>
        );
      }

      if (groupInfoList) {
        return (
        <TreeNode title={titleShow} key={item.id} dataRef={item}>
          {this.renderTreeNodes(groupInfoList)}
        </TreeNode>
        );
      }

      return <TreeNode title={titleShow} key={item.id} dataRef={item}></TreeNode>;
    });
  }
  render() {
    const { data, expandedKeys, selectedKeys } = this.state;
    return (
      <div className="person-classify-tree">
        <div className="tree-search">
          <Search style={{ marginBottom: 8 }}
            placeholder="请输入"
            onChange={this.handleSearch} />
        </div>
        <span className='add-class'
          onClick={this.handleAddClass}>
          <Icon type="plus" />新增分类
        </span>
        <Tree
          className="tree-container"
          showLine
          draggable
          expandedKeys={expandedKeys}
          onExpand={this.handleExpand}
          onDrop={this.handleDrop}
          selectedKeys={selectedKeys}
          onSelect={this.handleTreeSelect}>
          {this.renderTreeNodes(data)}
        </Tree>
      </div>

    );
  }
}

PersonClassifyTree.propTypes = {
  treeConfigs: PropTypes.object,
};

PersonClassifyTree.defaultProps = {
  groupInfoId: {}, // 需要回填的数据
};

export default connect (({ userGroupManage }) => ({ ...userGroupManage }))(PersonClassifyTree);
