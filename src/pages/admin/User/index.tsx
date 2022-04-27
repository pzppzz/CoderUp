import React, { useMemo, useRef } from "react";
import dayjs from 'dayjs'
import { deleteUser, getUserList } from "@/services/api/user";
import ProTable, { ActionType, ProColumnType } from "@ant-design/pro-table";
import { Avatar, Button, message, Modal, notification } from "antd";

const User: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const columns: ProColumnType<TYPE.User>[] = useMemo(() => {
    return [
      {
        title: '用户名',
        key: 'username',
        dataIndex: 'username'
      }, {
        title: '头像',
        key: 'avatar',
        dataIndex: 'avatar',
        search: false,
        render: (_, user: TYPE.User) => {
          return <Avatar src={user.avatar} />
        }
      }, {
        title: '性别',
        key: 'sex',
        dataIndex: 'sex',
        valueType: "select",
        valueEnum: {
          0: '女',
          1: '男'
        }
      }, {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
        search: false,
        render: (_, user: TYPE.User) => {
          return user.email ? user.email : <span style={{ color: 'red' }}>未绑定邮箱</span>
        }
      }, {
        title: '联系电话',
        key: 'tel',
        dataIndex: 'tel',
        search: false,
        render: (_, user: TYPE.User) => {
          return user.tel ? user.tel : <span style={{ color: 'red' }}>未绑定电话</span>
        }
      }, {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          [-1]: { text: '已删除', status: 'Error' },
          0: { text: '已封号', status: 'Default' },
          1: { text: '正常', status: 'Success' }
        }
      }, {
        title: '注册时间',
        key: 'create_time',
        dataIndex: 'create_time',
        search: false,
        render: (_, user: TYPE.User) => {
          return dayjs(user.create_time).format('YYYY-MM-DD HH:ss')
        }
      }, {
        title: '操作',
        key: '_id',
        width: '20%',
        align: 'center',
        search: false,
        render: (_, user: TYPE.User) => {
          const isDelete = user.status === -1
          return [
            <Button
              key="edit"
              type="link"
            >
              编辑
            </Button>,
            <Button
              key="delete"
              type="link"
              danger={isDelete}
              onClick={() => {
                Modal.confirm({
                  title: isDelete ? '确认永久删除?' : '确认删除该用户吗？',
                  content: isDelete ? '将用户从数据库中永久删除, 无法恢复' : '',
                  maskClosable: false,
                  onOk: async () => {
                    if (isDelete) {
                      message.info('永久删除没提供哦!')
                      return
                    }
                    const res = await deleteUser(user._id as string, false)
                    if (res && res.code) {
                      message.success('删除成功!')
                      actionRef.current?.reload()
                      return
                    }
                    message.error('删除失败! 请重试')
                  }
                })
              }}
            >
              {
                isDelete ? '永久删除' : '删除'
              }
            </Button>,
            <Button
              key="ban"
              type="link"
              danger
              onClick={() => {
                notification.warning({ message: '功能待开发', placement: 'topRight', duration: 2 })
              }}
            >
              封号
            </Button>
          ]
        }
      }
    ]
  }, [actionRef])
  return (
      <ProTable<TYPE.User>
        rowKey="userId"
        cardBordered
        dateFormatter="string"
        headerTitle={<h2>用户管理</h2>}
        actionRef={actionRef}
        columns={columns}
        request={async (param) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          param['sex'] ? param['sex'] = +param['sex'] : ''
          param['state'] ? param['state'] = +param['state'] : ''
          const res = await getUserList(param)
          return {
            data: res.data || [],
            total: res.total,
            success: !!res.data
          }
        }}
        pagination={{
          showQuickJumper: true,
          pageSize: 6,
          showTotal: (total, range) => {
            return `总共${total}条`
          },
        }}
        search={{
          filterType: "light",
          labelWidth: 'auto',
        }}
      />
  )
}
export default User