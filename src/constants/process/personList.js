// 公司树结构接口
export const URL_COMPANY_DATA = '/user/allCompanyTreeQuery.json';

// 部门树结构接口
export const URL_DEPARTMENT_DATA = '/user/allDepartmentTreeQuery.json?companyId=';


// 人员分类查询列
export const PERSON_COLOUMN = [
  {
    title: '花名',
    dataIndex: 'nickName',
  },
  {
    title: '所在部门',
    dataIndex: 'departmentName',
  },
  {
    title: '公司',
    dataIndex: 'companyShortName',
  }
];
