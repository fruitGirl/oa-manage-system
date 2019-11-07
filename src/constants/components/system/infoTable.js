const { Popconfirm } = window.antd;

const createColumns = ({ preview, updatePublish, edit, remove }) =>{
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      className: 'table-center'
    },
    {
      title: '栏目',
      dataIndex: 'channelLabel',
      className: 'table-center'
    },
    {
      title: '标题',
      dataIndex: 'title',
      className: 'table-center'
    },
    {
      title: '创建人',
      dataIndex: 'creater',
      className: 'table-center'
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      className: 'table-center'
    },
    {
      title: '发表人',
      dataIndex: 'author',
      className: 'table-center'
    },
    {
      title: '发表状态',
      dataIndex: 'published',
      className: 'table-center',
      render(p, r) {
        return p
          ? <span style={{color: '#13af13'}}>已发表</span>
          : '未发表';
      }
    },
    {
      title: '发表时间',
      dataIndex: 'gmtPublish',
      className: 'table-center',
      render: (t) => t || '-',
    },
    {
      title: '阅读量',
      dataIndex: 'pv',
      className: 'table-center',
      render: (p) => p || '-',
    },
    {
      title: '阅读人数',
      dataIndex: 'uv',
      className: 'table-center',
      render: (u) => u || '-',
    },
    {
      title: '排序值',
      dataIndex: 'orderValue',
      className: 'table-center'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      className: 'table-center',
      width: 120,
      render: (o, r) => {
        const { id, published, } = r;
        const params = { id };
        const showPublish = !published; // 显示发表操作
        const showUnshfit = published; // 显示下架操作
        return (
          <div className="operate">
            <a
              href="javascript:;"
              onClick={() => preview(params)}
            >预览</a>
            { showPublish
              ? <a
                href="javascript:;"
                onClick={() => updatePublish({
                  ...params,
                  published: true
                })}
              >发表</a>
              : null
            }
            { showUnshfit
              ? <a
                href="javascript:;"
                onClick={() => updatePublish({
                  ...params,
                  published: false
                })}
              >下架</a>
              : null
            }
            <a
              href="javascript:;"
              onClick={() => edit(r.id)}
            >编辑</a>
            <a href="javascript:;">
              <Popconfirm
                onConfirm={() => remove(params)}
                title="确定删除？"
              >
                删除
              </Popconfirm>
            </a>
          </div>
        );
      }
    },
  ];
};

export { createColumns };
