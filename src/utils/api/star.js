import {del, get, post} from '@/utils/request/request'

const API = '/major/star/';

export const star = (params) => post(API + 'insert', params);

export const unStar = (params) => del(API + 'delete', params);

export const findStarByStore = (pageNo, pageSize) => get(API + 'findByStore?pageNo=' + pageNo + '&pageSize=' + pageSize);

export const findStarByProduct = (pageNo, pageSize) => get(API + 'findByProduct?pageNo=' + pageNo + '&pageSize=' + pageSize);

export const isStarByStoreId = (storeId) => get(API + 'isStarByStoreId/' + storeId);

export const isStarByProductId = (productId) => get(API + 'isStarByProductId/' + productId);