import React from 'react';

const { TreeSelect } = window.antd;

const TreeNode = TreeSelect.TreeNode;

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

/**
 * treeValue 值存放在父元素中
 * 不存放在这个组件中
 */
class DepartmentTree extends React.Component {

  constructor(props){

    super(props);

    this.state = {
      isInited: false,
      treeData: [],

      /**
       * 所有节点的ID值，用于查看是否在当前树中找到对应的节点
       */
      allTreeIds: []
    };
  }

  componentDidMount(){
    this.getUserDepartmentTree();
  }

  getUserDepartmentTree() {

      T.get('/user/userDepartmentTree.json').then((res) => {

        if(res['success']){

          const allTreeData = this.formatTreeData(res);

          this.setState({
            treeData: allTreeData.treeData,
            hasFundDepartment: allTreeData.hasFundDepartment,
            allTreeIds: allTreeData.allTreeIds
          });

          /** 如果还没有初始化 */
          if(this.state.isInited === false){

            this.setState({
              isInited: true
            }, () => {

              /** 如果有初始值 */
              if(this.props.treeValue){
                this.onChange(this.props.treeValue, true);
              }

            });
          }

        }


      });
    }

  formatTreeData(data){

    const allTreeIds = [];

    /** 所有部门列表 */
    const map = data.canOperateCompanyIdAndDepartmentsSimpleInfoMap;

    /** 公司列表 */
    const comMap = data.companyIdAndCompanyName;

    const rootData = [];

    const expandKeysMap = {};

    /** 格式化部门树数据 */

    /** 先组织公司 */
    for(let comId in map){

      /** 公司总的数据 */
      let comData = Object.create(null);

      comData['value'] = comId;
      comData['key'] = comId;
      comData['title'] = comMap[comId];
      comData['children'] = [];
      /** 不可以选公司 */
      comData['selectable'] = false;

      /** 循环每一个公司的部门 */
      let depList = map[comId];


      /** 循环全部，组成新数据格式 */
      for(let i = 0, l = depList.length; i < l; i++){
        const item = depList[i];
        const itemId = item.id;

        let dep = Object.create(null);

        dep['value'] = itemId;
        dep['key'] = itemId;
        dep['title'] = item.departmentName;
        dep['parentId'] = item.parentId;
        dep['selectable'] = true;

        dep['children'] = [];

        allTreeIds.push(itemId);

        comData.children.push(dep);
      }

      rootData.push(comData);

    }

    return { treeData:rootData, expandKeysMap, allTreeIds};
  }


  /** 生成部门树的分支 */
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} selectable={true}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });

  onChange = (value, isSelfDepartment) => {
    this.props.onChange(value, isSelfDepartment);

    this.setState({
      /** 已经手动改变了 */
      hasChangeByHand: true
    });

  }

  render(){

    const {treeData, allTreeIds } = this.state;

    const tProps = {
      treeData,
      value: allTreeIds.indexOf(this.props.treeValue) === -1? '' : this.props.treeValue ,
      onChange: this.onChange,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: '请选择部门',
      notFoundContent: '暂无数据',
      treeNodeFilterProp: 'title',
      showSearch: true,
      style: {
        width: 200,
      }
    };

    /** 是否有值 */

    return (
      <TreeSelect {...tProps} />
    );
  }

}


export default DepartmentTree;
