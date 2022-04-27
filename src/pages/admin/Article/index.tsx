import React, { useRef, useState } from "react";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Tag } from "antd";
import { getPostList } from "@/services/api/article";
import dayjs from "dayjs";
import AuditModal from "./AuditModal";

const Article: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [articleId, setArticleId] = useState<string>('')
  const actionRef = useRef<ActionType>()
  const columns: ProColumns<TYPE.Article>[] = [
    {
      title: '标题',
      key: 'title',
      dataIndex: 'title'
    },
    {
      title: '作者',
      key: 'username',
      dataIndex: 'author',
      // search: false,
      render: (_, article) => {
        return article.author?.username
      }
    },
    {
      title: '封面',
      key: 'cover_url',
      dataIndex: 'cover_url',
      search: false,
      render: (_, article) => {
        return article.cover_url ? <img width={60} src={article.cover_url} alt="文章封面" /> : '未设置'
      }
    },
    {
      title: '分类',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, article) => {
        return article.tags!.map((tag: { tag_name: string, tag_color: string }) => {
          return <Tag key={tag.tag_name} color={tag.tag_color}>{tag.tag_name}</Tag>
        })
      }
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        [-1]: { text: <span style={{ color: '#ff4d4f' }}>未通过</span>, status: 'Error' },
        0: { text: <span style={{ color: '#1890ff' }}>待审核</span>, status: 'Processing' },
        1: { text: <span style={{ color: '#52c41a' }}>已发布</span>, status: 'Success' }
      }
    },
    {
      title: '创建时间',
      key: 'create_time',
      dataIndex: 'create_time',
      search: false,
      render: (_, article) => {
        return dayjs(article.create_time).format('YYYY-MM-DD HH:ss')
      }
    },
    {
      title: '操作',
      key: 'articleId',
      search: false,
      render: (_, article: TYPE.Article) => {
        return [
          <Button
            key="button"
            type="link"
            onClick={
              () => {
                setArticleId(article.articleId!)
                setVisible(true)
              }
            }
          >
            {article.status ? '查看' : '进入审核'}
          </Button>
        ]
      }
    }
  ]
  return (
    <>
      <ProTable<TYPE.Article>
        rowKey="_id"
        cardBordered
        dateFormatter="string"
        headerTitle={<h2>文章管理</h2>}
        actionRef={actionRef}
        columns={columns}
        request={async (param) => {
          console.log(param)
          // 表单搜索项会从 params 传入，传递给后端接口。
          const res = await getPostList({}, param)
          return {
            data: res.data || [],
            total: res.total,
            success: !!res.data
          }
        }}
        pagination={{
          showQuickJumper: true,
          pageSize: 6,
          showTotal: (total, range) => {
            return `总共${total}条`
          },
        }}
        search={{
          span: 6,
          labelWidth: 'auto',
          // 是否默认收起
          defaultCollapsed: false,
        }}
      />
      {
        visible
          ? <AuditModal
            actionRef={actionRef}
            visible={visible}
            setVisible={setVisible}
            articleId={articleId}
          />
          : null
      }
    </>
  )
}

export default Article