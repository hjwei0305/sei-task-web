import { utils } from 'seid';
import { formatMessage } from "umi-plugin-react/locale";
import { notification } from "antd";
import { BASE_URL, } from './constants.js';
import eventBus from './eventBus';
const { request } = utils;
const { NODE_ENV } = process.env;
request.defaults.baseURL = BASE_URL;

/** 添加拦截器跳401到登录页面 */
request.interceptors.response.use(res => res, err => {
  if (err.statusCode === 401) {
    if(NODE_ENV !== 'production') {
      eventBus.emit('redirectLogin');
    } else {
      /** 跳到主应用登录页面 */
      if (window.__portal__ && window.__portal__.eventBus) {
        window.__portal__.eventBus.emit('redirectLogin');
      }
    }

    notification.error({
      message: formatMessage({ id: "app.request.401", defaultMessage: "会话异常" }),
      description: formatMessage({ id: "app.request.401.message", defaultMessage: "当前会话超时或失效，请重新登录" })
    });
  }
  return err;
});

export default request;
