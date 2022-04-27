import React from 'react'
import { Avatar, Empty } from 'antd'
import './list.less'
type UserListProps = {
  dataSource?: TYPE.User[]
}
const UserList: React.FC<UserListProps> = ({ dataSource = [] }) => {
  return (
    <>
      {
        dataSource.length ? dataSource.map(item => {
          return (
            <li
              key={item._id}
              className="list-li"
            >
              <a href={'/coder/' + item.userId + '/posts'}>
                <Avatar size="large" src={item.avatar} />
                <span style={{ marginLeft: 24 }}>{item.username}</span>
              </a>
            </li>
          )
        }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    </>
  )
}
export default UserList
