// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2023 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
/**
 * 布局配置
 * */
import screenfull from 'screenfull';
import { integralGetOrdes } from '@/api/marketing';

// function today () {
//     const end = new Date();
//     const start = new Date();
//     var datetimeStart = start.getFullYear() + '/' + (start.getMonth() + 1) + '/' + start.getDate();
//     var datetimeEnd = end.getFullYear() + '/' + (end.getMonth() + 1) + '/' + end.getDate();
//     return [datetimeStart, datetimeEnd];
// }
export default {
  namespaced: true,
  state: {
    orderStatus: '', // 订单الحالة
    // orderTime: today().join('-'), // 订单الوقت
    orderTime: '',
    orderNum: '',
    orderType: 0, // 订单الحالة
    fieldKey: '',
    orderChartType: {},
    isDels: false,
    delIdList: [],
    iconsaaaa: '',
    orderPayType: '',
    // modelLists: function
  },
  mutations: {
    /**
     * @description 设置设备类型
     * @param {Object} state vuex state
     * @param {String} type 设备类型，可选值为 Mobile、Tablet、Desktop
     */

    /**
     * @description 订单号بحث
     */
    getOrderStatus(state, orderStatus) {
      state.orderStatus = orderStatus;
    },

    /**
     * @description 订单الحالةبحث
     */
    getOrderType(state, orderPayType) {
      state.orderPayType = orderPayType;
    },

    /**
     * @description الوقتالحالة
     */
    getOrderTime(state, orderTime) {
      state.orderTime = orderTime;
    },

    /**
     * @description 订单选择الحالة
     */
    getOrderNum(state, orderNum) {
      state.orderNum = orderNum;
    },

    getfieldKey(state, fieldKey) {
      state.fieldKey = fieldKey;
    },

    /**
     * @description tab切换，选择订单الحالة
     */
    onChangeTabs(state, orderType) {
      state.orderType = orderType;
    },

    /**
     * @description  订单الحالة 全部对象
     */
    onChangeChart(state, orderChartType) {
      state.orderChartType = orderChartType;
    },

    /**
     * @description  是否批量حذف订单
     */
    getIsDel(state, isDels) {
      state.isDels = isDels;
    },

    /**
     * @description  批量حذف订单的id集合
     */
    getisDelIdListl(state, delIdList) {
      state.delIdList = delIdList;
    },
  },
  actions: {
    /**
     * @description 订单الحالة
     */
    getOrderTabs({ commit }, data) {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    },
    /**
     * @description 初始化监听全屏الحالة
     */
    listenFullscreen({ commit }) {
      return new Promise((resolve) => {
        if (screenfull.enabled) {
          screenfull.on('change', () => {
            if (!screenfull.isFullscreen) {
              commit('setFullscreen', false);
            }
          });
        }
        // end
        resolve();
      });
    },
    /**
     * @description 切换全屏
     */
    toggleFullscreen({ commit }) {
      return new Promise((resolve) => {
        if (screenfull.isFullscreen) {
          screenfull.exit();
          commit('setFullscreen', false);
        } else {
          screenfull.request();
          commit('setFullscreen', true);
        }
        // end
        resolve();
      });
    },
  },
};
