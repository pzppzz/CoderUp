import React from 'react'
import type { TagType } from '@/services/api/tag'
import { Empty } from 'antd'
type TagListProps = {
  dataSource?: TagType[]
}
const TagList: React.FC<TagListProps> = ({ dataSource = [] }) => {
  return (
    <>
      {
        dataSource.length ? dataSource.map(item => {
          return (
            <li
              key={item._id}
              style={{
                listStyle: 'none',
                height: 100,
                padding: '0 24px',
                lineHeight: '100px',
                fontSize: 16,
                fontWeight: 'bold',
                background: '#fff',
                borderBottom: '1px solid #ddd',
              }}>
              <a style={{ marginRight: 24 }}>{item.tag_name}</a>
              <span>文章数: {item.article_count}</span>
            </li>
          )
        }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    </>
  )
}
export default TagList
