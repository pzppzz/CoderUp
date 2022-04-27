import React, { useEffect, useState } from 'react'
import Editor from './Editor'
import { Comment, getCommentList } from '@/services/api/comment'

import styles from './index.less'
import CommentItem from './CommentItem'
const CommentList: React.FC = () => {
  const [commentList, setCommentList] = useState<Comment[]>([])
  useEffect(() => {
    getCommentList(window.location.pathname.split('/').pop())
      .then(res => {
        if (res.code) {
          setCommentList(res.data || [])
        }
      })
  }, [])
  return (
    <div className={styles['comment-wrapper']}>
      <Editor
        buttonText="发布评论"
        placeholder='评论千万条友善第一条'
        setCommentList={setCommentList}
      />
      <ul className={styles.list}>
        {
          commentList.map(comment => {
            return (
              <li key={comment._id}>
                <CommentItem comment={comment} setCommentList={setCommentList}>
                  {
                    comment.child_comments?.length
                      ? comment.child_comments.map(item => {
                        if (Object.keys(item).length === 0) {
                          return null
                        }
                        return <div key={item.commentId} className={styles.child_comment}>
                          <CommentItem
                            parentId={comment.commentId}
                            comment={item}
                            setCommentList={setCommentList}
                          />
                        </div>
                      })
                      : null
                  }
                </CommentItem>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
export default CommentList