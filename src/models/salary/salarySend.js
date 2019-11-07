/*
 * @Description: 工具-工资条发放
 * @Author: danding
 * @Date: 2019-02-13 17:08:22
 * @Last Modified by: juyang
 * @Last Modified time: 2019-05-20 17:44:03
 */

import moment from 'moment';
import {
  UPLOAD_FILE_MODULE,
  CHECK_SALARY_MODULE,
  SALARY_LIST_MODULE
} from 'constants/salary/salarySend';
import { REAL_SALARY, } from 'constants/components/common/salarySend';
const { message } = window.antd;

export default {
  namespace: 'salarySend',

  state: {
    uploadFields: { // 上传工资excel
      gmtUpload: moment(), // 上传时间
      title: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月工资`, // 上传标题
      uploadWay: 'BY_NICK_NAME', // 上传方式
    },
    checkSalary: { // 审核工资条
      unexistList: [], // 导入失败列表
      paginator: {}, // 分页
      pageList: [], // 工资列表
      cacheKey: '', // 上传工资excel
      selectedColumn: REAL_SALARY, // 选择的实发工资列
    },
    showModule: UPLOAD_FILE_MODULE, // 显示的模块名
    salaryListObj: {}, // 工资列表记录
  },

  effects: {
    *uploadFile({ payload }, { call, put, select, }) { // 上传工资
      const uploadFields = yield select(state => state.salarySend.uploadFields);
      const { gmtUpload, title, uploadWay } = uploadFields;
      let formDate = new FormData();
      formDate.append('gmtUpload', gmtUpload.format('YYYY-MM-DD hh:mm:ss'));
      formDate.append('title', title);
      formDate.append('uploadWay', uploadWay);
      formDate.append('salaryExcel', payload);
      try {
        const res = yield call(T.upload, '/salary/salaryExcelUpload.json', formDate);
        const { unexistList, paginator, cacheKey, pageList, titleList } = res || {};
        const combineUnexistList = unexistList ? unexistList.map(i => ({ desc: i })) : [];
        const nextPayload =  { unexistList: combineUnexistList, paginator, cacheKey, pageList, titleList };
        yield put({ type: 'createCheckSalary', payload: nextPayload });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *changeCheckTablePage({ payload }, { call, put, select, }) { // 审核列表翻页
      try {
        const checkSalary = yield select(state => state.salarySend.checkSalary);
        const res = yield call(T.post, '/salary/salaryExcelPageQuery.json', {
          cacheKey: checkSalary.cacheKey,
          currentPage: payload
        });
        yield put({ type: 'updateCheckTableList', payload: res });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *saveSalary({ payload }, { call, put, select, }) { // 生成工资记录
      const salarySend= yield select(state => state.salarySend);
      const { uploadFields, checkSalary,  } = salarySend;
      const { gmtUpload, title, uploadWay } = uploadFields;
      const { selectedColumn, cacheKey } = checkSalary;
      try {
        const res = yield call(T.post, '/salary/userSalarySave.json', {
          gmtUpload: gmtUpload.format('YYYY-MM-DD hh:mm:ss'),
          title,
          uploadWay,
          realAmountFiled: selectedColumn,
          salaryVisibleFieldList: payload,
          cacheKey
        });
        T.tool.redirectTo(`${CONFIG.frontPath}/salary/salaryManage.htm?salaryBaseInfoId=${res.salaryBaseInfoId}&title=${window.btoa(encodeURIComponent(title))}`);
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *removeSalary({ payload }, { call, put, select, }) { // 删除工资
      try {
        yield call(T.post, '/salary/salaryDelete.json', { id: payload });
        message.success('删除成功');
        window.location.reload();
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    changeUploadField(state, { payload }) { // 修改上传工资字段
      if (payload.gmtUpload) {
        const title = `${moment(payload.gmtUpload).year()}年${moment(payload.gmtUpload).month() + 1}月工资`;
        payload.title = title;
      }
      return {
        ...state,
        uploadFields: {
          ...state.uploadFields,
          ...payload
        }
      };
    },
    createCheckSalary(state, { payload }) { // 审核工资列表
      return {
        ...state,
        showModule: CHECK_SALARY_MODULE,
        checkSalary: { ...state.checkSalary, ...payload}
      };
    },
    updateCheckTableList(state, { payload }) { // 审核工资列表翻页
      return {
        ...state,
        checkSalary: {
          ...state.checkSalary,
          pageList: payload.pageList,
          paginator: payload.paginator
        }
      };
    },
    switchModule(state, { payload }) { // 切换模块
      return { ...state, showModule: payload };
    },
    changeColumn(state, { payload }) { // 修改展示列
      return { ...state, checkSalary: { ...state.checkSalary, selectedColumn: payload } };
    },
    initPage(state, { payload }) { // 初始化页面参数，显示对应的模块
      const salaryLen = Object.keys(payload).length;
      const showModule = salaryLen ? SALARY_LIST_MODULE : UPLOAD_FILE_MODULE;
      return { ...state, showModule, salaryListObj: payload };
    }
  }
};
