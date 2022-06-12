import request from '@/utils/request'



export function getSchemaList(query) {
  return request({
    url: '/cfg/task',
    method: 'get',
    params: query
  })
}



//端游任务模板库数值模板列表数据
export function getModelLibraryTableData(params) {
  return request({
    url: '/cfg/cfg-tmpl/task',
    method: 'get',
    params
  })
}


//手游专属A车活动表格数据
export function getMobileTableData(params) {
  return request({
    url: 'http://10.32.96.61:3456/qsm/data/ProprietaryAVehicle',
    method: 'get',
    params
  })
}

//手游新任务进度活动表格数据
export function getQSMNewTaskProcessAct(params) {
  return request({
    url: 'http://10.32.96.61:3456/qsm/data/NewTaskProcessAct',
    method: 'get',
    params
  })
}