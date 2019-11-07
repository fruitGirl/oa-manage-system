// 创建列配置
export const createColumns = ({ lookDetail = () => {} }) => {
  return [
    {
      title: '标题',
      dataIndex: 'title',
      className: 'table-center'
    },
    {
      title: '发送时间',
      dataIndex: 'time',
      className: 'table-center'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      className: 'table-center',
      render: (o, r) => {
        return <a href="javascript:;" onClick={() => { lookDetail(r.id); }}>查看</a>;
      }
    }
  ];
};
