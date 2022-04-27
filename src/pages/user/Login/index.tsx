import React from 'react';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import md5 from 'md5'
import { message, Tabs } from 'antd';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel, Redirect } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/api/user';

import styles from './index.less';


const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { query } = history.location;
  const { redirect } = query as { redirect: string };
  const handleSubmit = async (values: TYPE.LoginParams) => {
    try {
      // 登录
      const res = await login({ ...values, password: md5(values.password as string) });
      if (res.code === 1) {
        localStorage.setItem('PASSPORT_TOKEN', res.token as string)
        await setInitialState({ ...initialState, currentUser: res.data })
        message.success(res.msg);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        history.replace(redirect ? (redirect as string).slice(21) : '/');
        return;
      } else {
        // 如果失败抛出异常
        throw new Error(res.msg)
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  if (initialState?.currentUser) {
    return <Redirect to={'/'} />
  }
  return (
      <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title="CoderUp"
          subTitle="欢迎您，登录以继续使用"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as TYPE.LoginParams);
          }}
        >
          <Tabs>
            <Tabs.TabPane
              key="account"
              tab="用户名密码登录"
            />
          </Tabs>
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder="管理员admin"
            rules={[
              {
                required: true,
                message: "请输入用户名"
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="管理员admin"
            rules={[
              {
                required: true,
                message: "请输入密码"
              },
            ]}
          />
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <a
              href="/user/register"
            >
              去注册
            </a>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  )
};

export default Login;

