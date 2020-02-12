/*
* @Author: zp
* @Date:   2020-02-12 13:10:36
* @Last Modified by:   zp
* @Last Modified time: 2020-02-12 20:53:43
*/
import { request, constants } from '@/utils';

const { TASK_SERVER_PATH } = constants;

export const addJob = async(data) => {
  return request.post(`${TASK_SERVER_PATH}/job/addJob`, data);
}

export const saveJob = async(data) => {
  return request.post(`${TASK_SERVER_PATH}/job/save`, data);
}

export const delJob = async(id) => {
  return request.delete(`${TASK_SERVER_PATH}/job/save/${id}`);
}

/** 在调度器中暂停一个作业 */
export const pauseJob = async(id) => {
  return request.post(`${TASK_SERVER_PATH}/scheduleJob/pauseJob/${id}`);
}

/** 在调度器中更新作业的调度周期表达式 */
export const rescheduleJob = async(id) => {
  return request.post(`${TASK_SERVER_PATH}/scheduleJob/rescheduleJob/${id}`);
}

/** 在调度器中唤醒一个暂停的作业 */
export const resumeJob = async(id) => {
  return request.post(`${TASK_SERVER_PATH}/scheduleJob/resumeJob/${id}`);
}

/** 立即执行一个已经调度的作业 */
export const triggerJob = async(id) => {
  return request.post(`${TASK_SERVER_PATH}/scheduleJob/triggerJob/${id}`);
}

