import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { CardData, getCardData, getChartsData } from "@/services/api/user";
import { Line, LineConfig } from "@ant-design/plots";
import styles from './index.less'

const Analysis: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({})
  const [data, setData] = useState<any>([])

  const config: LineConfig & React.RefAttributes<unknown> = {
    data,
    xField: '_id',
    yField: 'count',
    seriesField: 'name',
    yAxis: {
      label: {
        formatter: (v) => `${(+v).toFixed(0)}`,
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    // @TODO 后续会换一种动画方式
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  useEffect(() => {
    getCardData()
      .then(res => {
        if (res.code) {
          setCardData(res.data || {})
        }
      })
      .catch(console.log)
      .finally(() => {
        getChartsData()
        .then(res => {
          if (res.data) {
            const articles = res.data.all_articles.map((item: any) => ({...item, name: '文章数'}))
            const views = res.data.all_views.map((item: any) => ({...item, name: '阅读数'}))
            const likes = res.data.all_likes.map((item: any) => ({...item, name: '点赞数'}))
            const comments = res.data.all_comments.map((item: any) => ({...item, name: '评论数'}))
            const collects = res.data.all_collects.map((item: any) => ({...item, name: '收藏数'}))
            setData([...articles, ...views, ...likes, ...comments, ...collects])
          }
        })
        .catch(console.log)
      })
  }, [])
  return <div className={styles.analysis}>
    <Card title="数据展示">
      <Row gutter={[16, 16]}>
      <Col span={8}>
          <Card className={styles.colcard}>
            <Statistic title="总文章数" valueStyle={{fontSize: 30, fontWeight: 'bold'}} value={cardData.all_articles} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.colcard}>
            <Statistic title="文章评论数" valueStyle={{fontSize: 30, fontWeight: 'bold'}} value={cardData.all_comments} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.colcard}>
            <Statistic title="文章点赞数" valueStyle={{fontSize: 30, fontWeight: 'bold'}} value={cardData.all_likes} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.colcard}>
            <Statistic title="文章收藏数" valueStyle={{fontSize: 30, fontWeight: 'bold'}} value={cardData.all_collects} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.colcard}>
            <Statistic title="文章阅读数" valueStyle={{fontSize: 30, fontWeight: 'bold'}} value={cardData.all_views} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className={styles.colcard}>
            <Statistic title="主页访问量" valueStyle={{fontSize: 30, fontWeight: 'bold'}} value={cardData.page_view} />
          </Card>
        </Col>
      </Row>
    </Card>
    <Card title="数据趋势(近七天)" style={{ marginTop: 24 }}>
    <Line {...config} />
    </Card>
  </div>
}
export default Analysis