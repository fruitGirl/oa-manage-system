export const createColumns = () => {
  return [
    {
      title: '考核年度',
      dataIndex: 'year'
    },
    {
      title: '考核季度',
      dataIndex: 'timeRange',
      render(t) {
        return t || '-';
      }
    },
    {
      title: '考核名称',
      dataIndex: 'name'
    },
    {
      title: '考核类型',
      dataIndex: 'performanceTypeCode'
    },
    {
      title: '部门',
      dataIndex: 'departmentName'
    },
    {
      title: '考核对象',
      dataIndex: 'nickName'
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModified'
    },
    {
      title: '版本',
      dataIndex: 'objectTypeMsg'
    },
    {
      title: '当前阶段',
      dataIndex: 'statusMsg'
    },
    {
      title: '上级评分',
      dataIndex: 'superiorScore',
      className: 'text-center'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const { href } = record;
        return (
          <div>
            <a href={href}>{text}</a>
          </div>
        );
      }
    }
  ];
};
