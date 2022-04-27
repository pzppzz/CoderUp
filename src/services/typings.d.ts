// @ts-ignore
/* eslint-disable */


declare namespace TYPE {
  /** 统一返回结果结构 */
  type ResponseResult<T = null> = {
    code: number;
    data?: T;
    msg: string;
    [key: string]: any;
  }
  /** 获取多条数据返回结果 */
  type ListResult<T> = Pick<ResponseResult, 'code' | 'msg'> & {
    data?: T[];
    total: number;
  }
  /** 用户 */
  type User  = CurrentUser & {
    tel?: string;
    email?: string;
    got_views?: number;
    got_likes?: number;
    all_articles?: number;
    got_followers?: number;
    followed_count?: number;
    isFollowed?: boolean
  }
  /** 当前用户 */
  type CurrentUser = {
    _id?: string;
    userId?: string;
    avatar?: string;
    username?: string;
    sex?: number;
    introduction?: string;
    interest?: string;
    status?: number;
    authority?: string;
    create_time?: Date;
    unReadCount?: number;
    last_logintime?: Date
  }
  /** 注册参数 */
  type RegisterParam = {
    username: string;
    password: string;
    confirmPassword: string
  }
  /** 登录结果 */
  type LoginResult = {
    code?: number;
    data?: CurrentUser;
    msg?: string;
    token?: string
  }
  /** 登录参数 */
  type LoginParams = {
    username?: string;
    password?: string;
  };

  /** 分页参数 */
  type Pagination = {
    current?: number;
    pageSize?: number;
    [property: string]: any;
  }

  /** 文章参数 */
  type Article = {
    _id?: string,
    articleId?: string,
    userId?: string,
    type?: string, //文章分类
    title?: string,
    description?: string,
    cover_url?: string,
    html_content?: string,
    // mark_content,
    view?: number, //阅读数
    likes?: string[], //点赞
    comments?: string[], //评论
    collects?: string[], //收藏
    tags?: {tag_name: string, tag_color: string}[], //文章标签
    status?: number, //-1未通过 0未审阅 1通过已发布 2草稿箱
    author?: User
    create_time?: Date
  }
}