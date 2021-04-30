import {get} from '@/utils/request/request'

const API = '/major/store/';

// 根据serviceId查询store
export const findStoreByServiceId = (serviceId, pageNo, pageSize, order, sort) => get(API + 'findByServiceId/' + serviceId + '?pageNo=' + pageNo + '&pageSize=' + pageSize + '&order=' + order + '&sort=' + sort);

// 查询热门store
export const findPopularStore = (quantity) => get(API + 'rank?quantity=' + quantity);

// 根据id查询store
export const findStoreById = (id) => get(API + 'findById/' + id);

// 根据categoryId查询商店
export const findByCategoryId = (categoryId) => get(API + 'findByCategoryId/' + categoryId);