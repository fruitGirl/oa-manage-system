const createColumns = ({ edit }) => {
  return [
    {
      title: '会议室名称',
      dataIndex: 'name',
      className: 'table-center'
    },
    {
      title: '地点',
      dataIndex: 'location',
      className: 'table-center'
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      className: 'table-center'
    },
    {
      title: '是否可预约',
      dataIndex: 'reserved',
      className: 'table-center',
      render: (r) => {
        return r ? '可预约' : '不可预约';
      }
    },
    {
      title: '是否有效',
      dataIndex: 'enabled',
      className: 'table-center',
      render: (e) => {
        return e ? '有效' : '无效';
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      className: 'table-center',
      render: (o, r) => {
        return (
          <a
            href="javascript:;"
            onClick={() => {edit({ id: r.id });}}
          >修改</a>
        );
      }
    },
  ];
};

export { createColumns };
