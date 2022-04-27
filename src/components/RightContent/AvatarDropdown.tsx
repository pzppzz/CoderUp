import React from 'react';
import { AuditOutlined, CopyOutlined, FormOutlined, LikeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, message, Modal, Button } from 'antd';
import { Link, useModel, history } from 'umi';
import styles from './index.less';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};


const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu = true }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  /** 退出登录 */
  function logout() {
    Modal.confirm({
      title: '确认退出登录吗？',
      maskClosable: false,
      onOk: async () => {
        try {
          localStorage.removeItem('PASSPORT_TOKEN')
          message.success('退出登录成功!')
          await setInitialState({})
          window.location.reload()
        } catch (err) {
          message.error('退出登录失败！请重试')
        }
      }
    })
  }

  const NoLogin = (
    <div className={`${styles.action} ${styles.account}`}>
      <Button
        onClick={() => {
          history.push(`/user/login?redirect=${window.location.href}`)
        }}
        type="primary"
      >登录
      </Button>
      <Button
        style={{ marginLeft: 20 }}
        onClick={() => history.push('/user/register')}
      >注册
      </Button>
    </div>
  );
  if (!initialState) {
    return NoLogin;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return NoLogin;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]}>
      {menu && (
        <Menu.Item key="draft">
          <Link to="/op/creator/posts?status=2"><CopyOutlined />草稿箱</Link>
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="center">
          <Link to="/op/account"><UserOutlined />个人中心</Link>
        </Menu.Item>
      )}
        <Menu.Item key="page">
          <Link to={`/coder/${initialState?.currentUser?.userId}/posts`}><AuditOutlined />我的主页</Link>
        </Menu.Item>
        <Menu.Item key="likes">
          <Link to={`/coder/${initialState?.currentUser?.userId}/likes`}><LikeOutlined />我赞过的</Link>
        </Menu.Item>
      {menu && (
        <Menu.Item key="creator">
          <Link to="/op/creator"><FormOutlined />创作中心</Link>
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout" onClick={logout}>
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown} arrow >
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.username}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
