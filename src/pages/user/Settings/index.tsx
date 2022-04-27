import React, { useEffect, useState } from 'react'
import { Alert, Card } from 'antd'
import styles from './index.less'
import { getCurrentUser} from '@/services/api/user'

const Settings: React.FC = () => {
  const [user, setUser] = useState<TYPE.User>({})
  useEffect(() => {
    getCurrentUser('detail')
      .then(res => {
        setUser(res.user)
      })
      .catch(console.log)
  }, [])
  return (
    <div>
      <Card title={<h2>账号设置</h2>} bodyStyle={{ display: 'flex', alignItems: 'center' }}>
        <ul className={styles.infolist}>
          <Alert type="info" message="目前不支持第三方账号绑定" showIcon />
          <li className={styles['infolist-item']}>
            <span>电子邮箱</span>
            <span>{user?.email || '未绑定'}</span>
          </li>
          <li className={styles['infolist-item']}>
            <span>联系电话</span>
            <span>{user?.tel || '未绑定'}</span>
          </li>
          <li className={styles['infolist-item']}>
            <span>微信</span>
            <span>{user?.tel || '未绑定'}</span>
          </li>
          <li className={styles['infolist-item']}>
            <span>GitHub</span>
            <span>{user?.tel || '未绑定'}</span>
          </li>
          <li className={styles['infolist-item']}>
            <span>密码</span>
            <span>重置</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}

export default Settings
