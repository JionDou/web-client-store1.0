import request from '@/utils/request'


 // 获取活动表单数据
export function getSchema(activity) {
  return request({
    // url: `/cfg/schema/${activity}`,
    url:'/api/getSchema.json',
    method: 'get',

  })
}

export function onSubmitSchema(activity,data) { // 提交自定义表单任务模板数据
  return request({
    url: `/cfg/schema/${activity}`,
    method: 'put',
    data
  })
}


// 新增
export function createSchemaById(activity,id,data) {
  return request({
    url: `/cfg/${activity}/${id}`,
    method: 'post',
    id,
    data
  })
}

// 编辑
export function editSchemaById(activity,id,data) {
  return request({
    url: `/cfg/${activity}/${id}`,
    method: 'get',
    id,
    data
  })
}
// 提交
export function commitSchemaById(activity,id,data) {
  return request({
    url: `/cfg/${activity}/${id}`,
    method: 'put',
    id,
    data
  })
}

// 查看
export function viewSchemaById(activity,id) {
  return request({
    url: `/cfg/schema/${activity}/${id}`,
    method: 'get',
    id
  })
}

 // 获取活动表单模板数据
 export function getCfgTmpl(activity) {
  return request({
    url: `/cfg/cfg-tmpl/${activity}`,
    method: 'get',

  })
}

// 新增模板
export function createCfgTmplById(activity,id,data) {
  return request({
    url: `/cfg/cfg-tmpl/${activity}/${id}`,
    method: 'post',
    id,
    data
  })
}

// 编辑模板
export function editCfgTmplById(activity,id,data) {
  return request({
    url: `/cfg/cfg-tmpl/${activity}/${id}`,
    method: 'get',
    id,
    data
  })
}
// 提交模板
export function commitCfgTmplById(activity,id,data) {
  return request({
    url: `/cfg/cfg-tmpl/${activity}/${id}`,
    method: 'put',
    id,
    data
  })
}
// 查看模板
export function viewCfgTmplById(activity,id) {
  return request({
    url: `/cfg/cfg-tmpl/${activity}/${id}`,
    method: 'get',
    id
  })
}

