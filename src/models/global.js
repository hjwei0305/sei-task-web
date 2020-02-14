import router from "umi/router";
import { stringify } from "qs";
import { message } from "antd";
import { userUtils, eventBus } from '@/utils';
import { login, getAuthorizedFeatures } from "@/services/api";

const {
  clearUserInfo,
  getCurrentLocale,
  setCurrentLocale,
  setCurrentUser,
  setSessionId,
  getCurrentUser,
  setCurrentAuth,
  setCurrentPolicy,
} = userUtils;

const locale = getCurrentLocale() || 'zh-CN';

export default {
  namespace: "global",
  state: {
    showTenant: false,
    userAuthLoaded: false,
    locationPathName: "/",
    locationQuery: {},
    locale: locale,
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: "updateState",
          payload: {
            locationPathName: location.pathname,
            locationQuery: location.query
          }
        });
      });
    },
    eventBusListenter({ dispatch, }) {
      eventBus.addListener('redirectLogin', _ => {
        dispatch({
          type: 'redirectLogin',
        })
      });
    }
  },
  effects: {
    * redirectLogin({ payload }, { call, put, select }) {
      const global = yield select(_ => _.global);
      const { locationPathName, locationQuery } = global;
      let location = locationPathName;
      if (location.indexOf("/user/login") !== -1) {
        location = locationQuery.from || "/";
      }
      router.replace({
        pathname: "/user/login",
        search: stringify({
          from: location
        })
      });
    },
    * login({ payload }, { call, select }) {
      const { locationQuery } = yield select(_ => _.global);
      const res = yield call(login, payload);
      const { success, data, message: msg } = res || {};
      const { loginStatus, authorityPolicy, sessionId, } = data || {};
      message.destroy();
      clearUserInfo();
      if (success && loginStatus === 'success') {
        message.success("登录成功");
        setCurrentUser(data);
        setSessionId(sessionId);
        setCurrentPolicy(authorityPolicy);
        const { from } = locationQuery;
        if (from && from.indexOf("/user/login") === -1) {
          if (from === "/") {
            router.push("/dashboard");
          }
          else {
            router.push(from);
          }
        } else {
          router.push("/");
        }
      } else {
        message.error(msg);
      }
      return res;
    },
    * getUserFeatures(_, { call }) {
      const user = getCurrentUser();
      const result = yield call(getAuthorizedFeatures, user.userId);
      if (result && result.success) {
        setCurrentAuth(result.data);
      }
    },
    * changeLocale({ payload }, { put, select }) {
      const { locale } = payload;
      const { locationQuery } = yield select(_ => _.global);
      setCurrentLocale(locale);
      yield put({
        type: 'updateState',
        payload: {
          locale
        }
      });
      router.replace({
        pathname: "/user/login",
        search: stringify({
          from: locationQuery.from
        })
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
