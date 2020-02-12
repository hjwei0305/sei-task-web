/*
* @Author: zp
* @Date:   2020-02-12 13:10:25
* @Last Modified by:   zp
* @Last Modified time: 2020-02-12 20:50:55
*/
import { addJob, saveJob, delJob, pauseJob, rescheduleJob, resumeJob, triggerJob, } from "./service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;
const scheduleJob = {
  pauseJob,
  rescheduleJob,
  resumeJob,
  triggerJob,
};
export default modelExtend(model, {
  namespace: "job",

  state: {
    currJobData: null,
    currScheData: null,
  },
  effects: {
    * addJob({ payload }, { call, put }) {
      const re = yield call(addJob, payload);
      message.destroy();
      if (re.success) {
        message.success("成功添加作业到调度器中");
      } else {
        message.error(re.message);
      }
      return re;
    },
    * saveJob({ payload }, { call, put }) {
      const re = yield call(saveJob, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.save-success", defaultMessage: "保存成功" }));
      } else {
        message.error(re.message);
      }
      return re;
    },
    * delJob({ payload }, { call, put }) {
      const re = yield call(delJob, payload);
      message.destroy();
      if (re.success) {
        message.success("删除成功");
      } else {
        message.error(re.message);
      }
      return re;
    },
    * scheduleJob({ payload }, { call, put }) {
      const re = yield call(scheduleJob[payload.scheduleType], payload.id);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      return re;
    },
  }
});
