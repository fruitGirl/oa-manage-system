const { Popconfirm } = window.antd;

export const createColumns = ({ handleDelete }) => {
  return [
    {
      title: '执行要点',
      dataIndex: 'content',
      editable: true,
      type: 'textarea', // 输入控件类型
      width: '60%',
      textWrap: 'word-break',
      rules: [ // 规则
        {
          required: true,
          message: `请输入执行要点`,
          whitespace: true
        },
      ],
      componentProps: { // 输入控件属性
        maxLength: 100,
        placeholder: `1.问题梳理（比如：新人业务不熟悉，需花大量时间进行业务指导）2.解决途径（比如：调研新人入职遇到的问题点）`,
        autosize: { minRows: 3 }
      },
      render(t) {
        return t
          ? <span dangerouslySetInnerHTML={{ __html: T.return2Br(t) }}></span>
          : <span style={{color: '#d8d3d3'}}>请输入执行要点</span>;
      }
    },
    {
      title: '执行人员',
      dataIndex: 'userIds',
      editable: true,
      type: 'select', // 输入控件类型
      textWrap: 'word-break',
      rules: [ // 规则
        {
          required: true,
          message: `请选择执行人员`,
        },
      ],
      componentProps: { // 输入控件属性
        placeholder: '请选择',
        dataProvider: CONFIG.userList || [],
        mode: 'multiple',
        optionFilterProp: 'children'
      },
      render: (u) => {
        u = u || [];
        let selectUser = u.map(i => {
          const matchItem = CONFIG.userList.find(j => {
            return j.value == i; // eslint-disable-line
          });
          return matchItem ? matchItem.label : '';
        });
        selectUser = selectUser.filter(i => i);
        selectUser = (selectUser && selectUser.length)
          ? selectUser.join('，')
          : '';
        return selectUser || <span style={{color: '#d8d3d3'}}>请选择</span>;
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      align: 'center',
      render: (text, record) =>
        (
          <Popconfirm title="删除?" onConfirm={() => handleDelete(record)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        )
    },
  ];
};

