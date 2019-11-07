/*
 * @Description: 流程-审批查询
 * @Author: qianqian
 * @Date: 2019-02-12 19:50:08
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-09 15:34:59
 */
export default {
  namespace: 'approvalQuery',

  state: {
    approvalLists: [], // 审批查询list
    paginators: {}
  },

  effects: {
     // 审批查询列表
     *getApprovalList({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/approvalQuery.json', payload);
        const { pageQueryResult } = res.outputParameters;
        const { list, paginator } = pageQueryResult;
        
        yield put({
          type: 'setApprovalList',
          payload: { list, paginator }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    // 审批查询列表
    setApprovalList(state, { payload }) {
      const { list, paginator } = payload;
      return { ...state, approvalLists: list, paginators: paginator };
    }
  }
};
