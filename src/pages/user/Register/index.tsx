import React, { useEffect, useRef, useState } from "react";
import { history, Redirect, useModel } from "umi";
import md5 from 'md5'
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-form";
import { Button, Divider, message, Result } from "antd";

import { register } from "@/services/api/user";
import './index.less'
const Register: React.FC = () => {
  const [time, setTime] = useState(5)
  const [registerState, setRegisterState] = useState<boolean>(false)
  const { initialState } = useModel('@@initialState');
  const ref = useRef(time)
  ref.current = time
  if (initialState?.currentUser) {
    return <Redirect to={'/'} />
  }
  const handleSubmit = async ({ password, confirmPassword, username }: TYPE.RegisterParam) => {
    const res = await register({
      password: md5(password),
      confirmPassword: md5(confirmPassword),
      username
    })
    if (res.code) {
      setRegisterState(true)
    } else {
      message.error(res.msg)
    }
  }
  useEffect(() => {
    let timer: NodeJS.Timer
    if (registerState) {
      timer = setInterval(() => {
        if (ref.current <= 1) {
          clearInterval(timer)
          history.replace('/user/login')
        }
        setTime(ref.current - 1)
      }, 1000)
    } else {
      setTime(5)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [registerState])
  return (
    <div className="user-register">
      {
        registerState
          ? <div style={{width: 500, margin: '100px auto', background: '#fff'}}>
            <Result
            status="success"
            title="恭喜您，注册成功!"
            subTitle={ref.current + "秒后自动跳转到登录页"}
            extra={[
              <Button key="confirm" type="primary" onClick={() => history.replace('/user/login')}>
                去登陆
              </Button>,
              <Button key="cancle" onClick={() => setRegisterState(false)}>
                取消
              </Button>,
            ]}
          />
          </div>
          :
          <div className="formfield">
            <LoginForm
              title="CoderUp注册"
              style={{overflow: 'hidden'}}
              submitter={{
                submitButtonProps: {
                  className: 'register-btn',
                  size: 'large',
                  shape: 'round'
                },
                searchConfig: {
                  submitText: '确认注册'
                }
              }}
              subTitle={<Divider />}
              onFinish={async (values) => {
                await handleSubmit(values as TYPE.RegisterParam);
              }}
            >
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  bordered: false,
                  className: 'register-input',
                  prefix: <UserOutlined />,
                }}
                placeholder="请输入用户名"
                rules={[
                  {
                    required: true,
                    message: "请输入用户名"
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  bordered: false,
                  className: 'register-input',
                  prefix: <LockOutlined />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: "请输入密码"
                  },
                ]}
              />
              <ProFormText.Password
                name="confirmPassword"
                dependencies={['password']}
                fieldProps={{
                  size: 'large',
                  bordered: false,
                  className: 'register-input',
                  prefix: <LockOutlined />,
                }}
                placeholder="请确认密码"
                rules={[
                  {
                    required: true,
                    message: "请确认密码"
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject(new Error('两次密码不一致!'))
                      }
                    }
                  })
                ]}
              />
              <div
                style={{
                  marginBottom: 24,
                  overflow: 'hidden'
                }}
              >
                <a
                  style={{
                    float: 'right',
                  }}
                  href="/user/login"
                >
                  已有账号? 去登陆
                </a>
              </div>
            </LoginForm>
          </div>
      }
    </div>
  )
}
export default Register