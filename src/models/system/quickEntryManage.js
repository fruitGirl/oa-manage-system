const { message } = window.antd;

export default {
  namespace: 'quickEntryManage',

  state: {
    paginator: {},
    list: [],
    showModal: false, // 是否显示入口编辑弹窗
    searchData: { currentPage: 1 },
    entryItemMsg: {}, // 当前查看的快捷入口信息
    isSearched: false, // 是否执行过查询操作
  },

  effects: {
    *submit({ payload }, { call, put, select }) {
      try {
        const url = payload.id
          ? '/system/quickEntryConfigModify.json'
          : '/system/quickEntryConfigCreate.json';
        yield call(T.post, url, payload);
        message.success('操作成功');
        const searchData = yield select(state => state.quickEntryManage.searchData);
        yield put({ type: 'hideModal' });
        yield put({ type: 'getList', payload: searchData });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *getList({ payload }, { call, put }) {
      try {
        const data = yield call(
          T.post,
          '/system/quickEntryConfigQuery.json',
          payload
        );
        const { list = [], paginator = {} } = data.queryResult;
        yield put({
          type: 'updateList',
          payload: {
            list: list,
            paginator,
            searchData: payload
          }
        });
        yield put({ type: 'isSearched' });
      } catch(err) {
        T.showErrorMessage(err);
      }
    },
    *editEntry({ payload }, { call, put }) {
      try {
        yield put({ type: 'showModal' });
        const data = yield call(T.get, '/system/quickEntryConfigQueryById.json', payload);
        const { resourceId } = data.quickEntryConfig;
        data.quickEntryConfig.files = [{
          url: `/system/quickEntryImage.resource?resourceId=${resourceId}`
        }];
        yield put({ type: 'entryItemMsg', payload: data.quickEntryConfig });
      } catch(err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    showModal(state) {
      return { ...state, showModal: true };
    },
    hideModal(state) {
      return {
        ...state,
        showModal: false,
        entryItemMsg: {}
      };
    },
    updateList(state, { payload }) {
      return { ...state, ...payload };
    },
    entryItemMsg(state, { payload }) {
      return { ...state, entryItemMsg: payload };
    },
    isSearched(state) {
      return { ...state, isSearched: true };
    }
  }
};
