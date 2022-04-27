import React from 'react';
import { Link, history, useAccess } from 'umi';
import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import RightContent from '@/components/RightContent';
import { adminMenuList } from '../../config/adminMenu';
import defaultSettings from '../../config/defaultSettings';

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
} & ProLayoutProps;

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

// const Footer = (
//   <footer
//     style={{
//       height: 60,
//       textAlign: 'center',
//       lineHeight: '60px'
//     }}
//   >
//     {new Date().getFullYear() + 'ppzz'}
//   </footer>
// );

const AdminLayout: React.FC<BasicLayoutProps> = (props) => {
  // const access = useAccess()
  const {
    children,
    location = {
      pathname: '/',
    },
  } = props;

  return (
    <div style={{ height: '100vh' }}>
      <ProLayout
        {...props}
        {...defaultSettings}
        logo={false}
        title="CoderUp后台管理"
        fixSiderbar
        layout="mix"
        // headerTheme="light"
        // navTheme="light"
        route={{
          routes: adminMenuList
        }}
        // onCollapse={handleMenuCollapse}
        menu={{
          defaultOpenAll: true
        }}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path} replace={menuItemProps.rep}>{defaultDom}</Link>
        }}

        footerRender={false}
        // menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent menu={false} showSearch={false} />}
      >
        {children}
      </ProLayout>
    </div>
  );
};

export default AdminLayout;