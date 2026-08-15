import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Resora Knowledge',
  tagline: '从 Go 到 IoT 平台的系统学习知识库',
  favicon: 'img/favicon.ico',

  url: 'https://linzili.github.io',
  baseUrl: '/resora-knowledge/',
  organizationName: 'linzili',
  projectName: 'resora-knowledge',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: true,
          editUrl: 'https://github.com/linzili/resora-knowledge/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['zh', 'en'],
        indexDocs: true,
        indexPages: true,
        indexBlog: false,
        searchResultLimits: 10,
        searchResultContextMaxLength: 80,
        highlightSearchTermsOnTargetPage: true,
        removeDefaultStopWordFilter: ['en'],
        searchBarShortcutKeymap: 'mod+k',
      },
    ],
  ],

  themeConfig: {
    metadata: [
      {
        name: 'keywords',
        content: 'Go, PostgreSQL, chi, sqlc, Connect RPC, NATS, MQTT, IoT',
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Resora Knowledge',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'learningSidebar',
          position: 'left',
          label: '课程',
        },
        {
          to: '/docs/knowledge',
          label: '知识索引',
          position: 'left',
        },
        {
          href: 'https://github.com/linzili/resora-go-lab',
          label: '代码仓库',
          position: 'right',
        },
        {
          href: 'https://github.com/linzili/resora-knowledge',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '开始学习',
          items: [
            {
              label: '课程路线',
              to: '/docs/course/roadmap',
            },
            {
              label: 'Go 基础',
              to: '/docs/course/phase-01-go',
            },
          ],
        },
        {
          title: '相关仓库',
          items: [
            {
              label: 'resora-go-lab',
              href: 'https://github.com/linzili/resora-go-lab',
            },
            {
              label: 'resora-knowledge',
              href: 'https://github.com/linzili/resora-knowledge',
            },
          ],
        },
      ],
      copyright: `Resora Knowledge · ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
