import {del, get, post} from '@/utils/request/request'

const API = '/major/comments/';

export const insertComments = (comments) => post(API + 'insert', comments);

export const updateComments = (comments) => post(API + 'update', comments);

export const findByStoreId = (storeId, pageNo, pageSize) => get(API + 'findByStoreId/' + storeId + '?pageNo=' + pageNo + '&pageSize=' + pageSize);

export const findByStoreIdAndId = (storeId, _id) => get(API + 'findByStoreId/' + storeId + '?_id=' + _id);

export const delComments = (comments) => del(API + 'delete', comments);