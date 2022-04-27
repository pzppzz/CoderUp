// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取当前的用户 POST /api/currentUser */
//获取当前用户
export function getCurrentUser(type: 'simple' | 'detail' = 'simple') {
  return request<{ user: TYPE.CurrentUser }>
    ('/api/user/getCurrentUser', {
      method: 'POST',
      data: {
        type
      }
    }
    )
}
//获取用户信息
export function getUserProfile(userId: string) {
  return request<TYPE.ResponseResult<TYPE.User>>
    ('/api/user/profile', {
      method: 'POST',
      data: {
        userId
      }
    }
    )
}

/** 登录接口 POST /api/login/account */
export function login(body: TYPE.LoginParams, options?: { [key: string]: any }) {
  return request<TYPE.LoginResult>
    ('/api/user/login', {
      method: 'POST',
      data: body,
      ...(options || {}),
    });
}
/** 注册接口 */
export function register(body: TYPE.RegisterParam, options?: { [key: string]: any }) {
  return request<
    Omit<TYPE.LoginResult, 'token'>
  >('/api/user/register', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
/** 删除用户 */
export function deleteUser(_id: string, isDelete: boolean) {
  return request<
    TYPE.ResponseResult
  >('/api/user/deleteUser', {
    method: 'POST',
    data: {
      _id,
      isDelete
    }
  })
}
/** 更新信息 */
export function updateUser(user: TYPE.User) {
  return request<TYPE.ResponseResult>
    ('/api/user/update', {
      method: 'POST',
      data: {
        ...user
      }
    })
}
/** 获取用户列表 */
export function getUserList(body: TYPE.Pagination) {
  return request<TYPE.ListResult<TYPE.User>>
    ('/api/user/userlist', {
      method: 'POST',
      data: body
    })
}

/** 关注取消关注 */
export function followUser(followId: string, cancel: boolean) {
  return request<TYPE.ResponseResult>(
    '/api/user/follow', {
      method: 'POST',
      data: {
        followId,
        cancel
      }
    }
  )
}
export type CardData = {
  all_articles?: number;
  all_collects?: number;
  all_comments?: number;
  all_likes?: number;
  all_views?: number;
  page_view?: number;
}
/** 获取卡片数据 */
export function getCardData() {
  return request<TYPE.ResponseResult<CardData>>(
    '/api/user/card', {
    method: 'POST'
  }
  )
}
/** 获取图表数据 */
export function getChartsData() {
  return request<TYPE.ResponseResult<any>>(
    '/api/user/charts', {
    method: 'POST'
  }
  )
}