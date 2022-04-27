import React, { useEffect, useRef, useState } from 'react'
import { history } from 'umi';
import Quill from 'quill'
import ToolBar from './components/ToolBar';
import PostSetting from './components/PostSetting';
import { createArticle, getDetail, updateArticle } from '@/services/api/article';
import 'quill/dist/quill.snow.css';
import './index.less'
import { notification } from 'antd';
const Write: React.FC = () => {
  const [toolTip, setToolTip] = useState<string>('文章将自动保存到草稿箱')
  const [visible, setVisible] = useState<boolean>(false)
  // 处理闭包问题
  const flag = useRef<boolean>(false)
  const quill = useRef<Quill>()
  const curArticle = useRef<TYPE.Article>({})

  const { pathname } = history.location

  // 标题输入框变化处理
  function handleChange() {
    let timer: NodeJS.Timeout | null = null
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(async () => {
        setToolTip('保存中')
        const title = e.target.value
        let res
        if (!curArticle.current.articleId) {
          res = await createArticle({ title })
          history.replace(`/op/creator/edit/${res.data?.articleId}`)
        } else {
          res = await updateArticle({ articleId: curArticle.current.articleId, title })
        }
        if (res && res.code === 1) {
          curArticle.current = res.data!
        }
        setToolTip('保存成功')
      }, 1000)
    }
  }
  // 初始化
  async function init() {
    let ext = pathname.split('/').pop(),
    id = ext
    // 判断quill是否初始化
    if (!quill.current) {
      const editQuill = new Quill('.editor', {
        theme: 'snow',
        placeholder: '请输入正文......',
        modules: {
          toolbar: [
            { align: [] },
            { color: [] },
            'bold', 'italic', 'underline',
            { header: 1 }, { header: 2 }, {header: [1,2,3]},
            { list: 'ordered' }, { list: 'bullet' },
            'blockquote', 'code-block', 'image', 'link', 'clean'
          ],
          history: {
            delay: 1000, // 2s记录一次操作历史
            maxStack: 100, // 最大记录100次操作历史
          }
        }
      })
      quill.current = editQuill
      editQuill.focus()
      let timer: NodeJS.Timeout
      // 内容修改一秒后自动保存， 节流
      editQuill.on('text-change', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(async () => {
          if (flag.current) {
            flag.current = false
            return
          }
          setToolTip('保存中')
          const html_content = editQuill.root.innerHTML
          let res
          if (!curArticle.current.articleId) {
            res = await createArticle({ html_content })
            if (res.code) {
              history.replace(`/op/creator/edit/${res.data?.articleId}`)
            }
          } else {
            res = await updateArticle({ articleId: curArticle.current.articleId, html_content })
          }
          if (res && res.code === 1) {
            curArticle.current = res.data!
          }
          setToolTip('保存成功')
        }, 1000)
      })
    } else {
      if (id === 'new') {
        quill.current.root.innerHTML = ''
        flag.current = true
      }
    }
  // 如果是创建新文章，初始化所有信息
  if (id === 'new') {
    quill.current!.root.innerHTML = ''
    curArticle.current = {}
    setToolTip('文章将自动保存到草稿箱')
  } else {
    // 编辑文章，获取文章信息
    const res = await getDetail(id as string)
    if (res && res.data) {
      quill.current!.root.innerHTML = res.data.html_content || ''
      curArticle.current = res.data as TYPE.Article
    } else {
      notification.error({
        placement: 'topRight',
        message: '内容不存在',
        duration: 2
      })
      flag.current = false
      history.replace('/op/creator/edit/new')
    }
  }

  }
  useEffect(() => {
    //页面刷新
    init()
  }, [pathname])
  return (
    <div className='editor-container'>
      <div className='editor'>
      </div>
      <ToolBar
        toolTip={toolTip}
        article={curArticle}
        // title={title}
        handleChange={handleChange()}
        setVisible={setVisible}
        quill={quill}
      />
      <PostSetting article={curArticle} visible={visible} setVisible={setVisible} />
    </div>
  )
}
export default Write

