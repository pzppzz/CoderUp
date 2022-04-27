
import { notification } from 'antd';
import Loading from './components/Loading';
import { getCurrentUser } from './services/api/user'

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <Loading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  currentUser?: TYPE.CurrentUser;
  fetchUserInfo?: () => Promise<TYPE.CurrentUser | undefined>;
}> {
  try {
    const { user } = await getCurrentUser();
    if (user && user.last_logintime) {
      if ((Date.now() - new Date(user.last_logintime).getTime()) >= 259200000) {
        notification.info({message: '欢迎回来!'})
      }
    }
    return {
      currentUser: user ?? undefined,
    };
  } catch (err) {
    return {
      currentUser: undefined
    }
  }
}

export const layout = () => {
  return {
    menuHeaderRender: undefined,
    headerRender: false,
  };
};
