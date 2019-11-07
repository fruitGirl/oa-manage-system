/*
 * @Description: 我的发起
 * @Author: moran 
 * @Date: 2019-09-18 10:21:40 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-11 17:48:13
 */

export default {
  namespace: 'myInitiateQuery',

  state: {
    myInitiateLists: [], // 我的发起列表
    paginator: {}, // 分页数据
    isShowRecallModal: false // 撤回弹窗显示
  },

  effects: {
    // 我的发起列表
    *getMyInitiate({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/myInitiateQuery.json', payload);
        const { pageQueryResult } = res.outputParameters;
        const { list, paginator } = pageQueryResult;
        yield put({
          type: 'setMyInitiateLists',
          payload: { list, paginator }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 撤回
    *recallProcess({ payload }, { call, put, select }) {
      try {
        const { processInstanceId, statusEnum, memo } = payload;
        yield call(T.post, '/process/processRecall.json', { processInstanceId, memo });
        let paginator = yield select(state => state.myInitiateQuery.paginator);
        yield put({ type: 'getMyInitiate', payload: { currentPage: paginator.page, statusEnum } });
        yield put({ type: 'displayRecallModal', payload: false });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    // 我的发起列表
    setMyInitiateLists(state, { payload }) {
      const { list, paginator } = payload;
      return { ...state, myInitiateLists: list, paginator };
    },

    // 撤回弹窗显示
    displayRecallModal(state, { payload }) {
      return { ...state, isShowRecallModal: payload };
    },
  }
};
