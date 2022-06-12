
import axios from "axios";

import { getToken } from "@/utils/auth";
/**
 * 创建 axios 实例
 */
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量base接口地址 url = base url + request url
  withCredentials: true, // 跨域请求时发送Cookie
  timeout: 60000, // 请求超时
  headers: {
    "Content-Type": "application/json;q=1.0,*/*;q=0.1",
  },
});
 
/**
 * 全局 请求拦截器, 支持添加多个拦截器
 * 例如: 配置token、添加一些默认的参数
 * `return config` 继续发送请求
 */
service.interceptors.request.use(
  (config) => {
    // 设置Token
    getToken() && (config.headers["X-Token"] = getToken());
 
    return config;
  },
  (error) => {
    // 做一些请求错误
    console.error(error);
    return Promise.reject(error);
  }
);
 
/**
 * 全局 响应拦截器, 支持添加多个拦截器
 * 例如: 根据状态码选择性拦截、过滤转换数据
 * @param {Object} res 请求返回的数据
 * @return {Promise<reject>}
 */
service.interceptors.response.use(
  async (res) => {
    const { data, status } = res;
 
    try {
      return await handleCode({ data, status});
    } catch (err) {
      return Promise.reject(err);
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);
 
/**
 * 处理 HTTP 状态码
 * @param data {Object} 请求返回的数据
 * @param status {String} HTTP状态码
 * @param rHeader {Object} 响应头
 * @returns {Promise<never>|*}
 */
function handleCode({ data, status}) {
  const STATUS = {
    "200"() {
      return data;
    },
    "400"() {
      return Promise.reject(new Error("请求错误"));
    },
    "401"() {
      return Promise.reject(new Error("请求未授权"));
    },
    "403"() {
      return Promise.reject(new Error("拒绝请求"));
    },
    "500"() {
      return Promise.reject(new Error("服务器错误"));
    },
  };
  // 有状态码但不在这个封装的配置里，就直接返回错误
  return STATUS[status]
    ? STATUS[status]()
    : Promise.reject(new Error(data.data || "请求错误"));
}
 
export { service as axios };
