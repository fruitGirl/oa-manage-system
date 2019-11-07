/*
 * @Description: 个人-用户主页
 * @Author: danding
 * @Date: 2019-02-15 18:24:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-01 18:54:27
 */

export default {
  namespace: 'userHomePage',

  state: {
    userInfo: {}, // 用户信息
    isQueryCell: false, // 是否查看过手机号
  },

  effects: {
    *getInfo({ payload }, { call, put }) { // 获取个人信息
      try {
        const res = yield call(T.post, '/user/userHomePage.json', payload);
        yield put({ type: 'updateInfo', payload: res });
      } catch (err) {
        T.showError(err);
      }
    },
    *queryCell({ payload }, { call, put, select, }) { // 查看手机号
      try {
        const userInfo = yield select(state => state.userHomePage.userInfo);
        const res = yield call(T.post, '/user/userPhoneQuery.json', { operateObjectId: userInfo.userId });
        yield put({ type: 'queryCellSuc', payload: res.cell });
      } catch (err) {
        T.showError(err);
      }
    }
  },

  reducers: {
    updateInfo(state, { payload }) { // 更新用户信息
      const {
        gmtBirthday,
        user,
        departmentName,
        jobLevelName,
        jobPositionName,
        userList,
        imageURL
      } = payload;
      const leaderArr = (userList && userList.length)
        ? userList.map(i => i.nickName)
        : [];
      const leader = leaderArr.join(',');
      const avatar = imageURL ? `http://${imageURL}` : '';
      return {
        ...state,
        userInfo: {
          ...user,
          departmentName,
          jobLevelName,
          jobPositionName,
          leader,
          gmtBirthday,
          imageURL: avatar
        }};
    },
    queryCellSuc(state, { payload }) { // 查看手机号成功
      return {
        ...state,
        isQueryCell: true,
        userInfo: {
          ...state.userInfo,
          cell: payload
        }
      };
    }
  }
};
