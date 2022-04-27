import request from "@/utils/request";
type HomeData = {
  user_total?: number,
  article_type? : {type?: string, article_count?: number}[],
  user_analysis?: {_id?: string, date?: string, count?: number}[]
}
export function getOpHomeData() {
  return request<TYPE.ResponseResult<HomeData>>(
    '/api/op/data', {
      method: 'POST'
    }
    )
}