export const createColumns = ({ editTeam }) => {
  return [
    {
      title: '团队名称',
      dataIndex: 'name',
      className: 'table-center'
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      className: 'table-center'
    },
    {
      title: '是否有效',
      dataIndex: 'enabled',
      className: 'table-center',
      render: (e) => {
        return e ? '有效' : <span style={{color: 'red'}}>无效</span>;
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      className: 'table-center',
      render: (o, row) => {
        return <a href="javascript:;" onClick={() => editTeam({id: row.id})}>编辑</a>;
      }
    }
  ];
};

