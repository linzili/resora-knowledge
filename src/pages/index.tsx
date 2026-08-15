import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const tracks = [
  {
    title: 'Go 基础与工程化',
    description: '从类型、接口、Context、并发到测试和运行时。',
    to: '/docs/course/phase-01-go',
  },
  {
    title: 'HTTP 与数据层',
    description: '用 chi、PostgreSQL、pgx、goose 和 sqlc 完成可靠 API。',
    to: '/docs/course/phase-02-http',
  },
  {
    title: '服务与设备平台',
    description: '用契约、Connect RPC、NATS、MQTT 逐步进入分布式系统。',
    to: '/docs/course/phase-05-contracts',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="Resora Knowledge"
      description="从 Go 到 IoT 平台的系统学习知识库">
      <main>
        <section className={styles.intro}>
          <div className="container">
            <p className={styles.eyebrow}>RESORA KNOWLEDGE</p>
            <Heading as="h1">从 Go 到 IoT 平台，沿着一个项目学深。</Heading>
            <p className={styles.lead}>
              每个主题都经过原理、项目实现、失败测试、故障实验和交付复盘，不停留在孤立 Demo。
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs/course/roadmap">
                查看完整路线
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/intro">
                从入口开始
              </Link>
            </div>
          </div>
        </section>

        <section className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>LEARNING TRACKS</p>
            <Heading as="h2">当前学习主线</Heading>
          </div>
          <div className={styles.trackGrid}>
            {tracks.map((track) => (
              <Link className={styles.track} to={track.to} key={track.to}>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <span>进入课程 →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
