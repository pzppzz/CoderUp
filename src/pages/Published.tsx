import React from 'react'
import { history, Link } from 'umi'
import { Result, Space } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'

const Published: React.FC = () => {
  console.log(history.location.state);
  if (!history.location.state) {
    history.replace('/')
  }
  return (
    <Result
      status="info"
      icon={<CheckCircleFilled />}
      title="您的文章已成功发布，我们将尽快为您审核！"
      extra={
        <div style={{fontSize: 20}}>
          <Space>
            <Link to={`/post/${history.location.state}`}>去看看</Link>
            <Link to={`/`}>回到首页</Link>
          </Space>
        </div>
      }
    />
  )
}

export default Published