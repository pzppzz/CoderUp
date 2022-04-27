import React, { useEffect, useState } from 'react'
import PostList from '@/components/PostList'
import { history, Link } from 'umi'
import queryString from 'query-string'
import { getSearchRes } from '@/services/api/search'
import styles from './index.less'
import UserList from './UserList'
import TagList from './TagList'
import { Skeleton } from 'antd'
const Search: React.FC = () => {
  const [list, setList] = useState<any[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [type, setType] = useState<string>('0')
  const { query = {} } = history.location
  useEffect(() => {
    setLoading(true)
    setList([])
    if (!['0', '1', '2'].includes(query.type as string)) {
      setType('0')
    } else {
      setType(query.type as string)
    }
    getSearchRes({
      sort: query?.sort as string,
      keyword: query?.keyword as string,
      page: 1,
      type: query?.type as string
    }).then(res => {
      if (res.code) {
        setList(res.data || [])
      }
    }).catch(console.log)
      .finally(() => setLoading(false))
  }, [query])
  return (
    <>
      <nav className={styles['search-type']}>
        <Link className={query?.type == '0' ? styles['active'] : ''} to={`/search?${queryString.stringify({ ...query, type: 0 })}`}>文章</Link>
        <Link className={query?.type == '1' ? styles['active'] : ''} to={`/search?${queryString.stringify({ ...query, type: 1 })}`}>标签</Link>
        <Link className={query?.type == '2' ? styles['active'] : ''} to={`/search?${queryString.stringify({ ...query, type: 2 })}`}>用户</Link>
      </nav>
      <div style={{maxWidth: 800, background: '#fff'}}>
      <Skeleton active loading={loading} style={{padding: 24}}>
        {
          type === '1'
            ? <TagList dataSource={list} />
            : type === '2'
              ? <UserList dataSource={list} />
              : <PostList dataSource={list} />
        }
      </Skeleton>
      </div>
    </>
  )
}
export default Search
