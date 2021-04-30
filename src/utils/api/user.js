import {get, post} from '@/utils/request/request'

const API = '/user/';

// 登录
export const Login = (params) => post(API + 'login', params);

// 注册
export const Register = (params) => post(API + 'register', params);

// 重置密码
export const reset = (params) => post(API + 'resetPassword', params);

// 检查
export const check = () => get(API + 'check');

// 更新用户资料
export const update = (params) => post(API + 'update', params);

// 充值
export const Recharge = (params) => post(API + 'recharge', params);

export const findScore = (params) => get(API + 'findSore/' + params);

export const sendEmail = (params) => post(API + 'sendEmail', params);

export const forget = (params) => post(API + 'forget', params);
