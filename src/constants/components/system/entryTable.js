const { Tooltip } = window.antd;

const createColumns = ({ editEntry }) => {
  return [
    {
      title: '入口名称',
      dataIndex: 'entryName',
      className: 'table-center'
    },
    {
      title: 'URL',
      dataIndex: 'entryUrl',
      className: 'table-center',
      width: 220,
      render(u) {
        return (
          <Tooltip title={u}>
            <div className="ellipsis">{u}</div>
          </Tooltip>
        );
      }
    },
    {
      title: '排序值',
      dataIndex: 'orderNumber',
      className: 'table-center'
    },
    {
      title: '打开新页面',
      dataIndex: 'openNewPage',
      className: 'table-center',
      render: (o) => {
        return o ? '是' : '否';
      }
    },
    {
      title: '有效性',
      dataIndex: 'enabled',
      className: 'table-center',
      render: (e) => {
        return e ? '有效' : '无效';
      }
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      className: 'table-center'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      className: 'table-center',
      render: (o, r) => {
        return (
        <a
          href="javascript:;"
          onClick={() => editEntry({ id: r.id })}
        >修改</a>
        );
      }
    },
  ];
};

export { createColumns };
