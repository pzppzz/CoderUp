import React, { MutableRefObject } from "react";
import { ModalForm, ProFormColorPicker,  ProFormText } from "@ant-design/pro-form";
import { addTag } from "@/services/api/tag";
import { message } from "antd";
import { ActionType } from "@ant-design/pro-table";

type Iprops = {
  visible: boolean,
  initValues: any,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  tableRef: MutableRefObject<ActionType | undefined>
}
const ActionModal: React.FC<Iprops> = ({
  visible, 
  initValues, 
  tableRef,
  setVisible
}) => {
  return <ModalForm
    title={initValues.tag_name ? '修改标签' : '新增标签'}
    width={500}
    initialValues={{tag_color: '#1890ff', ...initValues}}
    layout="horizontal"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 12 }}
    visible={visible}
    onVisibleChange={setVisible}
    modalProps={{
      destroyOnClose: true,
      maskClosable: false
    }}
    submitter={{
      searchConfig: {
        resetText: '取消',
        submitText: '确认'
      }
    }}
    onFinish={async (values) => {
      const res = await addTag({...initValues, ...values})
      if (res.code === 1) {
        message.success(res.msg)
        tableRef.current?.reload()
        return true
      }
      message.error(res.msg)
      return false;
    }}
  >
    <ProFormText
      width="lg"
      name="tag_name"
      label="标签名称"
      placeholder="请输入标签名称"
    />

    <ProFormColorPicker
      width="lg"
      name="tag_color"
      label="标签颜色"
    />
  </ModalForm>
}
export default ActionModal