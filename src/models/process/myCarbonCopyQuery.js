/*
 * @Description: 我的抄送
 * @Author: moran 
 * @Date: 2019-09-18 10:55:55 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-09 15:35:22
 */

export default {
  namespace: 'myCarbonCopyQuery',

  state: {
    myCarbonCopyLists: [], // 我的抄送列表
    paginator: {}, // 分页数据
  },

  effects: {
    // 抄送列表
    *getMyCarbonCopy({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/myCarbonCopyQuery.json', payload);
        const { pageQueryResult } = res.outputParameters;
        const { list, paginator } = pageQueryResult;
        yield put({
          type: 'setMyCarbonCopyLists',
          payload: { list, paginator }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    // 抄送列表
    setMyCarbonCopyLists(state, { payload }) {
      const { list, paginator } = payload;
      return { ...state, myCarbonCopyLists: list, paginator };
    },
  }
};
