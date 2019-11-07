export default {
  namespace: 'departmentQuery',

  state: {
    list: [],
    isSearched: false,
    paginator: {},
    searchData: {},
    showDepaModal: false,
    editItem: {},
    showMemberModal: false,
    memberMsg: {}
  },

  effects: {
    *getList({ payload }, { call, put }) {
      try {
        const data = yield call(T.post, '', payload);
        const { result, } = data;
        let { list = [], paginator = {} } = result;
        yield put({ type: 'updateList', payload: {
          list,
          paginator,
          searchData: payload
        }});
        yield put({ type: 'isSearched' });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *queryMember({ payload }, { call, put }) {},
  },

  reducers: {
    isSearched(state) {
      return { ...state, isSearched: true };
    },
    updateList(state, { payload }) {
      return { ...state, ...payload };
    },
    showDepaModal(state) {
      return { ...state, showDepaModal: true };
    },
    hideDepaModal(state) {
      return { ...state, showDepaModal: false };
    },
    memeberMsg(state, { payload }) {
      return { ...state, showMemberModal: true, memberMsg: payload };
    },
    hideMemberModal(state) {
      return { ...state, showMemberModal: false };
    }
  }
};
