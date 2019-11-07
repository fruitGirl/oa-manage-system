/*
 * @Description: 首页
 * @Author: danding
 * @Date: 2019-04-15 16:48:04
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-30 14:41:20
 */

export default {
  namespace: 'index',

  state: {
    swiperData: [], // 轮播数据源
    enterLinks: [], // 快捷入口列表
    selectedMenu: {}, // 选择的文章栏目
    menuData: [], // 栏目数据
    noticeList: [], // 当前展示的文章列表
  },

  effects: {
    *getMenu({ payload }, { call, put }) {
      try {
        const data = yield call(T.get,'/system/indexChannelQuery.json');
        const { channelList = [] } = data;
        let menu = channelList;
        menu = menu.map(i => {
          return {
            label: i.title,
            value: i.id
          };
        });
        const selectedMenu = (menu && menu.length) ? menu[0] : {};
        yield put({
          type: 'getNoticeList',
          payload: selectedMenu
        });
        yield put({ type: 'menuInfo', payload: menu });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *getSwiper({ payload }, { call, put }) {
      try {
        const data = yield call(
          T.get,
          '/system/indexCarouselInfoQuery.json'
        );
        const { carouselInfoList } = data;
        yield put({ type: 'swiperData', payload: carouselInfoList });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *getEnterLinks({ payload }, { call, put }) {
      try {
        const data = yield call(
          T.get,
          '/system/quickEntryConfigQueryForIndex.json'
        );
        const { queryResult = [] } = data;
        yield put({ type: 'enterLinks', payload: queryResult });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *getNoticeList({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/system/channelInfoQuery.json', {
          channelId: payload.value,
          more: false
        });
        let { infoList = [] } = data;
        infoList.length = 4;
        yield put({ type: 'shiftMenu', payload: payload });
        yield put({ type: 'noticeList', payload: infoList });
      } catch(err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    shiftMenu(state, { payload }) {
      return { ...state, selectedMenu: payload };
    },
    menuInfo(state, { payload }) {
      return { ...state, menuData: payload };
    },
    swiperData(state, { payload }) {
      return { ...state, swiperData: payload };
    },
    noticeList(state, { payload }) {
      return { ...state, noticeList: payload };
    },
    enterLinks(state, { payload }) {
      return { ...state, enterLinks: payload };
    }
  }
};
