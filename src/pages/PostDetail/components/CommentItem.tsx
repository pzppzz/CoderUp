import React, { SetStateAction, useState } from 'react'
import { Comment } from 'antd'
import type { Comment as CommentProp } from '@/services/api/comment'
import Editor from './Editor'
import dayjs from '@/utils/dayjs'
import { MessageOutlined } from '@ant-design/icons'

import styles from './index.less'


const CommentItem: React.FC<
  { parentId?: string, comment: CommentProp, setCommentList: React.Dispatch<SetStateAction<CommentProp[]>> }
> = ({ children, setCommentList, comment, parentId }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  return (
    <Comment
      avatar={comment.author.avatar}
      author={
        <span className={styles.commonspan}>
          {
            comment.reply_to_author
              ? `${comment.author.username}回复${comment.reply_to_author.username}`
              : comment.author.username
          }
        </span>
      }
      content={
        <>
          {comment.content}
          {
            comment.reply_to_content
              ? <div className={styles.reply_content}>{comment.reply_to_content}</div>
              : null
          }
        </>
      }
      datetime={dayjs(comment.create_time).fromNow()}
      actions={[
        <span
          className={styles.commonspan}
          key="comment-reply"
          onClick={() => setIsEdit(!isEdit)}
        >
          <MessageOutlined /> {isEdit ? '取消回复' : '回复'}
        </span>
      ]}
    >
      {
        isEdit
          ? <Editor
            setCommentList={setCommentList}
            reply_to_author={comment.author.userId}
            reply_to_content={comment.content}
            parentId={parentId || comment.commentId}
            buttonText="确认回复"
            placeholder={`回复${comment.author.username}`}
            onBlur={() => setIsEdit(false)}
          />
          : null
      }
      {
        children
      }
    </Comment>
  )
}

export default CommentItem