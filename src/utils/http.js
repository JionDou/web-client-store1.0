import { axios } from "@/utils/request";
 
/**
 * get 请求方式
 * @param url {String} 接口地址
 * @param params {Object} 接口参数
 * @returns {AxiosPromise}
 * @constructor
 */
export function Get(url, params) {
  return axios({
    url: url,
    method: "get",
    params,
  });
}
 
/**
 * post 请求方式
 * @param url {String} 接口地址
 * @param data {Object} 接口参数
 * @returns {AxiosPromise}
 * @constructor
 */
export function Post(url, data) {
  return axios({
    url: url,
    method: "post",
    data,
  });
}
 
/**
 * put 请求方式-用于修改全部数据
 * @param url {String} 接口地址
 * @param data {Object} 接口参数
 * @returns {AxiosPromise}
 * @constructor
 */
export function Put(url, data) {
  return axios({
    url: url,
    method: "put",
    data,
  });
}
 
/**
 * patch 请求方式-用于修改单项或多项数据
 * @param url {String} 接口地址
 * @param data {Object} 接口参数
 * @returns {AxiosPromise}
 * @constructor
 */
export function Patch(url, data) {
  return axios({
    url: url,
    method: "patch",
    data,
  });
}
 
/**
 * delete 请求方式
 * @param url {String} 接口地址
 * @param params {Object} 接口参数
 * @returns {AxiosPromise}
 */
export function Delete(url, params) {
  return axios({
    url: url,
    method: "delete",
    params,
  });
}

 
