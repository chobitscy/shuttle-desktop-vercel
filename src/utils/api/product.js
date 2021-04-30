import {get, post} from '@/utils/request/request'

const API = '/major/product/';

// 根据storeId查询products
export const findProductsByStoreId = (storeId) => get(API + 'findByStoreId/' + storeId);

// 根据storeId查询products（分页）
export const findProductsByStoreIdByPagination = (storeId, pageNo, pageSize) => get(API + 'findByStoreIdByPagination/' + storeId + '?pageNo=' + pageNo + '&pageSize=' + pageSize);

// 排行榜
export const findPopularProduct = (quantity) => get(API + 'rank?quantity=' + quantity);

// 搜索
export const searchProduct = (keywords) => get(API + 'search/' + keywords);
export const review = (params) => post(API + 'review', params);