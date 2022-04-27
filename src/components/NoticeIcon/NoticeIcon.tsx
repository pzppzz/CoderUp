import React, { useState } from 'react'
import { BellFilled } from '@ant-design/icons'
import { Badge } from 'antd'
import { history, useModel } from 'umi'
import NoticeList from './NoticeList'
import './index.less'
const NoticeIcon: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const { initialState } = useModel('@@initialState')
  return (
    <Badge count={initialState?.currentUser?.unReadCount} offset={[2, -4]} size="small">
      <BellFilled
        style={{ fontSize: 16, color: '#8a919f' }}
        onClick={() => {
          if (!initialState?.currentUser) {
            history.push('/user/login')
          } else {
            setVisible(true)
          }
        }}
      />
      <NoticeList visible={visible} setVisible={setVisible} />
    </Badge>
  )
}
export default NoticeIcon
