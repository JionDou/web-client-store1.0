import request from '@/utils/request'

export function clientLogin(data) { // 端游登录
  return request({
    // url: '/cfg/router',
    url: '/api/router.json',
    method: 'get',
    data

  })
}

export function mobileLogin(data) { // 手游登录
  return request({
    // url: 'http://10.32.96.61:3457/qsm/main',
    url: '/api/mobileRouters.json',
    method: 'get',
    data
  })
}

