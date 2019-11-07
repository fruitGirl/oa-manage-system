/*
 * @Description: 个人-用户信息查询
 * @Author: danding
 * @Date: 2019-02-15 18:24:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-09 10:46:08
 */
export default {
  namespace: 'userPersonalHomePageQuery',

  state: {
    list: [], // 搜索结果列表
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      try {
        const res = yield call(T.post, '/user/userPersonalHomePageQuery.json', payload);
        const { userList, deptIdAndCompanyNameDeptName, userIdAndDeptIdMap } = res;
        const list = userList
          ? userList.map(i => {
              const descArr = deptIdAndCompanyNameDeptName[userIdAndDeptIdMap[i.userId]];
              const descStr = descArr.split('-');
              return { ...i, department: descStr[1], company: descStr[0] };
            })
          : [];
        yield put({ type: 'updateList', payload: list });
      } catch (err) {
        T.showError(err);
      }
    }
  },

  reducers: {
    updateList(state, { payload }) {
      return { ...state, list: payload };
    }
  }
};
