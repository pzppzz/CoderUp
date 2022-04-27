import React, { useEffect } from 'react'
import { useRequest } from 'umi'
import { Line, Column, LineConfig, ColumnConfig } from '@ant-design/plots'
import Loading from '@/components/Loading'
import { getOpHomeData } from '@/services/api/getOpDate'
import styles from './index.less'
import { Card, Col, Row, Statistic } from 'antd'
const Index: React.FC = () => {
  const { loading, data, error } = useRequest(() => {
    return getOpHomeData()
  })
  const lineConfig: LineConfig & React.RefAttributes<unknown> = {
    data: data?.user_analysis || [],
    padding: 'auto',
    xField: 'date',
    yField: 'count',
    xAxis: {
      // type: 'timeCat',
      tickCount: 7,
    },
    yAxis: {
      // label: {
      //   formatter: (v) => `${(+v).toFixed(0)}`,
      // },
      tickInterval: Math.ceil((data?.user_total || 1) / 10)
    },
    meta: {
      date: {
        alias: '时间',
      },
      count: {
        alias: '新增数量',
      },
    },
    smooth: true,
  };
  const columnConfig: ColumnConfig & React.RefAttributes<unknown> = {
    data: data?.article_type || [],
    xField: 'type',
    yField: 'article_count',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '文章分类',
      },
      article_count: {
        alias: '文章数量',
      },
    },
  };
  return (
    <Loading loading={loading}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="用户数量" value={data?.user_total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="用户数量" value={data?.user_total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="用户数量" value={data?.user_total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="用户数量" value={data?.user_total} />
          </Card>
        </Col>
      </Row>
      <Card title="用户增长情况(最近七天)" style={{ marginTop: 12 }}>
        <Line {...lineConfig} />
      </Card>
      <Card title="文章分类情况" style={{ marginTop: 12 }}>
        <Column {...columnConfig} />
      </Card>
    </Loading>
  )
}
export default Index
