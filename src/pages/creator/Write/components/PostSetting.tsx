import React, { MutableRefObject, useEffect, useState } from 'react'
import { message, notification, Tag } from 'antd';
import {
  DrawerForm,
  ProFormUploadDragger,
  ProFormTextArea,
  ProFormItem,
  ProFormSelect
} from '@ant-design/pro-form';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { deleteFile, uploadFile } from '@/services/api/file';
import { UploadFile } from 'antd/lib/upload/interface';
import { getTagList } from '@/services/api/tag';
import { DefaultOptionType } from 'antd/lib/select';
import { updateArticle } from '@/services/api/article';
import { history } from 'umi';

type Iprops = {
  article: MutableRefObject<TYPE.Article>,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
const { CheckableTag } = Tag

// 图片上传前格式大小限制
export function beforeUpload(file: File) {
  const isFileTypeValid =
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg' ||
    file.type === 'image/png'
  if (!isFileTypeValid) {
    message.error('只能上传 JPG/PNG/JPEG 格式的图片!');
    return Promise.reject('只能上传 JPG/PNG/JPEG 格式的图片!')
  }
  const isSafeSize = file.size / 1024 / 1024 < 1;
  if (!isSafeSize) {
    message.error('图片必须小于 1MB!');
    return Promise.reject('图片必须小于 1MB!')
  }
  return isFileTypeValid && isSafeSize;
}
export function handleChange(info: UploadChangeParam) {
  if (info.file.status === 'uploading') {
    return;
  }
  if (info.file.status === 'done') {
    message.success('图片上传成功!')
    return
  }
}

// 分类
const typeData: string[] = ['前端', '后端', '测试', '移动端', 'PC端']


const PostSetting: React.FC<Iprops> = ({ visible, setVisible, article }) => {
  // 文章分类
  const [type, setType] = useState<string>('')
  // 标签列表
  const [tagList, setTagList] = useState<DefaultOptionType[]>([])
  // 封面
  const [coverUrl, setCoverUrl] = useState<string>(article.current.cover_url || '')

  /** 自定义上传 */
  const handleUpload = async (fileObj: UploadRequestOption) => {
    try {
      const { data } = await uploadFile(fileObj);
      if (!data) {
        return
      }
      if (article.current.cover_url) {
        await deleteFile(article.current.cover_url)
      }
      const res = await updateArticle({ articleId: article.current.articleId, cover_url: data.tempFileURL })
      article.current = res.data || {}
      setCoverUrl(data.tempFileURL)
      fileObj.onSuccess!(data.tempFileURL)
    } catch (err) {
      message.error('上传失败!')
      console.log(err);
    }
  }
  /** 获取标签 */
  const getList = () => {
    getTagList({ current: 1, pageSize: 20 })
      .then(res => {
        if (res.code === 1) {
          const list = res.data!.map(item => ({ label: item.tag_name, value: item.tag_color }))
          setTagList([...tagList, ...list])
        }
      })
      .catch(err => {
        console.log('获取标签失败!')
      })
  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <DrawerForm
      width={500}
      layout="horizontal"
      title="发布设置"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      visible={visible}
      onVisibleChange={setVisible}
      submitter={{
        searchConfig: {
          submitText: (article.current.status === 0 ||
            article.current.status === 1)
            ? '确认更新' : '确认发布',
          resetText: '取消'
        }
      }}
      onFinish={async formData => {
        if (!article.current.title) {
          notification.error({
            placement: 'top',
            message: '标题不能为空!'
          })
          return Promise.reject(false)
        }
        if (!article.current.html_content) {
          notification.error({
            placement: 'top',
            message: '内容不能为空!'
          })
          return Promise.reject(false)
        }
        let { tags, description } = formData
        tags = tags.map((tag: { label: string, value: string }) => ({
          tag_name: tag.label,
          tag_color: tag.value
        }))
        /** 发布 */
        const res = await updateArticle({
          articleId: article.current.articleId,
          cover_url: article.current.cover_url ? article.current.cover_url : coverUrl,
          tags,
          description,
          type,
          status: article.current.status === 1 ? 1 : 0
        })
        if (res.code) {
          history.replace('/published', article.current.articleId)
        } else {
          message.error('发布失败!，请重试')
          return Promise.reject(false)
        }
      }}
    >
      <ProFormItem
        label="选择分类"
        name="type"
        required
        rules={[
          () => ({
            validator() {
              if (!type) {
                return Promise.reject('请选择一个分类')
              }
              return Promise.resolve()
            }
          })
        ]}
      >
        {typeData.map((t, index) => (
          <CheckableTag
            key={index}
            checked={type === t}
            onChange={checked => checked ? setType(t) : setType('')}
          >
            <span style={{ fontSize: 14, padding: 6 }}>{t}</span>
          </CheckableTag>
        ))}
      </ProFormItem>
      <ProFormSelect
        width="md"
        name="tags"
        required
        label="选择标签"
        mode="multiple"
        options={tagList}
        fieldProps={{
          labelInValue: true,
          showArrow: true,
          listHeight: 400,
          defaultValue: article.current.tags?.map(item => ({ label: item.tag_name, value: item.tag_color })),
          tagRender: (props) => {
            const { label, value, closable, onClose } = props;
            return (
              <Tag
                key={value as string + label}
                color={value}
                onMouseDown={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                closable={closable}
                onClose={onClose}
              >
                {label}
              </Tag>
            )
          },
          // onPopupScroll: target => {
          //   console.log(target);
          // }
        }}
        rules={[
          {
            required: true,
            message: '请至少选择一个标签'
          },
          (() => ({
            validator(_, value) {
              if (value && value.length > 2) {
                return Promise.reject('最多选择两个标签')
              }
              return Promise.resolve()
            }
          }))
        ]}
        placeholder="请至少选择一个标签"
      />
      <ProFormUploadDragger
        name="cover"
        label="文章封面"
        title="点击上传"
        max={1}
        description={false}
        wrapperCol={{ span: 12 }}
        accept='.jpg,.png,.jpeg,.gif'
        fieldProps={{
          listType: 'picture-card',
          maxCount: 1,
          beforeUpload,
          onPreview: (file: UploadFile) => {
            window.open(file.url)
          },
          onRemove: async (file: UploadFile) => {
            const res = await deleteFile(file.url as string)
            if (!res.code) {
              return Promise.reject('删除文件失败!')
            }
            const { data } = await updateArticle({
              articleId: article.current.articleId,
              cover_url: ''
            })
            article.current = data!
          },
          defaultFileList: article.current.cover_url
            ? [{ uid: '1', name: '', status: 'done', url: article.current.cover_url }]
            : undefined,
          onChange: handleChange,
          customRequest: handleUpload
        }}
      >
      </ProFormUploadDragger>
      <ProFormTextArea
        width="md"
        required
        name="description"
        label="编辑简介"
        placeholder="请输入简介,至少50个字"
        rules={[
          {
            required: true,
            message: '请输入简介,至少50个字'
          }
        ]}
        fieldProps={{
          rows: 4,
          minLength: 50,
          maxLength: 100,
          showCount: true,
          defaultValue: article.current.description
        }}
      />
    </DrawerForm>
  )
}
export default PostSetting
