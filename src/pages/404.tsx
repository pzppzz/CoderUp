import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="页面走丢了！"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        回到首页
      </Button>
    }
  />
);

export default NoFoundPage;
