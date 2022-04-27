import React, { useEffect, useState } from 'react'
import { Button, Card, Layout, message, notification, Skeleton, Tabs } from 'antd'
import { LikeFilled, EyeFilled, FileFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import { history, Link, Redirect, useModel, useParams } from 'umi'
import { followUser, getUserProfile } from '@/services/api/user'
import styles from './index.less'

const { TabPane } = Tabs
const UserPage: React.FC = ({ children }) => {
  const { initialState } = useModel('@@initialState')
  const [loading, setLoading] = useState<boolean>(true)
  const [userInfo, setUserInfo] = useState<TYPE.User>({})
  const { userId } = useParams<any>()
  const { pathname } = history.location
  const handleFollow = async () => {
    if (!initialState?.currentUser) {
      message.info({ content: '请先登录!' })
      history.push(`/user/login?redirect=${window.location.href}`)
    } else {
      const res = await followUser(userInfo.userId!, userInfo.isFollowed!)
      if (res.code) {
        notification.success({ message: res.msg, duration: 2 })
        setUserInfo({ 
          ...userInfo, 
          isFollowed: !userInfo.isFollowed, 
          got_followers: userInfo.isFollowed ? userInfo.got_followers! - 1 : userInfo.got_followers! + 1 })
      } else {
        notification.error({ message: res.msg, duration: 2 })
      }
    }
  }
  useEffect(() => {
    if (userId) {
      getUserProfile(userId)
        .then(res => {
          if (res.code && res.data) {
            setUserInfo(res.data)
          } else {
            history.replace('/404')
          }
        })
        .catch(() => {
          notification.error({ message: '获取用户信息失败!' })
          history.replace('/404')
        })
        .finally(() => setLoading(false))
    }
  }, [userId])
  if (!userId) {
    return <Redirect to={'/404'} />
  }
  return (
    <>
      <Layout.Content>
        <div className={styles['major-wraper']}>
          <Skeleton active avatar title loading={loading}>
            <img className={styles.avatar} src={userInfo.avatar} alt="用户头像" />
            <div className={styles.infobox}>
              <h2>{userInfo.username}</h2>
              <span>个人简介 · {userInfo.introduction || '这个人很懒，什么都没有写'}</span>
              <span>兴趣爱好 · {userInfo.interest || '这个人很懒，什么都没有写'}</span>
            </div>
            <div className={styles.actionbox}>
              {
                initialState?.currentUser?.userId === userInfo.userId
                  ? <Button shape="round" size="large" onClick={() => history.push('/op/account/profile')}>编辑个人资料</Button>
                  : (
                    <Button
                      shape="round"
                      size="large"
                      type="primary"
                      onClick={handleFollow}
                    >
                      {
                        userInfo.isFollowed ? '取消关注' : '+关注ta'
                      }
                    </Button>
                  )
              }
            </div>
          </Skeleton>
        </div>
        <div className={styles['main-box']}>
          <Tabs activeKey={pathname.split('/').pop()} >
            <TabPane tab={<Link to={`/coder/${userInfo.userId}/posts`}>文章</Link>} key="posts" />
            <TabPane tab={<Link to={`/coder/${userInfo.userId}/likes`}>赞过的</Link>} key="likes" />
            <TabPane tab={<Link to={`/coder/${userInfo.userId}/collects`}>收藏的</Link>} key="collects" />
            <TabPane tab={<Link to={`/coder/${userInfo.userId}/follows`}>关注的</Link>} key="follows" />
          </Tabs>
          {
            children
          }
        </div>
      </Layout.Content>
      <Layout.Sider className={styles.left}>
        <div style={{position: 'sticky', top: '60px'}}>
          <Card
            title={<strong style={{ color: '#31445b' }}>创作信息</strong>}
            className={styles.leftcard}
          >
            <Card.Meta
              description={
                <div className={styles.description}>
                  <p><FileFilled style={{ color: '#1890ff' }} /> · 总文章数 · {userInfo.all_articles}</p>
                  <p><LikeFilled style={{ color: '#1890ff' }} /> · 获得点赞数 · {userInfo.got_likes}</p>
                  <p><EyeFilled style={{ color: '#1890ff' }} /> · 获得阅读数 · {userInfo.got_views}</p>
                  <strong>加入于 · {dayjs(userInfo.create_time).format('YYYY-MM-DD')}</strong>
                </div>
              }
            />
          </Card>
          <div className={styles.leftbottom}>
            <span>关注了 {userInfo.followed_count}</span>
            <span>被关注 {userInfo.got_followers}</span>
          </div>
        </div>
      </Layout.Sider>
    </>
  )
}
export default UserPage
