import request from "@/utils/request";
import Compressor from 'compressorjs';
import { UploadRequestOption } from 'rc-upload/lib/interface'

export const uploadFile = (fileObj: UploadRequestOption) => {
  return new Promise<TYPE.ResponseResult<{tempFileURL: string}>>((resolve, reject) => {
    new Compressor(fileObj.file as File, {
      quality: 0.6,
      success(result: File) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          const res = request(
            '/api/file/upload', {
            method: 'POST',
            data: {
              file: reader.result,
              filename: result.name
            }
          })
          resolve(res)
        }
      },
      error(e) {
        console.log(e)
        reject({ code: 0, msg: '上传失败!' })
      },
    })
  })
}

export const deleteFile = (url: string) => {
  return request<TYPE.ResponseResult>(
    '/api/file/delete', {
      method: 'POST',
      data: {
        url
      }
    }
  )
}