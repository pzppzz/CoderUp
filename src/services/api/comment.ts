import request from "@/utils/request";


export type Comment = {
  _id: string;
  articleId?: string;
  commentId: string;
  content: string;
  create_time: Date;
  child_comments?: Comment[];
  author: TYPE.CurrentUser;
  reply_to_author?: TYPE.CurrentUser;
  reply_to_content?: string
}
/** 写评论 */
export function addComment(
  params: {
    parentId?: string,
    articleId?: string,
    author: string,
    content: string,
    reply_to_author?: string,
    reply_to_content?: string
  }
) {
  return request<TYPE.ResponseResult>(
    '/api/comment/reply',
    {
      method: 'POST',
      data: {
        ...params
      }
    }
  )
}

export function getCommentList(articleId?: string) {
  return request<TYPE.ResponseResult<Comment[]>>(
    '/api/comment/comment_list', {
    method: 'POST',
    data: {
      articleId
    }
  }
  )
}