/*
 * @Description: 发起审批入口
 * @Author: moran 
 * @Date: 2019-09-10 12:23:21 
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-19 17:01:38
 */
export default {
  namespace: 'processInit',

  state: {
    processInitLists: [], // 流程发起列表
  },

  effects: {
     // 流程发起列表
     *getProcessStartInit({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/processStartInit.json');
        const { processTypeInfos } = res.outputParameters;
        yield put({
          type: 'setProcessStartInit',
          payload: { processTypeInfos }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    // 流程发起列表
    setProcessStartInit(state, { payload }) {
      const { processTypeInfos } = payload;
      return { ...state, processInitLists: processTypeInfos };
    }
  }
};
