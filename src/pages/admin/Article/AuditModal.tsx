import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Divider, Input, message, Modal, notification, Space, Tag, Typography } from 'antd'
import { getDetail, updateArticle } from '@/services/api/article'
import Loading from '@/components/Loading'
import dayjs from 'dayjs'
import { ActionType } from '@ant-design/pro-table'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

type ModalProps = {
  visible: boolean,
  articleId: string,
  actionRef: React.MutableRefObject<ActionType | undefined>
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
const { Title, Paragraph, Text } = Typography
const AuditModal: React.FC<ModalProps> = ({
  visible,
  setVisible,
  articleId,
  actionRef
}) => {
  const [article, setArticle] = useState<TYPE.Article>()
  const reason = useRef<string>('')
  // 退出审核
  const handleCancle = useCallback(() => {
    Modal.confirm({
      title: '确认退出审核?',
      onOk: () => {
        setVisible(false)
      }
    })
  }, [])

  // 审核
  const handleAudit = async (status: -1 | 1) => {
    if (status === -1) {
      Modal.confirm({
        title: '原因提交',
        maskClosable: false,
        okText: '提交',
        content: (
          <>
            <Input.TextArea
              placeholder='请输入原因'
              maxLength={100}
              size="large"
              showCount
              onChange={e => reason.current = e.target.value}
            />
            <Divider />
          </>
        ),
        onOk: async () => {
          if (reason.current.length > 10) {
            const res = await updateArticle({ articleId: article?.articleId, status, reason: reason.current })
            if (res.code) {
              message.success('审核成功!')
              actionRef!.current?.reload()
              setVisible(false)
              return
            } else {
              message.error('审核失败！，请重试')
            }
          }
          notification.error({
            message: '原因不能少于十个字!',
            duration: 2
          })
          return Promise.reject('原因不能少于十个字！')
        }
      })
    } else {
      const res = await updateArticle({ articleId: article!.articleId, status })
      if (res.code) {
        message.success('审核成功!')
        actionRef!.current?.reload()
        setVisible(false)
      } else {
        message.error('审核失败！，请重试')
      }
    }
  }
  useEffect(() => {
    getDetail(articleId)
      .then(res => {
        if (res.code) {
          setArticle(res.data)
        }
      })
      .catch(() => {
        message.error('获取审核文章失败!')
      })
  }, [])
  return (
    <Modal
      title="文章审核"
      width={1000}
      style={{ top: 10 }}
      maskClosable={false}
      visible={visible}
      onCancel={handleCancle}
      destroyOnClose
      footer={(article?._id && article?.status === 0) ? [
        <Button key="cancle" type="default" onClick={handleCancle}>
          退出
        </Button>,
        <Button key="refuse" type="primary" danger onClick={() => handleAudit(-1)}>
          拒绝
        </Button>,
        <Button key="pass" type="primary" onClick={() => handleAudit(1)}>
          通过
        </Button>,
      ] : false
      }
    >
      <Loading loading={!article}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              display: article?.status === 0 ? 'none' : 'block',
              right: 80,
              fontSize: 50,
              color: article?.status === 1 ? '#1890ff' : '#ff603b'
            }}
          >
            { article?.status === 1 ? <CheckOutlined /> : <CloseOutlined /> }
          </div>
          <Typography>
            <Title level={2}>{article?.title}</Title>
            <Space split={<Divider type="vertical" />}>
              <Text strong>{'作者: ' + article?.author?.username}</Text>
              <Text>{dayjs(article?.create_time).format('YYYY-MM-DD HH:ss')}</Text>
            </Space>
            <Divider />
            <Paragraph>
              <Space split={<Divider type="vertical" />}>
                <Text>{article?.type}</Text>
                <Text>
                  {
                    article?.tags!.map(tag => {
                      return <Tag key={tag.tag_name} color={tag.tag_color}>{tag.tag_name}</Tag>
                    })
                  }
                </Text>
              </Space>
            </Paragraph>
            <Title level={4}>摘要</Title>
            <pre>{article?.description}</pre>
            <Divider />
            <Title level={4}>正文内容</Title>
            <Divider />
            <Paragraph>
              <div dangerouslySetInnerHTML={{ __html: article?.html_content as string }}></div>
            </Paragraph>
          </Typography>
        </div>
      </Loading>
    </Modal>
  )
}

export default AuditModal