import { utils } from 'seid';

const { NODE_ENV, MOCK } = process.env;

const { CONST_GLOBAL } = utils.constants;

const getBaseUrl = function () {
  if (NODE_ENV !== 'production') {
    if (MOCK === 'yes') {
      return '/mocker.api'
    } else {
      return '/service.api'
    }
  }
  return GATEWAY_CONTEXTPATH;
}

export { CONST_GLOBAL };

export const AUTH_SERVER_PATH = '/sei-auth';

export const TASK_SERVER_PATH = '/sei-task';

export const GATEWAY_CONTEXTPATH = '/sei-gateway';

export const BASE_URL = getBaseUrl();
