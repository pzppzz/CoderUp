import request from "@/utils/request";

export function getSearchRes(param: {sort?: string, keyword?: string, page?: number, type?: string}) {
  return request<TYPE.ResponseResult<any[]>>(
    '/api/search', {
      method: 'POST',
      data: {
        ...param
      }
    }
  )
}