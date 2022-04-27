import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Button, List, message, Modal } from 'antd'
import { deleteNotices, getNotices, Notice } from '@/services/api/notice'
import { useModel } from 'umi'
import dayjs from '../../utils/dayjs'
import logo from '../../assets/logo.png'
const NoticeList: React.FC<{ 
  visible?: boolean, 
  setVisible: React.Dispatch<React.SetStateAction<boolean>> 
}> = ({ visible = false, setVisible }) => {
  const [data, setData] = useState<Notice[]>([])
  const [loading, setLoading] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  const { initialState, setInitialState } = useModel('@@initialState')
  useEffect(() => {
    divRef.current!.focus()
    if (initialState?.currentUser?.userId) {
      setLoading(true)
      getNotices(initialState?.currentUser?.userId)
        .then(res => {
          setData(res.data || [])
        })
        .catch(console.log)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [])
  return (
    <div
      ref={divRef}
      onMouseLeave={() => setVisible(false)}
      style={{
        position: 'fixed',
        width: 300,
        padding: '0 12px',
        right: '80px',
        top: '50px',
        background: '#fff',
        transition: 'all .3s',
        boxShadow: '0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d'
      }}
    >
      {
        visible
          ? <List<Notice>
            itemLayout="horizontal"
            loading={loading}
            dataSource={data}
            locale={{ emptyText: '暂时没有新消息' }}
            style={{
              maxHeight: 300,
              overflow: 'auto'
            }}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={logo} />}
                  title={`系统 · ${dayjs(item.create_time).fromNow()} · ${item.isRead ? '已读' : '未读'}`}
                  description={<div dangerouslySetInnerHTML={{ __html: item.content || '' }}></div>}
                />
              </List.Item>
            )}
            footer={
              data.length ?
                <div className='list-footer'>
                  <Button
                    onClick={() => {
                      Modal.confirm({
                        title: '确认删除所有消息吗?',
                        maskClosable: false,
                        onOk: async () => {
                          const res = await deleteNotices(initialState?.currentUser?.userId!)
                          if (res.code) {
                            message.success('清除成功!')
                            setData([])
                            setInitialState({ currentUser: { ...initialState?.currentUser, unReadCount: 0 } })
                          } else {
                            message.error('清除失败!')
                          }
                        }
                      })
                    }}
                  >
                    全部删除
                  </Button>
                </div> : false
            }
          /> : null
      }
    </div>
  )
}
export default NoticeList
