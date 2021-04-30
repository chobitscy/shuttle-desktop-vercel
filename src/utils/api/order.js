import {get, post, del} from '@/utils/request/request'

const API = '/orders/';

// 添加订单
export const insertOrder = (order, config, isExpired) => post(API + '/insert' + "?isExpired=" + isExpired, order, config);

// 根据oderId删除订单
export const deleteOrder = (oderId, config) => del(API + 'delete', oderId, config);

// 修改订单
export const updateOrder = (order) => post(API + 'update', order);

// 查询全部的已接订单
export const findAllCompleted = (pageNo) => get(API + 'findAll?completed=0&?pageNo=' + pageNo);

// 根据userId查询所有已下单的订单
export const findByCidOrOrder = (userId, pageNo, pageSize) => get(API + 'findByCidOrOrder/' + userId + '?pageNo=' + pageNo + '&pageSize=' + pageSize);

// 根据userId查询所有配送中的订单
export const findByCidOrPresent = (userId, pageNo, pageSize) => get(API + 'findByCidOrPresent/' + userId + '?pageNo=' + pageNo + '&pageSize=' + pageSize);

// 根据userId查询所有已完成的订单
export const findByCidOrCompleted = (userId, pageNo, pageSize) => get(API + 'findByCidOrCompleted/' + userId + '?pageNo=' + pageNo + '&pageSize=' + pageSize);

// 根据条件搜索cid全部的订单
export const searchByCid = (userId, pageNo, pageSize, start, end, productId, serverId, status) => get(
    API + 'searchByCid/' + userId + '?pageNo=' + pageNo + '&pageSize=' + pageSize + "&start=" + start +
    '&end=' + end + '&productId=' + productId + '&serverId=' + serverId + '&status=' + status);

// 接单
export const Receive = (param) => post(API + 'receive', param);

// 根据条件搜索全部未接单的订单
export const searchByReceive = (userId, pageNo, pageSize, start, end, serviceId, address) => get(
    API + 'searchByReceive/' + '?pageNo=' + pageNo + '&pageSize=' + pageSize + "&start=" + start +
    '&end=' + end + '&serviceId=' + serviceId + '&address=' + address);

// 查询全部的待接订单
export const findByReceive = (pageNo) => get(API + 'findByReceive?pageNo=' + pageNo);

// 查询用户已完成的订单
export const findBySidOrCompleted = (userId, pageNo, pageSize) => get(API + 'findBySidOrCompleted/' + userId + '?pageNo=' + pageNo + '&pageSize=' + pageSize);

// 查询用户配送中的订单
export const findBySidOrPresent = (userId, pageNo, pageSize) => get(API + 'findBySidOrPresent/' + userId + '?pageNo=' + pageNo + '&pageSize=' + pageSize);

// 完成订单
export const complete = (order) => post(API + 'completed', order);