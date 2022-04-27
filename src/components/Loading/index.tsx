import React from "react";
import './index.css'
// 定义props类型
type LoadingProps = {
  loading?: boolean; //是否加载中
  text?: string; //加载描述文字
}
const Loading: React.FC<LoadingProps> = ({
  children,
  text,
  loading = true,
}) => {
  return (
    <>
      {
        loading
          ? <div className="loading-wrap">
            <div className="spin-dot">
              <i className="spin-dot-item"></i>
              <i className="spin-dot-item"></i>
              <i className="spin-dot-item"></i>
              <i className="spin-dot-item"></i>
            </div>
            {text ? <span>{text}</span> : null}
          </div>
          : children
      }
    </>
  )
}
export default Loading