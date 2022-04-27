import request from "@/utils/request"


/** 创建文章  @param article */
export function createArticle(article: TYPE.Article) {
  return request<TYPE.ResponseResult<TYPE.Article>>(
    '/api/article/create', {
    method: 'POST',
    data: {
      ...article
    }
  }
  )
}

/** 更新文章 */
export function updateArticle(article: TYPE.Article | {reason?: string}) {
  return request<TYPE.ResponseResult<TYPE.Article>>(
    '/api/article/update', {
    method: 'POST',
    data: {
      ...article
    }
  }
  )
}

/** 删除文章信息 */
export function deleteArticle(articleId: string) {
  return request<TYPE.ResponseResult>(
    '/api/article/delete', {
    method: 'POST',
    data: {
      articleId
    }
  }
  )
}

/** 获取文章信息  @param articleId string */
export function getDetail(articleId: string) {
  return request<TYPE.ResponseResult<TYPE.Article>>(
    '/api/article/detail', {
    method: 'POST',
    data: {
      articleId
    }
  }
  )
}
type Query = {
  userId?: string;
  title?: string; //支持模糊
  type?: string;
  status?: number;
  tags?: string;
  sort?: string;
  isCollect?: boolean;
  isLike?: boolean;
  isFollow?: boolean
}
/** 获取文章*/
export function getPostList(
  query: Query,
  pagination: TYPE.Pagination = {}
) {
  return request<TYPE.ListResult<TYPE.Article>>(
    '/api/article/list', {
    method: 'POST',
    data: {
      ...query,
      ...pagination
    }
  }
  )
}

/** 推荐文章*/
export function getRecommendPost(
  query: Query,
  pagination: TYPE.Pagination = {}
) {
  return request<TYPE.ListResult<TYPE.Article>>(
    '/api/article/recommend', {
    method: 'POST',
    data: {
      ...query,
      ...pagination
    }
  }
  )
}

/** 点赞收藏 */
export function dispacthAction(
  actionType: 1 | 2,
  cancel: boolean,
  userId: string,
  articleId: string
) {
  return request<TYPE.ResponseResult>(
    '/api/article/action', {
      method: 'POST',
      data: {
        actionType,
        cancel,
        userId,
        articleId
      }
    }
  )
}
