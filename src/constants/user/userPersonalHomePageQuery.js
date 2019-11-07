// 表格列配置
export const COLUMNS = [
  {
    title: '花名',
    dataIndex: 'nickName',
    className: 'table-center',
    render: (n, r) => {
      return <a href={`${CONFIG.frontPath}/user/userHomePage.htm?userId=${r.userId}`}>{ n }</a>;
    }
  },
  {
    title: '姓名',
    dataIndex: 'realName',
    className: 'table-center'
  },
  {
    title: '工号',
    dataIndex: 'jobNumber',
    className: 'table-center'
  },
  {
    title: '公司',
    dataIndex: 'company',
    className: 'table-center'
  },
  {
    title: '部门',
    dataIndex: 'department',
    className: 'table-center'
  }
];
