import React, { useState } from "react";
import { useModel, history } from "umi";
import { message } from "antd";
import { dispacthAction } from "@/services/api/article";



type IconTextProps = {
  icon: any;
  type?: 1 | 2;
  articleId?: string;
  array?: string[]
  num?: number
}
const IconText = ({ icon, type, articleId, array = [], num }: IconTextProps) => {
  const { initialState } = useModel('@@initialState')
  const [count, setCount] = useState(array.length)
  const [isflag, setIsFlag] = useState(array.includes(initialState?.currentUser?.userId || ''))
  async function handleAction() {
    if (!initialState?.currentUser) {
      message.error('您还未登录!')
      history.push('/user/login')
    }
    const res = await dispacthAction(type!, isflag, initialState?.currentUser?.userId!, articleId!)
    if (!res.code) {
      message.error('操作失败!请重试')
    }
    else {
      setCount(isflag ? count - 1 : count + 1)
      setIsFlag(!isflag)
    }
  }
  return (
    <span
      style={{ color: isflag ? '#1890ff' : '' }}
      onClick={type ? () => handleAction() : void 0}
    >
      {React.createElement(icon, { style: { marginRight: 8 } })}
      {num ? num : count}
    </span>
  )
}

export default IconText