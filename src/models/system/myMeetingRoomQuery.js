import { EVEN_RESERVE, EVEN_END, } from 'constants/components/system/statusNav';

export default {
  namespace: 'myMeetingRoomQuery',

  state: {
    activeNavVal: EVEN_RESERVE, // 当前选中的顶部切换状态
    list: [],
    paginator: {}
  },

  effects: {
    *shiftNav({ payload }, { call, put }) {
      // eslint-disable-line
      try {
        let config = {};
        if (payload === EVEN_END) {
          const data = yield call(
            T.get,
            '/system/myMeetingRoomReserveQuery.json',
            { currentPage: 1 }
          );
          const {
            meetingRoomReservePageQueryResult,
            meetingRoomConfigList
          } = data;
          const {
            meetingRoomReservesList,
            paginator
          } = meetingRoomReservePageQueryResult;
          config = {
            meetingRoomReserveList: meetingRoomReservesList,
            meetingRoomConfigList
          };
          yield put({ type: 'updatePaginator', payload: paginator });
        } else {
          config = CONFIG;
          yield put({ type: 'updatePaginator', payload: {} });
        }
        yield put({ type: 'resolveData', payload: config });
        yield put({ type: 'changeNav', payload });
      } catch(err) {
        T.showErrorMessage(err);
      }
    },
    *getList({ payload }, { call, put }) {
      try {
        const data = yield call(
          T.get,
          '/system/myMeetingRoomReserveQuery.json',
          payload
        );
        const {
          meetingRoomReservePageQueryResult,
          meetingRoomConfigList
        } = data;
        const { meetingRoomReservesList } = meetingRoomReservePageQueryResult;
        yield put({
          type: 'updatePaginator',
          payload: meetingRoomReservePageQueryResult.paginator
        });
        yield put({
          type: 'resolveData',
          payload: {
            meetingRoomConfigList,
            meetingRoomReserveList: meetingRoomReservesList,
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *cancelReserve({ payload }, { call, put }) {
      try {
        yield call(
          T.post,
          '/system/meetingRoomReserveCancel.json',
          payload
        );
        T.refresh();
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *endReserve({ payload }, { call, put }) {
      try {
        yield call(
          T.post,
          '/system/meetingRoomReserveFinish.json',
          payload
        );
        T.refresh();
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    resolveData(state, { payload }) {
      let { meetingRoomReserveList, meetingRoomConfigList } = payload;
      meetingRoomReserveList = meetingRoomReserveList.map(i => {
        const matchItem = meetingRoomConfigList.find(j => j.id === i.meetingRoomConfigId) || {};
        const { name, location } = matchItem;
        return {
          ...i,
          name,
          location
        };
      });
      return {
        ...state,
        list: meetingRoomReserveList
      };
    },
    changeNav(state, { payload }) {
      return { ...state, activeNavVal: payload };
    },
    updatePaginator(state, { payload }) {
      return { ...state, paginator: payload };
    }
  }
};
