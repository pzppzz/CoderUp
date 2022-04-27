import React, { useEffect, useRef, useState } from 'react'
import { history, Redirect, useParams } from 'umi'
import dayjs from '@/utils/dayjs'
import { Anchor, Avatar, Card, Skeleton, Tag } from 'antd'
import { getDetail, getRecommendPost } from '@/services/api/article'
import { EyeFilled, LikeFilled, MessageFilled, StarFilled } from '@ant-design/icons'
import CommentList from './components/CommentList'
import IconText from '@/components/PostList/IconText'
import PostList from '@/components/PostList'
import styles from './index.less'

const Headers = ['H1', 'H2', 'H3']

const PostDetail: React.FC = () => {
  const [article, setArticle] = useState<TYPE.Article>()
  const [recommendList, setRecommendList] = useState<TYPE.Article[]>([])
  const [directory, setDirectory] = useState
    <{ index: number; name: string, level: number }[]>([])
  const {articleId} = useParams<any>()
  const article_content = useRef<HTMLDivElement>(null)

  /** 相关推荐 */
  async function getRecommendList() {
    if ((document.documentElement.scrollTop + window.innerHeight) >=
      document.documentElement.scrollHeight) {
      const res = await getRecommendPost(
        { status: 1, type: article?.type },
        { current: Math.ceil(recommendList.length / 10) + 1 })
      if (res.code) {
        setRecommendList([...recommendList, ...res.data || []])
      }
    }
  }
  // 目录生成
  useEffect(() => {
    if (article_content.current?.children) {
      let directory: { index: number; name: string, level: number }[] = [], index = 1
      Array.prototype.forEach.call(article_content.current.children, (child: Element) => {
        if (Headers.includes(child.nodeName)) {
          directory.push({ index, name: child.innerHTML, level: Headers.indexOf(child.nodeName) })
          child.setAttribute('id', `heading-${index++}`)
        }
      })
      setDirectory(directory)
    }
  }, [article])
  useEffect(() => {
    // 加载文章
    getDetail(articleId)
      .then(res => {
        if (res.code) {
          setArticle(res.data)
        } else {
          history.replace('/404')
        }
      })

  }, [])
  useEffect(() => {
    // 滚动事件
    if (article) {
      document.addEventListener('scroll', getRecommendList)
    }
    return () => {
      document.removeEventListener('scroll', getRecommendList)
    }
  }, [article, recommendList])
  if (!articleId) {
    return <Redirect to={'/404'} />
  }
  return (
    <div className={styles.wrapper}>
      {
        article ?
          <nav
            className={styles.left}
          >
            <div className={styles['left-btn']}>
              <IconText
                icon={LikeFilled}
                type={1}
                articleId={article?.articleId}
                array={article?.likes}
              />
            </div>
            <div className={styles['left-btn']}>
              <IconText
                icon={StarFilled}
                type={2}
                array={article?.collects}
                articleId={article?.articleId}
              />
            </div>
            <div className={styles['left-btn']}>
              <a
                // className="list-comment"
                key="list-vertical-comment"
                href='#comment'
              >
                <IconText
                  icon={MessageFilled}
                  num={article?.comments?.length}
                />
              </a>
            </div>
          </nav> : null
      }
      <Skeleton active avatar title paragraph loading={!article}>
      <article className={styles.post}>
        <h1>{article?.title}</h1>
        {article?.status === 0 ? <Tag color="orange">审核中</Tag> : ''}
        <div className={styles.infobox}>
          <Avatar size="large" src={article?.author?.avatar} />
          <div className={styles['info-right']}>
            <span className={styles.author}>{article?.author?.username}</span>
            <span className={styles.time}>
              {
                `${dayjs(article?.create_time).format('YYYY-MM-DD HH:ss')}
               · 阅读 · ${article?.view || 0}
               `
              }
            </span>
          </div>
        </div>
        {
          article?.cover_url
            ? <img width="100%" src={article.cover_url} alt="" />
            : null
        }
        <div ref={article_content} className={styles.postmain} dangerouslySetInnerHTML={{ __html: article?.html_content || '' }}>
        </div>
        <div className={styles.posttype}>
          <span>分类：{article?.type}</span>
          <span>
            标签：
            {article?.tags?.map(tag => <Tag key={tag.tag_name} color={tag.tag_color}>{tag.tag_name}</Tag>)}
          </span>
        </div>
        <div className={styles.comment}>
          <h2 id='comment'>评论</h2>
          <CommentList />
        </div>
        <div className={styles.recommend}>
          <h2>相关推荐</h2>
          <PostList header={false} dataSource={recommendList} />
        </div>
      </article>
      </Skeleton>
      <aside className={styles.right}>
        <Card
          cover={
            <img
              alt="头像"
              src={article?.author?.avatar}
            />
          }
        >
          <Card.Meta
            title={'作者: ' + article?.author?.username}
            description={
              <>
                <p><LikeFilled /> · 获得点赞数 · {article?.author?.got_likes}</p>
                <p><EyeFilled /> · 获得阅读数 · {article?.author?.got_views}</p>
                <strong>加入于 · {dayjs(article?.author?.create_time).format('YYYY-MM-DD')}</strong>
              </>
            }
          />
        </Card>
        <Card className={styles.directory} title="目录">
          <Anchor className={styles.anchor}>
            {
              directory.map(item => {
                return (
                  <Anchor.Link
                    key={item.index}
                    title={item.name}
                    href={`${window.location.href.split('#')[0]}#heading-${item.index}`}
                  />
                )
              })
            }
          </Anchor>
        </Card>
      </aside>
    </div>
  )
}
export default PostDetail
