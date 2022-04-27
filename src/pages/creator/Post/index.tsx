import React, { useEffect, useState } from "react";
import { Button, Empty, List, message, Modal, Popover, Skeleton, Tabs, Tag } from "antd";
import { history, Link, useModel } from "umi";
import { deleteArticle, getPostList } from "@/services/api/article";
import dayjs from "dayjs";
import { DashOutlined } from "@ant-design/icons";
import styles from './index.less'

const Post: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [dataList, setDataList] = useState<TYPE.Article[]>([])
  const { initialState } = useModel('@@initialState')
  const search = history.location.search
  /** 获取文章 */
  function getPosts(pagination: TYPE.Pagination = {}) {
    setLoading(true)
    const status = +(search.split('=').pop() || '')
    getPostList({userId: initialState?.currentUser?.userId!, status}, pagination)
      .then(res => {
        setDataList(res.data || [])
        setTotal(res.total)
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false)
      })
  }
  /** 删除操作 */
  function reqDelete(articleId: string) {
    Modal.confirm({
      maskClosable: false,
      title: '确认删除吗?',
      content: '删除后无法恢复，确认删除吗?',
      onOk: async () => {
        const res = await deleteArticle(articleId)
        if (res && res.code === 1) {
          message.success('删除成功!')
          if (dataList.length === 1) {
            getPosts({ current: page - 1 })
            page === 1 ? '' : setPage(page - 1)
          } else {
            getPosts({ current: page })
          }
        } else {
          message.error('删除失败!请重试')
        }
        return
      }
    })
  }
  useEffect(() => {
    const reg = new RegExp(/^\?status=(-1|[012]){1}$/)
    if (!reg.test(search)) {
      history.replace('/op/creator/posts?status=1')
    }
    getPosts()

  }, [search])
  return (
    <div className={styles['post-container']}>
      <Tabs
        size="large"
        defaultActiveKey={history.location.search}
        tabBarStyle={{ color: '#666' }}
        onChange={search => {
          history.push(`/op/creator/posts${search}`)
        }}
      >
        <Tabs.TabPane
          key="?status=1"
          tab="已发布"
        />
        <Tabs.TabPane
          key="?status=0"
          tab="审核中"
        />
        <Tabs.TabPane
          key="?status=-1"
          tab="未通过"
        />
        <Tabs.TabPane
          key="?status=2"
          tab="草稿箱"
        />
      </Tabs>
      <Skeleton active loading={loading}>
        <List
          itemLayout="vertical"
          dataSource={dataList}
          pagination={{
            size: 'small',
            pageSize: 6,
            // hideOnSinglePage: true,
            total,
            showTitle: false,
            showQuickJumper: true,
            showSizeChanger: false,
            defaultCurrent: page,
            showTotal: (total) => `总共${total}条数据`,
            onChange: (page, pageSize) => {
              setPage(page)
              getPosts({ current: page, pageSize })
            }
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<><span>暂无数据，</span><Link to={'/op/creator/edit/new'}>去创作</Link></>}
              />
            )
          }}
          renderItem={item => (
            <a href={[0, 1].includes(item.status!) ? `/post/${item.articleId}` : `/op/creator/edit/${item.articleId}`}>
              <List.Item
                extra={
                  <Popover
                    placement="bottomRight"
                    content={
                      <>
                        <p><Button type="text" onClick={() => history.push(`/op/creator/edit/${item.articleId}`)}>编辑</Button></p>
                        <p><Button type="text" danger onClick={() => { reqDelete(item.articleId!) }}>删除</Button></p>
                      </>
                    }
                  >
                    <span
                      className={styles['extra-action']}
                    >
                      <DashOutlined />
                    </span>
                  </Popover>
                }
                className={styles['list-item']}
                actions={[
                  <span className={styles.time}>{dayjs(item.create_time).format('YYYY-MM-DD HH:ss')}</span>
                ]}
              >
                <List.Item.Meta
                  title={
                    item.status! < 1
                      ? <>
                      <Tag color={item.status === 0 ? 'orange' : 'red'}>
                       {item.status === 0 ? '审核中' : '未通过'}
                      </Tag>{item.title || '无标题'}</>
                      : item.title || '无标题'
                  }
                  description={item.description}
                />
              </List.Item>
            </a>
          )}
        />
      </Skeleton>
    </div>
  )
}

export default Post