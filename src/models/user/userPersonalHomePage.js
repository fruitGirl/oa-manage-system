/*
 * @Description: 个人-个人主页
 * @Author: danding
 * @Date: 2019-02-15 18:24:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-09 10:42:29
 */

 // 本地回显图片
function readerFile(file) {
  return new Promise((resolve, reject) => {
    var _read = new FileReader();
    _read.readAsDataURL(file);
    _read.onload = function (e) {
      //图片上传成功
      // console.log(e.target.result)
      resolve(e.target.result);
    };
  });
}

const { message } = window.antd;

export default {
  namespace: 'userPersonalHomePage',

  state: {
    userInfo: {}, // 用户信息
    userTimeOff: {}, // 假期
    isQueryCell: false, // 是否查看过手机号
  },

  effects: {
    *getInfo({ payload }, { call, put }) {
      try {
        const res = yield call(T.post, '/user/userPersonalHomePage.json');
        yield put({ type: 'updateInfo', payload: res });
      } catch (err) {
        T.showError(err);
      }
    },
    *uploadAvatar({ payload }, { call, put, select, }) { // 上传图片
        const _val = payload.target.value.toLowerCase(); //把上传的图片格式变成小写
        if (!/\.(gif|jpg|jpeg|png)$/.test(_val)) {
          message.error('只支持JPG、PNG、GIF图片格式');
        } else {
          //可不可以上传
          var _canUpLoad = true;

          //如果支持\html5读取图片的体积
          if (payload.target.files) {
            const isLt5M = payload.target.files[0].size / 1024 / 1024 < 5;
            if (!isLt5M) {
              _canUpLoad = false;
              message.error('对不起！上传的图片大小不能超过5M！');
            }
          }
          //如果可以上传
          if (_canUpLoad) {
            //请求接口
            let formData = new FormData();
            const userInfo = yield select(state => state.userPersonalHomePage.userInfo);
            formData.append('userId', userInfo.userId);
            formData.append('imageContent', payload.target.files[0]);
            // 请求查询接口
            try {
              yield call(T.upload, '/user/modifyUserImage.json', formData);
              message.success('上传成功');
              if (typeof FileReader !== 'undefined') {
                const fileImg = yield readerFile(document.querySelector('#imageContent').files[0]);
                yield put({ type: 'uploadAvatarSuc', payload: fileImg });
              }
            } catch (err) {
              T.showError(err);
            }
          }
        }
    },
    *queryCell({ payload }, { call, put, select, }) {
      try {
        const userInfo = yield select(state => state.userPersonalHomePage.userInfo);
        const res = yield call(T.post, '/user/userPhoneQuery.json', { operateObjectId: userInfo.userId });
        yield put({ type: 'queryCellSuc', payload: res.cell });
      } catch (err) {
        T.showError(err);
      }
    }
  },

  reducers: {
    updateInfo(state, { payload }) {
      const {
        gmtBirthday,
        userTimeOff,
        user,
        departmentName,
        jobLevelName,
        jobPositionName,
        userList,
        imageURL
      } = payload;
      const leaderArr = (userList && userList.length)
        ? userList.map(i => i.nickName)
        : []; // 上级
      const leader = leaderArr.join('，');
      const avatar = imageURL ? `http://${imageURL}` : ''; // 图片

      return {
        ...state,
        userTimeOff,
        userInfo: {
          ...user,
          departmentName,
          jobLevelName,
          jobPositionName,
          leader,
          gmtBirthday,
          imageURL: avatar
        }
      };
    },
    uploadAvatarSuc(state, { payload }) {
      return { ...state, userInfo: { ...state.userInfo, imageURL: payload }};
    },
    queryCellSuc(state, { payload }) {
      return { ...state, isQueryCell: true, userInfo: { ...state.userInfo, cell: payload } };
    }
  }
};
