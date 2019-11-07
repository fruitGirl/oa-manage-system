/*
 * @Description: 团队配置
 * @Author: danding
 * @Date: 2019-07-09 10:17:48
 * @Last Modified by: danding
 * @Last Modified time: 2019-07-10 18:43:56
 */
const { message } = window.antd;

// 筛选部门树，递归删选children,且第一级无法选择
function combineDepartmentData(data = [], count = 0) {
  return data.map(i => {
    const { name, id, directSubDepartment = [] } = i;
    let nextCount = count + 1;
    const children = combineDepartmentData(directSubDepartment, nextCount);
    return {
      title: name,
      value: id,
      key: id,
      children,
      selectable: (count !== 0), // 第一级部门不能选择
    };
  });
}

export default {
  namespace: 'teamQuery',

  state: {
    list: [], // 列表
    showModal: false, // 显示弹框
    paginator: {},
    editTeamMsg: {}, // 存储的编辑团队信息
    departmentData: [], // 部门数据
    defaultUser: [], // 默认的负责人下拉
  },

  effects: {
    *getList({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/user/teamQuery.json', payload);
        const { queryResult = {}, userIdAndNickNameMap = {} } = res.outputParameters;
        const { paginator, list = [] } = queryResult;
        const combineList = list.map(i => {
          return {
            ...i,
            manager: userIdAndNickNameMap[i.manager]
          };
        });
        yield put({
          type: 'updateList',
          payload: { list: combineList, paginator }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 保存团队信息
    *saveTeamConfig({ payload }, { call, put, select }) {
      try {
        const { editTeamMsg, paginator } = yield select(state => state.teamQuery);
        const { id } = editTeamMsg;
        const url = editTeamMsg.id ? '/user/teamModify.json' : '/user/teamCreate.json';
        const params = { ...payload, id };
        yield call(T.post, url, params);
        const { page } = paginator;
        message.success('保存成功');
        yield put({ type: 'getList', payload: { currentPage: page || 1 }});
        yield put({ type: 'displayModal', payload: false });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取团队信息
    *getTeamDetail({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/user/teamModifyInit.json', payload);
        const { team,  manager } = data.outputParameters;
        const { nickName, userId } = manager;
        const defaultUser = [{ label: nickName, value: userId }];
        yield put({
          type: 'setTeamDetail',
          payload: {
            defaultUser,
            teamMsg: team
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取部门树
    *getDepartments({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/user/teamDepartmentTreeQuery.json');
        const { companySimpleList } = data.outputParameters;

        // 重组部门树的数据结构
        const departmentData = companySimpleList.map(i => {
          const { shortName, id, directDepartment = [] } = i;
          const children = combineDepartmentData(directDepartment);
          return {
            title: shortName,
            value: id,
            key: id,
            selectable: false, // 不可选择
            children
          };
        });
        yield put({ type: 'setDepartments', payload: departmentData });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    updateList(state, { payload }) {
      const { paginator, list } = payload;
      return { ...state, paginator, list };
    },

    // 展示团队弹窗
    displayModal(state, { payload }) {
      return {
        ...state,
        showModal: payload,
        editTeamMsg: payload ? state.editTeamMsg : {}, // 弹窗隐藏，重置存储的团队信息
        defaultUser: payload ? state.defaultUser : [], // 弹窗隐藏，重置存储的默认负责人信息
      };
    },
    setDepartments(state, { payload }) {
      return { ...state, departmentData: payload };
    },

    // 存储团队详情信息
    setTeamDetail(state, { payload }) {
      const { teamMsg, defaultUser } = payload;
      return { ...state, editTeamMsg: teamMsg, defaultUser };
    },
  }
};
