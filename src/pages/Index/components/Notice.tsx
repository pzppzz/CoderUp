import { Button, Divider, Modal, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useModel } from 'umi'

const Notice: React.FC = () => {
  const { initialState } = useModel('@@initialState')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  useEffect(() => {
    if (initialState?.currentUser && 
      !initialState.currentUser.last_logintime) {
      setIsVisible(true)
    }
  }, [initialState])
  return (
    <Modal
      title="欢迎使用CoderUp"
      visible={isVisible}
      maskClosable={false}
      footer={<Button type="primary" onClick={() => setIsVisible(false)}>我知道了</Button>}
    >
      <Typography>
        CoderUp已发布最初测试版，还有很多功能没有上线，但是站长一定会努力把它做全做好的
      </Typography>
      <Divider />
      <Typography>
        目前该项目没有做过测试，还请大佬们手下留情，小破站经受不住打击，推荐攻击鱼皮大佬的网站<a target="_blank" href='http://ce.mianshiya.com/'><strong>测试鸭</strong></a>，
      </Typography>
      <Divider />
      <Typography>
        目前暂时发现的项目bug都已被解决，若使用过程中发现了bug，或者有细节觉得不好，有更好的想法，一定要联系我啊!
        非常感谢你们！😀
        最后附上我的微信<a target="_blank" href="https://626c-blog-cloudbase-0geo5pt74e4dd9a3-1307903579.tcb.qcloud.la/static/pz%E5%BE%AE%E4%BF%A1.jpg?sign=0ff7b4623e06f7f70009db90975b035b&t=1650273054"><strong>二维码</strong></a>
      </Typography>
    </Modal>
  )
}
export default Notice
