import request from '@/utils/request'


// 获取活动列表数据
export function getCfgList(activity) {
  return request({
    // url: `/cfg/${activity}`,
    url:'/api/getSchemaList.json',
    method: 'get',

  })
}

// 获取活动模板列表数据
export function getCfgTmplList(activity) {
  return request({
    // url: `/cfg/cfg-tmpl/${activity}`,
    url:'/api/getCfgTmplTaskTable.json',
    method: 'get',
  })
}


