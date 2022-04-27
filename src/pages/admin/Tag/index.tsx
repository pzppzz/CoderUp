import React, { useMemo, useRef, useState } from 'react';
import { Button, Empty, message, Modal, Tag } from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { deleteTag, getTagList, TagType } from '@/services/api/tag';
import ActionModal from './ActionModal';


const TagManage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [visible, setVisible] = useState<boolean>(false)
  const [initValues, setInitvalues] = useState({})
  const columns: ProColumns<TagType>[] = useMemo(() => {
    return [
      {
        title: '标签名',
        key: 'tag_name',
        dataIndex: 'tag_name',
      },
      {
        title: '颜色值',
        key: 'tag_color',
        dataIndex: 'tag_color',
        search: false
      },
      {
        title: '效果',
        key: '_id',
        search: false,
        render: (text, record: TagType, _, action) => {
          return <Tag color={record.tag_color}>{record.tag_name}</Tag>
        }
      },
      {
        title: '操作',
        valueType: "option",
        key: '_id',
        align: 'center',
        width: '25%',
        render: (text, record: TagType, _, action) => [
          <Button
            key="editable"
            type='link'
            onClick={() => {
              setVisible(true)
              setInitvalues(record)
            }}
          >
            编辑
          </Button>,
          <Button
            type="link"
            key="delete"
            onClick={() => {
              Modal.confirm({
                title: '确认删除该项吗？',
                onOk: async () => {
                  const res = await deleteTag(record._id as string)
                  if (res.code === 1) {
                    actionRef.current?.reload()
                    message.success(res.msg)
                    return
                  }
                  message.error(res.msg)
                }
              })
            }}
          >
            删除
          </Button>,
        ]
      },
    ];
  }, [])
  return (
    <>
      <ProTable<TagType>
        rowKey="tid"
        cardBordered
        dateFormatter="string"
        headerTitle="标签管理"
        actionRef={actionRef}
        columns={columns}
        locale={{
          emptyText: <Empty description="没有数据" />
        }}
        request={async (param) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const res = await getTagList(param)
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
          filterType: 'light',
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setVisible(true)
              setInitvalues({})
            }}
          > 
            新增标签
          </Button>
        ]}
      />
      <ActionModal
        visible={visible}
        tableRef={actionRef}
        setVisible={setVisible}
        initValues={initValues}
      />
    </>
  )
}
export default TagManage