import { request, constants } from "@/utils";

const { AUTH_SERVER_PATH } = constants;

/** 登录*/
export async function login(params) {
  const url = `${AUTH_SERVER_PATH}/auth/login`;
  return request({
    url,
    method: "POST",
    headers: {
      needToken: false,
    },
    data: params,
  });
}

/** 退出*/
export async function logout(params) {
  const url = `${AUTH_SERVER_PATH}/auth/logout`;
  return request({
    url,
    method: "POST",
    headers: {
      needToken: false,
    },
    data: params,
  });
}

