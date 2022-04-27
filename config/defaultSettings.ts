import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'CoderUp',
  pwa: false,
  logo: 'https://626c-blog-cloudbase-0geo5pt74e4dd9a3-1307903579.tcb.qcloud.la/static/logo.png?sign=8aad9b4e4260ff8db36e80ccc6bd659a&t=1649503169',
  iconfontUrl: '',
};

export default Settings;
