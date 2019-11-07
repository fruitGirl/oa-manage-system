
const createColumns = ({ remind, queryMember }) => {
  return [
    {
      title: '日期',
      dataIndex: 'a',
      className: 'table-center'
    },
    {
      title: '花名',
      dataIndex: 'b',
      className: 'table-center'
    },
    {
      title: '状态',
      dataIndex: 'c',
      className: 'table-center'
    },
    {
      title: '提交时间',
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
        const { id } = r;
        return (
          <div>
            <a href="">查看</a>
            <a href="javascript:;" onClick={() => {remind({id});}}>戳一戳</a>
          </div>
        );
      }
    },
  ];
};

export { createColumns };
