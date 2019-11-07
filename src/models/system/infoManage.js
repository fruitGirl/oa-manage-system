const { message } = window.antd;

export default {
  namespace: 'infoManage',

  state: {
    paginator: {}, // 分页信息
    list: [], // 列表
    columnData: [], // 栏目数据
    searchData: {}, // 搜索条件数据
    selectedRowKeys: [], // 选择的列表主键
    selectedRows: [], // 选择的列表
    showPreview: false, // 显示预览弹窗
    previewData: {}, // 预览数据
    isSearched: false, // 是否执行过检索功能
  },

  effects: {
    *getColumnTree({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/system/infoTreeQuery.json');
        const { channelList = [] } = data;
        const columnData = channelList.map(i => {
          return {
            label: i.title,
            value: i.id
          };
        });
        yield put({ type: 'columnData', payload: columnData });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *getList({ payload }, { call, put }) {
      try {
        const data = yield call(T.post, '/system/infoPageQuery.json', payload);
        const { channelIdAndNameMap = {}, result = {}, userIdAndNickNameMap = {}, uvMap = {}, pvMap = {} } = data;
        let { list = [], paginator = {} } = result;
        list = list.map(i => {
          return {
            ...i,
            channelLabel: channelIdAndNameMap[i.channelId],
            creater: userIdAndNickNameMap[i.creater],
            author: userIdAndNickNameMap[i.author],
            pv: pvMap[i.id],
            uv: uvMap[i.id]
          };
        });
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
    *preview({ payload }, { call, put, select }) {
      try {
        const data = yield call(T.get, '/system/infoPreview.json', payload);
        const list = yield select(state => state.infoManage.list);
        const match = list.find(i => i.id === payload.id);
        const { info, content,  } = data;
        const { title, gmtCreate, attachments } = info;
        yield put({
          type: 'previewData',
          payload: {
            content,
            title,
            publishTime: gmtCreate,
            creater: match.creater,
            files: attachments
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *updatePublish({ payload }, { call, put, select, }) { // 发布/下架
      try {
        const { id, published } = payload;
        yield call(T.post, '/system/infoUpdatePublish.json', payload);
        message.success('操作成功');
        const list = yield select(state => state.infoManage.list);
        const matchIdx = list.findIndex(i => i.id === id);
        const gmtPublish = published
          ? T.date.format(new Date())
          : list[matchIdx].gmtPublish;
        list[matchIdx] = {
          ...list[matchIdx],
          published: published,
          gmtPublish
        };
        yield put({ type: 'updateList', payload: { list }});
        yield put({ type: 'recordRows', payload: {
          selectedRowKeys: [],
          selectedRows: []
        }});
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *remove({ payload }, { call, put, select }) {
      try {
        yield call(T.post, '/system/infoDelete.json', payload);
        let list = yield select(state => state.infoManage.list);
        message.success('删除成功');
        const matchIdx = list.findIndex(i => i.id === payload.id);
        list.splice(matchIdx, 1);
        yield put({ type: 'updateList', payload: { list }});
        yield put({ type: 'recordRows', payload: {
          selectedRowKeys: [],
          selectedRows: []
        }});
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *batchUpdatePublish({ payload }, { call, put, select }) { // 批量发布/下架
      try {
        yield call(T.post, '/system/infoBatchUpdatePublish.json', payload);
        const { published } = payload;
        let list = yield select(state => state.infoManage.list);
        list = list.map(i => {
          const gmtPublish = published
            ? T.date.format(new Date())
            : i.gmtPublish;
          return {
            ...i,
            published: payload.published,
            gmtPublish
          };
        });
        message.success('批量操作成功');
        yield put({ type: 'updateList', payload: { list }});
        yield put({ type: 'recordRows', payload: {
          selectedRowKeys: [],
          selectedRows: []
        }});
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    columnData(state, { payload }) {
      return { ...state, columnData: payload };
    },
    updateList(state, { payload }) {
      return { ...state, ...payload };
    },
    recordRows(state, { payload }) {
      return { ...state, ...payload };
    },
    hidePreview(state) {
      return { ...state, showPreview: false };
    },
    previewData(state, { payload }) {
      return { ...state, previewData: payload, showPreview: true };
    },
    isSearched(state) {
      return { ...state, isSearched: true };
    }
  }
};
