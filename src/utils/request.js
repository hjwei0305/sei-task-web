import { utils } from 'seid';
import { BASE_URL, } from './constants.js';

const { request } = utils;

request.defaults.baseURL = BASE_URL;

export default request;
