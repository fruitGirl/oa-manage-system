const { message } = window.antd;

export const COLUMNS = [
  {
    title: '考核年度',
    dataIndex: 'year'
  },
  {
    title: '考核季度',
    dataIndex: 'timeRange'
  },
  {
    title: '考核名称',
    dataIndex: 'name'
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
      return <a href="javascript:;" onClick={() => {
        if (record.hasReadRole) { // 访问权限
          window.open(record.href);
        } else {
          message.warning('权限不足');
        }
      }}>查看</a>;
    }
  }
];

// 团队和用户的tab切换key
export const USER_TAB_KEY = 'user';
export const TEAM_TAB_KEY = 'team';

// 公司和部门下拉接口
export const URL_COMPANY_DATA = '/performance/userPerformanceAuthCompanyQuery.json';
export const URL_DEPARTMENT_DATA = '/performance/userPerformanceAuthDepartmentQuery.json?companyId=';
