/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: TYPE.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canUser: currentUser && currentUser.authority === 'user',
    canAdmin: currentUser && currentUser.authority === 'admin',
    isLogin: currentUser ? true : false
  };
}
