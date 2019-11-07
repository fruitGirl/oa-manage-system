export const columns = () => {
  return [
    {
      title: '姓名',
      dataIndex: 'operator',
      className: 'table-center',
      width: 80
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      className: 'table-center',
      width: 160,
      render(t) {
        return t || '-';
      }
    },
    {
      title: '状态',
      dataIndex: 'action',
      className: 'table-center',
      width: 160,
      render(t) {
        return t.message || '-';
      }
    },
    {
      title: '团队',
      dataIndex: 'teamName',
      className: 'table-center',
      width: 120,
      render(t) {
        return t || '-';
      }
    },
    {
      title: '简评或者打回',
      dataIndex: 'content',
      className: 'table-center',
      render(t, row) {
        let content = '-';
        if (!t) return content;
        // 打回显示"打回原因:"  简评显示"确认简评："
        const TEAM_PERFORMANCE_REFUSE = 'TEAM_PERFORMANCE_REFUSE'; // 打回状态
        if (row.action.name === TEAM_PERFORMANCE_REFUSE) {
          content = `打回原因: ${t}`;
        } else {
          content = `确认简评: ${t}`;
        }
        return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
      }
    }
  ];
};