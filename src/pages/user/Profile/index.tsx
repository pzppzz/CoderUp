import React from 'react'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  notification,
  Row,
  Select,
  Upload
} from 'antd'
import { updateUser } from '@/services/api/user'
import { useModel } from 'umi'
import { beforeUpload, handleChange } from '@/pages/creator/Write/components/PostSetting'
import { uploadFile } from '@/services/api/file'
const Profile: React.FC = () => {
  const [form] = Form.useForm()
  const {initialState, setInitialState} = useModel('@@initialState')
  const onFinish = async (
    value: {
      username: string,
      sex?: number,
      introduction?: string,
      interest?: string
    }
  ) => {
    if (!value.username) return
    Object.keys(value).forEach(key => {
      if(!value[key] && value[key] !== 0) {
        delete value[key]
      }
    })
    const res = await updateUser({...value})
    if(res.code === 1) {
      setInitialState({currentUser: {...initialState?.currentUser, ...value}})
      notification.info({message: '修改信息成功！', duration: 2})
    } else {
      notification.error({message: '修改信息失败！', duration: 2})
    }
  }
  return (
    <Card title={<h2>个人资料</h2>}>
      <Row>
        <Col span={12}>
          <div style={{ padding: '12px' }}>
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              labelAlign="left"
              form={form}
              name="edit"
              requiredMark={false}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                label="用户名"
                initialValue={initialState?.currentUser?.username}
                rules={[{ required: true, message: '请填写用户名!' }]}
              >
                <Input placeholder="填写用户名" minLength={4} maxLength={8} />
              </Form.Item>
              <Divider />
              <Form.Item
                name="sex"
                label="性别"
                initialValue={initialState?.currentUser?.sex}
                rules={[{ required: true, message: '请选择性别!' }]}
              >
                <Select placeholder="请填写性别">
                  <Select.Option value={0}>女</Select.Option>
                  <Select.Option value={1}>男</Select.Option>
                </Select>
              </Form.Item>
              <Divider />
              <Form.Item
                name="introduction"
                label="个人介绍"
                initialValue={initialState?.currentUser?.introduction}
                rules={[{ required: false }]}
              >
                <Input.TextArea showCount maxLength={100} />
              </Form.Item>
              <Divider />
              <Form.Item
                name="interest"
                label="兴趣爱好"
                initialValue={initialState?.currentUser?.interest}
                rules={[{ required: false }]}
              >
                <Input.TextArea showCount maxLength={30} />
              </Form.Item>
              <Divider />
              <Form.Item
                wrapperCol={{
                  offset: 6
                }}
              >
                <Button type="primary" htmlType="submit">
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={12}>
          <Card title="头像" bordered={false}>
          <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          customRequest={async fileObj => {
            try {
              const { data } = await uploadFile(fileObj);
              if (!data) {
                return
              }
              const res = await updateUser({avatar: data.tempFileURL})
              if (res.code) {
                // await deleteFile(user.avatar!)
                setInitialState({currentUser: {...initialState?.currentUser, avatar: data.tempFileURL}})
                fileObj.onSuccess!(data.tempFileURL)
              }
              return 
            } catch (err) {
              message.error('上传失败!')
              console.log(err);
            }
          }}
        >
          <img src={initialState?.currentUser?.avatar} alt="avatar" style={{ width: '100%' }} />
        </Upload>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
export default Profile
