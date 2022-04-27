import request from "@/utils/request";
export type TagType = {
  _id?: string,
  tid?: string,
  tag_name?: string,
  tag_color?: string,
  article_count?: number
}
export type Result = {
  code: number,
  msg: string,
  data?: TagType[],
  total?: number
}
export function addTag(tag: TagType) {
  return request<Result>(
    '/api/tag/addTag',
    {
      method: 'POST',
      data: tag
    })
}
export function deleteTag(_id: string) {
  return request<Result>(
    '/api/tag/deleteTag',
    {
      method: 'POST',
      data: {
        _id
      }
    }
  )
}

export function getTagList(param: {current?: number, pageSize?: number, tag_name?: string} = {}) {
  return request<Result>(
    '/api/tag/taglist',
    {
      method: 'POST',
      data: param
    }
  )
}