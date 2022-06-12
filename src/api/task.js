import request from '@/utils/request'

export function getModelFromData(data) {
  // 获取端游任务模板渲染表单数据
  return request({
    url: '/cfg/schema/task',
    method: 'get',
    data
  })
}

export function onSubmitModelFromData(data) { // 提交端游表单任务模板数据
  return request({
    url: '/cfg/schema/task',
    method: 'put',
    data
  })
}

export function createNumValModel(id, data) { // 创建端游配置数值模板
  return request({
    url: `/cfg/cfg-tmpl/task/${id}`,
    method: 'post',
    id,
    data
  })
}
export function commitNumValModel(id, data) { // 提交端游配置数值模板
  return request({
    url: `/cfg/cfg-tmpl/task/${id}`,
    method: 'put',
    id,
    data
  })
}
export function getTaskById(id) { // 获取端游表单任务数据
  return request({
    url: `/cfg/task/${id}`,
    method: 'get'

  })
}

export function createTaskById(id, data) { // 提交端游表单任务数据
  return request({
    url: `/cfg/task/${id}`,
    method: 'post',
    data
  })
}

export function commitTaskById(id, data) { // 提交端游表单任务数据
  return request({
    url: `/cfg/task/${id}`,
    method: 'put',
    data
  })
}

export function getNumValModel(id) { // 获取端游数值模板渲染数据
  return request({
    url: `/cfg/cfg-tmpl/task/${id}`,
    method: 'get'

  })
}

export function createMobileTask(params) { // 获取手游任务模板渲染数据
  return request({
    url: 'http://10.32.96.61:3457/qsm/schema/ProprietaryAVehicle',
    method: 'get',
    params
  })
}

export function getMobileTaskModelData(params) { // 获取手游A车活动任务模板渲染数据
  return request({
    url: 'http://10.32.96.61:3456/qsm/schema/AVehicleFreeExperience',
    method: 'get',
    params
  })
}

export function getNewTaskProcessAct(params) { // 获取手游新任务进度活动模板渲染数据
  return request({
    url: 'http://10.32.96.61:3456/qsm/schema/NewTaskProcessAct',
    method: 'get',
    params
  })
}

export function getEditTaskValData(params) { // 获取A车活动手游编辑任务数据
  return request({
    url: 'http://10.32.96.61:3457/qsm/data/AVehicleFreeExperience/2?branch=trunk',
    method: 'get',
    params
  })
}

export function getEditNewTaskProcessActVal(id, params) { // 获取手游新任务进度编辑任务数据
  return request({
    url: `http://10.32.96.61:3456/qsm/data/NewTaskProcessAct/${id}`,
    method: 'get',
    params
  })
}

export function createNewTaskProcessActById(id, params, data) { // 提交手游新任务进度新增任务数据
  return request({
    url: `http://10.32.96.61:3456/qsm/data/NewTaskProcessAct/${id}`,
    method: 'post',
    params,
    data
  })
}

export function commitNewTaskProcessActById(id, params, data) { // 提交手游新任务进度编辑任务数据
  return request({
    url: `http://10.32.96.61:3456/qsm/data/NewTaskProcessAct/${id}`,
    method: 'put',
    params,
    data
  })
}

export function onSubmitActiveModelCfgData(params, data) { // 提交端游表单任务模板数据
  return request({
    url: 'http://10.32.96.61:3456/qsm/schema/NewTaskProcessAct',
    method: 'put',
    params,
    data
  })
}

export function getDetailTaskId(params) { // 获取手游查看任务数据
  return request({
    url: 'http://10.32.96.61:3457/qsm/data/AVehicleFreeExperience/2?branch=trunk',
    method: 'get',
    params
  })
}
