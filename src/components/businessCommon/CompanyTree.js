import React from 'react';
const { Tree } = window.antd;

const { TreeNode } = Tree;

class CompanyTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      allTreeKeys: [],
      checkedKeys: [],
      treeData: props.dataProvider || []
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 获取到数据源
    if (this.props.dataProvider !== nextProps.dataProvider) {
      this.setState({
        expandedKeys: this.getExpandKeys(nextProps.dataProvider),
        allTreeKeys: this.getExpandKeys(nextProps.dataProvider)
      });
    }
  }

  componentDidMount() {
    const { treeData } = this.state;
    if (treeData.length) {
      const { selectDepartmentLists } = this.props;

      // 选中部门回填
      const selectDepartmentKeys = selectDepartmentLists.map(item => {
        return item.key;
      });

      // 已选中删除的过滤 父元素删除展开
      const allTreeKeys = this.getExpandKeys(treeData);
      const filterKeys = allTreeKeys.filter(i => selectDepartmentKeys.indexOf(i) === -1);

      this.setState({
        expandedKeys: filterKeys,
        checkedKeys: selectDepartmentKeys,
        allTreeKeys
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectDepartmentLists !== prevProps.selectDepartmentLists) {
      const { selectDepartmentLists } = this.props;

      // 选中部门回填
      const selectDepartmentKeys = selectDepartmentLists.map(item => {
        return item.key;
      });

      // 已选中删除的过滤 父元素删除展开
      const { allTreeKeys } = this.state;
      const filterKeys = allTreeKeys.filter(i => selectDepartmentKeys.indexOf(i) === -1);

      this.setState({
        expandedKeys: filterKeys,
        checkedKeys: selectDepartmentKeys
      });
    }
  }

  // 移除父元素下的子元素
  removeSonKeys = (key, tree) => {
    let sonKey = [];
    let forFn = (key, tree) => {
      tree.forEach(node => {
        if(node.key === key) { // 如果第一层 直接获取
          sonKey.push(key);
          if (node.children) { // 子元素下获取key值
            node.children.forEach((res) => {
              forFn(res.key, node.children);
            });
          }

        } else { // 不是第一层
          if (node.children) {
            forFn(key, node.children);
          }
        }
      });
    };
    forFn(key, tree);
    sonKey = sonKey.filter(i => i !== key);
    return sonKey;
  }

  getExpandKeys(data) {
    let expandKeys = [];
    let expandFn = (data) => {
      data.forEach(i => {
        const { children, key } = i;
        if (children) {
          expandFn(children);
        }
        expandKeys.push(key);
      });
    };
    expandFn(data);
    return expandKeys;
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      const { title, children } = item;
      if (children) {
        return (
        <TreeNode
          {...item}
          title={title}
          key={item.key}
          dataRef={item}
        >
          {this.renderTreeNodes(children)}
        </TreeNode>
        );
      }

      return <TreeNode
        {...item}
        title={title}
        key={item.key}
        dataRef={item}
      />;
    });
  }

  handleCheck = (checkedKeys, e) => {
    const { checked } = checkedKeys;
    const { allTreeKeys, treeData } = this.state;

    // 获取 所有选中父元素下的子元素
    let sonId = [];
    checked.forEach(a => {
      sonId = [...sonId, ...this.removeSonKeys(a, treeData) ];
    });

    // 需要展开的key
    const filterKeys = allTreeKeys.filter(i => checked.indexOf(i) === -1);

    // 过滤到选中部门数据 且父元素下不包括子元素
    let selectDepartmentList = e.checkedNodes.filter(i => sonId.indexOf(i.key) === -1);

    this.setState({
      expandedKeys: filterKeys,
      checkedKeys: checked
    });

    selectDepartmentList = selectDepartmentList.map(i => {
      const { key, props } = i;
      const { title, companyName } = props;
      return {
        key,
        title,
        companyName
      };
    });

    this.props.check(selectDepartmentList);
  }

  render() {
    const { expandedKeys, checkedKeys } = this.state;

    return (
      <Tree
        checkable
        checkedKeys={checkedKeys}
        checkStrictly
        defaultExpandParent={false}
        expandedKeys={expandedKeys}
        onCheck={this.handleCheck}
      >
        {this.renderTreeNodes(this.state.treeData)}
      </Tree>
    );
  }
}
export default CompanyTree;
