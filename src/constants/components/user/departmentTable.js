const { Popconfirm } = window.antd;

const createColumns = ({ edit, remove, queryMember }) => {
  return [
    {
      title: '当前部门',
      dataIndex: 'a',
      className: 'table-center'
    },
    {
      title: '上级部门',
      dataIndex: 'b',
      className: 'table-center'
    },
    {
      title: '部门负责人',
      dataIndex: 'c',
      className: 'table-center'
    },
    {
      title: '部门成员数',
      dataIndex: 'd',
      className: 'table-center',
      render: (n, r) => {
        return <a onClick={() => {queryMember({ id: r.id });}} href="javascript:;">{n}</a>;
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      className: 'table-center',
      render: (o, r) => {
        return (
          <div>
            <Popconfirm title="确定删除？" onConfirm={() => {remove({ id: r.id });}}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
            <a
              href="javascript:;"
              onClick={() => {edit({ id: r.id });}}
            >编辑</a>
          </div>
        );
      }
    },
  ];
};

export { createColumns };
