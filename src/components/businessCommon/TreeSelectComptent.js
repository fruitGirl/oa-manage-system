/**
 * 部门树——组件参数说明(父组件需要传到子组件的参数)
 * dispatch：dva的一个参数
 * pageData：全局参数名字（一般使用父文件的文件名）
 * nameSpace：models下的namespace名字
 * style：个性化定义TreeSelect的样式
 * formItemLayout：FormItem的排列配置
 * label：label的值
 * form：从父组件传过来的form的dom值
 * inputId:input的name值
 * departmentIdConfig：表单验证的配置即getFieldDecorator(`${inputId}`:{departmentIdConfig})
 *
 */

const { TreeSelect } = window.antd;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
class TreeSelectComptent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [],
      treeValue: ['0-0-0']
    };
  }
  componentDidMount = () => {
    this.initCompanyTree();
  };

  //得到部门树的数据
  initCompanyTree = () => {
    const url = `${T['userPath']}/getRootCompany.json`;

    T.get(url)
      .then((data) => {
        const dateList = data['companyList'];
        const dataItem = dateList.map((item) => {
          const listData = {
            id: parseInt(item.id, 10),
            key: item.id,
            title: item.shortName,
            isLeaf: !(item.hasDepartment || item.hasChild),
            pId: parseInt(item.parentId, 10),
            value: item.id,
            isCompany: true
          };
          return listData;
        });
        this.setState({
          treeData: dataItem
        });
      })
      .catch((err) => {
        T.showError(err);
      });
  };
  //一步加载数据
  onLoadData = (node) => {
    return this.getChildrenData(node);
  };
  getChildrenData = (node) => {
    return new Promise((resolve) => {
      let value = node.props.value;

      //user/getDirectCompantAndDepartmentListByCompanyId.json?companyId=     这个查公司下的公司和部门
      //user/getDirectDepartmentAndUserListByDepartmentId.json?departmentId=      这个查部门下部门和员工
      if (node.props.children.length > 0) {
        resolve();
        return;
      }

      // 是否是公司
      const isCompany = node.props.isCompany;
      const url = isCompany
        ? `${T['userPath']}/getDirectCompantAndDepartmentListByCompanyId.json`
        : `${T['userPath']}/getDirectDepartmentAndUserListByDepartmentId.json`;
      const params = isCompany ? { companyId: value } : { departmentId: value };

      T.get(url, params)
        .then((data) => {
          let list = this.state.treeData;
          const directChildCompany = data.directChildCompany; //公司的list
          const directChildDepartment = data.directChildDepartment; //子部门的list
          const rootDepartment = data.rootDepartment; //部门的list
          //有子公司
          if (directChildCompany) {
            list = this.addTreeData({
              data: directChildCompany,
              hasChild: 'hasChild',
              hasDepartment: 'hasDepartment',
              id: 'id',
              name: 'shortName',
              parentId: 'parentId',
              rootName: 'directChildCompany',
              list: list
            });
          }
          //有部门
          if (rootDepartment) {
            list = this.addTreeData({
              data: data.rootDepartment,
              rootName: rootDepartment,
              hasChild: 'hasChild',
              id: 'id',
              hasDepartment: 'hasDepartment',
              name: 'departmentName',
              parentId: 'companyId',
              list: list
            });
          }

          //有子部门
          if (directChildDepartment) {
            list = this.addTreeData({
              data: data.directChildDepartment,
              rootName: 'directChildDepartment',
              hasChild: 'hasChild',
              id: 'id',
              hasDepartment: 'hasDepartment',
              name: 'departmentName',
              parentId: 'parentId',
              list: list
            });
          }

          this.setState({ treeData: [...list] });
          resolve();
        })
        .catch((err) => {
          T.showError(err);
        });
    });
  };
  addTreeData = (obj) => {
    const { data, rootName, hasChild, hasDepartment, id, name, parentId, list } = obj;
    const l = data ? data.length : 0;
    let leafName = null;
    let leafId = null;
    let leafIdSrt = null;
    let leafHasChild = null;
    let pid = null;
    let isCompany = null;

    if (l > 0) {
      for (let i = 0; i < l; i++) {
        let item = data[i];
        leafName = item[name];
        leafIdSrt = item[id];
        leafId = parseInt(leafIdSrt, 10);
        pid = parseInt(item[parentId], 10);
        leafHasChild = !!(item[hasChild] || item[hasDepartment]);
        isCompany = rootName === 'directChildCompany'; // 是否是公司

        list.push({
          id: leafId,
          pId: pid,
          title: leafName,
          value: leafIdSrt,
          key: leafIdSrt,
          isLeaf: !leafHasChild,
          isCompany: isCompany,
          thisType: rootName
        });
      }
    }
    return list;
  };
  onChange = (value, label, extra) => {
    const { dispatch, nameSpace, backFillSelectChange, valueSpaceName } = this.props;
    if (typeof backFillSelectChange === 'function') {
      this.props.backFillSelectChange(value, 'departmentId');
    }
    // 非通用的
    if (valueSpaceName) {
      dispatch && dispatch({
        type: `${nameSpace}/save`,
        payload: {
          [valueSpaceName[0]]: value,
          [valueSpaceName[1]]: label
        }
      });
    } else {
      dispatch && dispatch({
        type: `${nameSpace}/save`,
        payload: {
          departmentId: value,
          departmentName: label
        }
      });
    }

    // 传给父组件
    // https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
    this.props.onChange(value, label, extra);
  };
  render() {
    const { treeData } = this.state;
    const { dropdownStyle, style } = this.props;
    const dataTreeSimpleMode = {
      id: 'id',
      pId: 'pId',
      rootPId: 0
    };
    const operationalDepartment = {
      showCheckedStrategy: SHOW_PARENT,
      treeData,
      onChange: this.onChange,
      placeholder: '请选择',
      treeDataSimpleMode: dataTreeSimpleMode,
      loadData: this.onLoadData,
      dropdownStyle: dropdownStyle || { maxHeight: 200, overflow: 'auto' },
      style: style || { width: 202 },
    };

    return (
      <TreeSelect {...operationalDepartment} value={this.props.value} />
    );
  }
}
export default TreeSelectComptent;
