import React from 'react';
import ProLayout from '@ant-design/pro-layout';
import RightContent from '@/components/RightContent';
import defaultSettings from '../../config/defaultSettings';
import { BackTop, Layout } from 'antd';
import './index.less'

// const defaultFooterDom = (
//   <DefaultFooter
//     copyright={`${new Date().getFullYear()} ppzz`}
//   />
// );

const BasicLayout: React.FC = (props) => {
  const {
    children,
  } = props;

  return (
    <ProLayout
      {...defaultSettings}
      title={false}
      headerTheme="light"
      collapsedButtonRender={false}
      layout="top"
      splitMenus
      navTheme='light'
      menuRender={false}
      menuItemRender={false}
      fixedHeader
      // footerRender={() => defaultFooterDom}
      rightContentRender={() => <RightContent />}
    >
      <Layout style={{ position: 'relative', maxWidth: 1000, margin: '0 auto' }}>
        {children}
      </Layout>
      <BackTop />
    </ProLayout>
  );
};

export default BasicLayout;