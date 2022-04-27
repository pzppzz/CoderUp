import React, { useEffect, useState } from 'react';
import { history, Link, useModel } from 'umi';
import { Space } from 'antd';
import queryString from 'query-string'
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import { HomeOutlined } from '@ant-design/icons';

import styles from './index.less';
import NoticeIcon from '../NoticeIcon/NoticeIcon';

export type SiderTheme = 'light' | 'dark';
type SearchRecord = {
  value: string,
  label: string,
  time: Date
}
const GlobalHeaderRight: React.FC<{ showSearch?: boolean, menu?: boolean }> = ({ showSearch = true, menu }) => {
  const [searchList, setSearchList] = useState<SearchRecord[]>([])
  const { initialState } = useModel('@@initialState');

  if (!initialState) {
    return null;
  }

  const saveKeyword = (value: string) => {
    let list = searchList.filter(item => item.value !== value)
    const newRecord = {value, time: new Date(), label: value}
    if (list.length >= 5) {
      list = list.slice(0, 4)
    }
    localStorage.setItem('Search_History', JSON.stringify([newRecord, ...list]))
    setSearchList([newRecord, ...list])
  }

  const getHistoryList = () => {
    const historyList = JSON.parse(localStorage.getItem('Search_History') || '[]')
    setSearchList(historyList)
  }
  useEffect(() => {
    getHistoryList()
  }, [])
  return (
    <Space className={styles.right}>
      <Link to={'/'}>
        <HomeOutlined />
      </Link>
      {
        showSearch ? <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder="搜索感兴趣的内容 按Enter键确定"
          // 设置搜索历史
          options={searchList}
          onSearch={value => {
            if (!value?.trim()) return
            saveKeyword(value)
            let { search } = history.location
            search = queryString.stringify({
              ...queryString.parse(search),
              keyword: value
            })
            history.push('/search?' + search)
          }}
        /> : null
      }
      <NoticeIcon />
      <Avatar menu={menu} />
    </Space>
  );
};
export default GlobalHeaderRight;
