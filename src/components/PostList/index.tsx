import React from 'react'
import { history, Link } from 'umi'
import ProList from '@ant-design/pro-list'
import queryString from 'query-string'
import IconText from '../../components/PostList/IconText'
import { Avatar, Divider, Skeleton, Space, Tag } from 'antd'
import { EyeFilled, StarFilled, LikeFilled, MessageFilled } from '@ant-design/icons'
import dayjs from '@/utils/dayjs'
import './index.less'

type Iprops = {
  loading?: boolean,
  dataSource?: TYPE.Article[],
  header?: boolean
}
const PostList: React.FC<Iprops> = ({ loading, dataSource, header = true }) => {
  const { query = {} } = history.location
  return (
    <section className="mainarea">
      <Skeleton active loading={loading} style={{ padding: 10 }}>
        <ProList<TYPE.Article>
          headerTitle={
            header ? <Space split={<Divider type="vertical" />}>
              <Link
                style={query.sort ? {} : { color: '#1890ff' }}
                to={`${history.location.pathname}?${queryString.stringify({ ...query, sort: 'default' })}`}
              >
                综合
              </Link>
              <Link
                style={query.sort === 'newest' ? { color: '#1890ff' } : {}}
                to={`${history.location.pathname}?${queryString.stringify({ ...query, sort: 'newest' })}`}
              >
                最新
              </Link>
              <Link
                style={query.sort === 'hotest' ? { color: '#1890ff' } : {}}
                to={`${history.location.pathname}?${queryString.stringify({ ...query, sort: 'hotest' })}`}
              >
                最热
              </Link>
            </Space> : false
          }
          itemLayout="vertical"
          rowKey="_id"
          split={true}
          size="large"
          dataSource={dataSource}
          metas={{
            title: {
              render(_, article) {
                return <h3>{article.title}</h3>
              }
            },
            subTitle: {
              render: (_, article) => {
                return (
                  <Space split={<Divider type="vertical" />}>
                    <Avatar size="small" src={article.author?.avatar} />
                    <span className="subtitle">
                      {
                        <a target="_blank" href={`/coder/${article.author?.userId}`}>
                          {article.author?.username}
                        </a>
                      }
                    </span>
                    <span className="subtitle">
                      {article.tags?.map(tag => {
                        return (
                          <Tag
                            key={tag.tag_name}
                            color={tag.tag_color}
                          >
                            {tag.tag_name}
                          </Tag>
                        )
                      })}
                    </span>
                    <span className="subtitle">{dayjs(article.create_time).fromNow()}</span>
                  </Space>
                )
              }
            },
            actions: {
              render: (_, article) => [
                <IconText
                  icon={EyeFilled}
                  key="list-vertical-view-o"
                  num={article.view}
                />,
                <IconText
                  icon={StarFilled}
                  type={2}
                  array={article.collects}
                  articleId={article.articleId}
                  key="list-vertical-star-o"
                />,
                <IconText
                  icon={LikeFilled}
                  type={1}
                  articleId={article.articleId}
                  array={article.likes}
                  key="list-vertical-like-o"
                />,
                <a
                  className="list-comment"
                  key="list-vertical-comment"
                  href={`/post/${article.articleId}#comment`}
                >
                  <MessageFilled />
                  <span>{article.comments?.length}</span>
                </a>
              ],
            },
            extra: {
              render: (_: any, article: TYPE.Article) => {
                return (
                  article.cover_url
                    ? <img
                      loading="lazy"
                      width={120}
                      alt="封面"
                      src={article.cover_url}
                    />
                    : ''
                )
              }
            },
            content: {
              render: (_, article) => {
                return <div className='article-description'>
                  <a target="_blank" href={`/post/${article.articleId}`}>{article.description}</a>
                </div>
              },
            },
          }}
        />
      </Skeleton>
    </section>
  )
}
export default PostList
