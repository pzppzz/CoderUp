import React, { useState } from 'react'
import { history } from 'umi'
import { Alert, Button, Input, message, Modal, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { UploadRequestOption } from 'rc-upload/lib/interface'
/** markdown转html */
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import styles from './index.less'
import Quill from 'quill'

function beforeUpload(file: RcFile) {
  const isMdFile = file.name.split('.').pop() === 'md';
  if (!isMdFile) {
    message.error('暂时只支持解析md文件!');
  }
  return isMdFile
}
const ToolBar: React.FC<{
  toolTip: string,
  // title: MutableRefObject<string>,
  article: React.MutableRefObject<TYPE.Article>,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  quill: React.MutableRefObject<Quill | undefined>
}> = ({
  quill,
  article,
  toolTip,
  setVisible,
  handleChange
}) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    /** 自定义上传 */
    const handleUpload = async (fileObj: UploadRequestOption) => {
      try {
        const fileReader = new FileReader()
        fileReader.onload = async evt => {
          /** markdown解析 */
          const file = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeStringify)
            .process(evt.target?.result as string)
          quill.current!.root.innerHTML = String(file)
          fileObj.onSuccess!(String(file))
        }
        fileReader.onerror = () => {
          throw new Error('导入文件失败!')
        }
        fileReader.readAsText(fileObj.file as RcFile)
        // fileObj.onSuccess!(data.tempFileURL)
      } catch (err) {
        message.error('导入文件失败!')
        console.log(err);
      }
    }
    return (
      <div className={styles.toolbar}>
        <Input
          type="text"
          size="large"
          placeholder="请输入文章标题"
          defaultValue={article.current.title}
          key={article.current._id}
          maxLength={30}
          bordered={false}
          onChange={handleChange}
        />
        <span className={styles.message}>{toolTip}</span>
        <Button className={styles.button} onClick={() => setModalVisible(true)}>导入文档</Button>
        <Button className={styles.button} onClick={() => history.push('/op/creator/posts?status=2')}>
          草稿箱
        </Button>
        <Button
          type="primary"
          className={styles.button}
          onClick={() => {
            setVisible(true)
          }}
        >
          发布
        </Button>
        <Modal
          visible={modalVisible}
          width={360}
          title="导入文档"
          bodyStyle={{ textAlign: 'center' }}
          onCancel={() => setModalVisible(false)}
          maskClosable={false}
          footer={
            <Alert
              message={ 
                <dl style={{textAlign: 'left'}}>
                  <dd>注意事项</dd>
                  <dt>* 当前只支持导入md格式文件</dt>
                  <dt>* 图片需重新上传</dt>
                  <dt>* 一些markdown语法无法解析</dt>
                </dl>
              }
              type="info" showIcon
            />
          }
        >
          <Upload
            beforeUpload={beforeUpload}
            showUploadList={false}
            customRequest={handleUpload}
            onChange={(info) => {
              if (info.file.status === 'uploading') {
                return;
              }
              if (info.file.status === 'done') {
                message.success('导入文件成功!')
                setModalVisible(false)
              }
            }}
          >
            <div style={{
              width: 200,
              height: 200,
              background: '#fafafa',
              lineHeight: '200px',
              cursor: 'pointer',
              border: '1px solid #ddd'
            }}
            >
              +Upload
            </div>
          </Upload>
        </Modal>
      </div>
    )
  }
export default ToolBar