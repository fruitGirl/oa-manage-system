const { message } = window.antd;

export default {
  namespace: 'meetingRoomManage',

  state: {
    list: [],
    showModal: false, // 显示编辑会议室弹窗
    searchData: {}, // 检索条件
    roomData: {}, // 单个会议室的记录
    isSearched: false, // 是否执行过查询功能
  },

  effects: {
    *getList({ payload }, { call, put }) {
      // eslint-disable-line
      try {
        const data = yield call(T.post, '/system/meetingRoomConfigQuery.json', payload);
        const { queryResult = [] } = data;
        yield put({ type: 'updateList', payload: queryResult });
        yield put({ type: 'saveSearchData', payload });
        yield put({ type: 'isSearched' });
      } catch(err) {
        T.showErrorMessage(err);
      }
    },
    *submit({ payload }, { call, put, select }) {
      try {
        const url = payload.id
          ? '/system/meetingRoomConfigModify.json'
          : '/system/meetingRoomConfigCreate.json';
        yield call(T.post, url, payload);
        message.success('保存成功');
        yield put({ type: 'hideModal' });
        const searchData = yield select(state => state.meetingRoomManage.searchData);
        yield put({ type: 'getList', payload: searchData });
        yield put({ type: 'roomData', payload: {} });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *edit({ payload }, { call, put }) {
      try {
        yield put({ type: 'showModal' });
        const data = yield call(T.get, '/system/meetingRoomConfigQueryById.json', payload);
        const { meetingRoomConfig = {} } = data;
        yield put({ type: 'roomData', payload: meetingRoomConfig });
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    saveSearchData(state, { payload }) {
      return { ...state, searchData: payload };
    },
    showModal(state) {
      return { ...state, showModal: true };
    },
    hideModal(state) {
      return { ...state, showModal: false, roomData: {} };
    },
    updateList(state, { payload }) {
      return { ...state, list: payload };
    },
    roomData(state, { payload }) {
      return { ...state, roomData: payload };
    },
    isSearched(state) {
      return { ...state, isSearched: true };
    }
  }
};
