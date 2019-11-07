import { INTERVAL_STAMP } from 'constants/system/meetingRoomReserve';
import moment from 'moment';
import { delay } from 'dva/saga';

const { message } = window.antd;

export default {
  namespace: 'meetingRoomReserve',

  state: {
    list: [],
    searchData: {
      reserve: T.date.format(new Date(), 'yyyy-MM-dd')
    },
    reserveData: {}, // 预约数据
    showModal: false, // 显示预约弹窗
  },

  effects: {
    *search({ payload }, { call, put }) {
      try {
        const data = yield call(T.post, '/system/meetingRoomReserveQuery.json', payload);
        let {
          meetingRoomConfigList = [],
          meetingRoomReserveSimpleList = [],
          userIdAndNickNameMap = {}
        } = data;
        let { reserve } = payload;
        const dayStramp = T.date.toDate(reserve).getTime(); // 今日的时间戳
        const isToday = moment(reserve).isSame(new Date(), 'day');

        let expireIdx;
        if (isToday) { // 今日过期时间间隔
          const endIdx = Math.ceil((Date.now() - dayStramp) / INTERVAL_STAMP) - 1;
          expireIdx = {
            startIdx: 0,
            endIdx,
            isExpire: true
          };
        }

        // 重组包含已预订间隔字段
        const list = meetingRoomConfigList.map(i => {
          const matchItems = meetingRoomReserveSimpleList.filter(
            j => j.meetingRoomConfigId === i.id
          );
          let reservedIdxArr = matchItems.map(k => {
            const { gmtStart, gmtEnd, reserveUserId, purpose } = k;
            const startIdx = Math.ceil((gmtStart - dayStramp) / INTERVAL_STAMP);
            const endIdx = Math.ceil((gmtEnd - dayStramp) / INTERVAL_STAMP) - 1;
            return {
              startIdx,
              endIdx,
              isSelf: CONFIG.userId === reserveUserId,
              nickName: userIdAndNickNameMap[reserveUserId],
              purpose
            };
          });
          expireIdx && reservedIdxArr.push(expireIdx);
          return {
            ...i,
            reservedIdxArr,
          };
        });

        yield put({ type: 'updateList', payload: list });
        yield put({ type: 'searchData', payload });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *submitReserve({ payload }, { call, select, put }) {
      try {
        const reserveData = yield select(state => state.meetingRoomReserve.reserveData);
        const gmtStart = reserveData.gmtStart + ':00';
        const gmtEnd = reserveData.gmtEnd + ':00';
        yield call(T.post, '/system/meetingRoomReserveCreate.json', {       ...payload,
          ...reserveData,
          gmtStart,
          gmtEnd
        });
        message.success('预约成功');
        const reserve = reserveData.gmtReserve;
        yield put({ type: 'reserveSuc' });
        yield put({
          type: 'search',
          payload: { reserve }
        });
      } catch (err) {
        T.showErrorMessage(err);
        yield delay(500);
        T.refresh();
      }
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    searchData(state, { payload }) {
      return { ...state, searchData: payload };
    },
    updateList(state, { payload }) {
      return { ...state, list: payload };
    },
    showModal(state) {
      return { ...state, showModal: true };
    },
    hideModal(state) {
      return {
        ...state,
        showModal: false,
        reserveData: {},
        list: JSON.parse(JSON.stringify(state.list))
      };
    },
    reserveSuc(state) { // 预约成功
      return {
        ...state,
        showModal: false,
        reserveData: {}
      };
    },
    doReserve(state, { payload }) {
      return { ...state, showModal: true, reserveData: payload };
    }
  }
};
