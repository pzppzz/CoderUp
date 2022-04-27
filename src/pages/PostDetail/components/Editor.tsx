import React, { SetStateAction } from 'react'
import { Form, Avatar, Input, Button, message } from 'antd'
import { history, useModel } from 'umi';
import { addComment, Comment, getCommentList } from '@/services/api/comment';
type Props = {
  visible?: boolean;
  buttonText?: string;
  placeholder?: string;
  parentId?: string;
  reply_to_author?: string;
  reply_to_content?: string;
  setCommentList: React.Dispatch<SetStateAction<Comment[]>>;
  onBlur?: () => void
}
const Editor: React.FC<Props> = ({
  buttonText,
  placeholder,
  parentId,
  reply_to_author,
  reply_to_content,
  setCommentList,
  onBlur = () => {}
}) => {
  const { initialState } = useModel('@@initialState')
  const [form] = Form.useForm()

  const publishComment = async (content: string) => {
    if (!initialState?.currentUser?.userId) {
      message.info('登录后即可评论!')
      history.push(`/user/login?redirect=${window.location.href}`)
      return
    }
    if (!content || !content.trim()) {
      message.error('未输入任何内容!')
      return 
    }
    const articleId = history.location.pathname.split('/').pop()
    const res = await (addComment({
      parentId,
      articleId,
      content,
      author: initialState.currentUser.userId,
      reply_to_author,
      reply_to_content,
    }))
    if (res.code) {
      message.success(res.msg)
      form.resetFields()
      getCommentList(articleId)
      .then(res => {
        if (res.code) {
          setCommentList(res.data!)
          onBlur()
        }
      })
      .catch(console.log)
    } else {
      message.error(res.msg)
    }
  }
  return (
    <Form
      form={form}
      requiredMark={false}
      name='comment-form'
      onFinish={({ content }) => {
        publishComment(content)
      }}
      colon={false}
    >
      <Form.Item
        name="content"
        label={<Avatar src={initialState?.currentUser?.avatar} />}
      >
        <Input.TextArea
          allowClear
          maxLength={100}
          showCount
          placeholder={placeholder}
        />
      </Form.Item>
      <Form.Item
        wrapperCol={{ offset: 19 }}
      >
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          shape="round"
        >
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  )
}
export default Editor
