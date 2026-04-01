// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2023 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from '@/libs/request';

/**
 * @description 列表
 * @param {Object} param data {Object} 传值参数
 */
export function accountListApi(data) {
  return request({
    url: '/setting/system_out_account/index',
    method: 'get',
    params: data,
  });
}

/**
 * @description 对外账号 تعديلالحالة
 * @param {Object} param data {Object} 传值
 */
export function setShowApi(data) {
  return request({
    url: `setting/system_out_account/set_status/${data.id}/${data.status}`,
    method: 'PUT',
  });
}

/**
 * @description إضافة对外账号
 * @param {Object} param data {Object} 传值
 */
export function outSaveApi(data) {
  return request({
    url: `setting/system_out_account/save`,
    method: 'post',
    data,
  });
}

/**
 * @description تعديل对外账号
 * @param {Object} param id {Number} 账号ID
 * @param {Object} param data {Object} 传值
 */
export function outSavesApi(data) {
  return request({
    url: `setting/system_out_account/update/${data.id}`,
    method: 'post',
    data,
  });
}

/**
 * 对外账号设置推送
 * @param {*} id
 * @returns
 */
export function outSetUp(id) {
  return request({
    url: `setting/system_out_account/set_up/${id}`,
    method: 'get',
  });
}

/**
 * 对外接口列表
 */
export function interfaceList() {
  return request({
    url: `setting/system_out_interface/list`,
    method: 'get',
  });
}

/**
 * 设置推送信息
 * @param {*} data
 * @returns
 */
export function setUpPush(data) {
  return request({
    url: `setting/system_out_account/set_up/${data.id}`,
    method: 'put',
    data,
  });
}
/**
 * إضافة/تحرير接口
 * @param {*} data
 * @returns
 */
export function interfaceSave(data) {
  return request({
    url: `setting/system_out_interface/save/${data.id}`,
    method: 'post',
    data,
  });
}

/**
 * 接口信息تفاصيل
 * @param {*} data
 * @returns
 */
export function interfaceDet(id) {
  return request({
    url: `setting/system_out_interface/info/${id}`,
    method: 'get',
  });
}

/**
 * @description تعديلالاسم
 * @param {Object} data data {Object} 传值
 */
export function interfaceEditName(data) {
  return request({
    url: `setting/system_out_interface/edit_name`,
    method: 'PUT',
    data,
  });
}

/**
 * @description حذف
 */
export function interfaceDel(id) {
  return request({
    url: 'setting/system_out_interface/del/' + id,
    method: 'delete',
  });
}

/**
 * 接口信息تفاصيل
 * @param {*} data
 * @returns
 */
export function textOutUrl(data) {
  return request({
    url: `setting/system_out_account/text_out_url`,
    method: 'post',
    data,
  });
}
