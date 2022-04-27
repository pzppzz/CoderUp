import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import PostList from '../../components/PostList'
import { history } from 'umi'
import { getPostList } from '@/services/api/article'
import { Button, Card, Layout, Tag } from 'antd'
import { TagType, getTagList } from '@/services/api/tag'
import './index.less'
import Notice from './components/Notice'
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 6) {
    return '还不休息吗?'
  }
  if (hour >= 6 && hour < 11) {
    return '元气满满!'
  }
  if (hour >= 11 && hour < 13) {
    return '午饭时间'
  }
  if (hour >= 13 && hour < 19) {
    return '下午好!'
  }
  if (hour >= 19 && hour < 22) {
    return '下班了吗?'
  }
  return '晚安啦！'
}
const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [blogList, setBlogList] = useState<TYPE.Article[]>([])
  const [tagList, setTagList] = useState<TagType[]>([])
  useEffect(() => {
    getTagList({ pageSize: 20 })
      .then(res => {
        setTagList(res.data || [])
      })
      .catch(err => {
        console.log(err);
      })
  }, [])
  const { search } = history.location
  /** 获取文章列表 */
  async function getList(init: boolean = false) {
    try {
      setLoading(init)
      const res = await getPostList(
        {
          status: 1,
          sort: queryString.parse(history.location.search).sort as string
        },
        {
          current: init ? 1 : Math.ceil(blogList.length / 10 + 1),
        }
      )
      if (res.data) {
        setBlogList([...(init ? [] : blogList), ...res.data])
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }
  /** 加载更多 */
  function loadMore() {
    if ((document.documentElement.scrollTop + window.innerHeight) >=
      document.documentElement.scrollHeight) {
      getList()
    }
  }
  useEffect(() => {
    getList(true)
  }, [search])
  useEffect(() => {
    document.addEventListener('scroll', loadMore)
    return () => {
      document.removeEventListener('scroll', loadMore)
    }
  }, [blogList])
  return (
    <>
      <Notice/>
      <Layout.Content>
        <PostList loading={loading} dataSource={blogList} />
      </Layout.Content>
      <Layout.Sider className='content-sider' theme="light">
        <Card
          headStyle={{ padding: '0 12px' }}
          bordered={false}
          bodyStyle={{padding: 0}}
          title={<span style={{ fontSize: 20 }}>{getGreeting()}</span>}
          extra={<Button type="ghost" shape="round" onClick={() => history.push('/op/creator/edit/new')}>写文章</Button>}
        >
        </Card>
        <Card
          title="标签云"
          style={{ marginTop: 12, position: 'sticky', top: '60px' }}
          bodyStyle={{ padding: 12, cursor: 'pointer' }}
          headStyle={{ paddingLeft: 12 }}
        >
          {
            tagList.map(tag => {
              return (
                <Tag
                  key={tag._id}
                  color={tag.tag_color}
                  onClick={() => history.push(`/search?keyword=${tag.tag_name}`)}
                >
                  {tag.tag_name}
                </Tag>
              )
            })
          }
        </Card>
      </Layout.Sider>
    </>
  )
}
export default Index
