import request from "@/utils/request";
export type Notice = {
  _id?: string,
  content?: string,
  userId?: string,
  create_time?: string,
  isRead?: boolean
}
export function getNotices(userId: string) {
  return request<TYPE.ResponseResult<Notice[]>>(
    '/api/notice', {
      method: 'POST',
      data: {
        userId
      }
    }
  )
}
export function deleteNotices(userId: string) {
  return request<TYPE.ResponseResult>(
    '/api/notice/delete', {
      method: 'POST',
      data: {
        userId
      }
    }
  )
}