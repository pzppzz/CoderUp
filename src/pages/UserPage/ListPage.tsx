import React from 'react'
import PostList from '@/components/PostList'
import { history, useParams, useRequest } from 'umi'
import { getPostList } from '@/services/api/article'
const ListPage: React.FC = () => {
  const { userId } = useParams<any>()
  const { pathname } = history.location

  const { loading, data } = useRequest(() => {
    const ext = pathname.split('/').pop()
    return getPostList({
      userId,
      status: 1,
      isCollect: ext === 'collects',
      isLike: ext === 'likes',
      isFollow: ext === 'follows',
    })
  })
  return (
    <PostList header={false} loading={loading} dataSource={data} />
  )
}
export default ListPage
