// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function getFakeCaptcha(params, options) {
  return request('/api/login/captcha', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
