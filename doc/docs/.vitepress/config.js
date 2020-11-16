const config = {
  title: '简约而不简单的文档',
  themeConfig: {
    repo: 'https://github.com/xiaoxian521',
    docsDir: 'docs',
    locales: {
      '/': {
        lang: 'zh-CN',
        nav: [
          { text: '书写规范', link: '/zh/standard/' },
        ],
        sidebar: [
          {
            text: '简介',
            children: [
              { text: '项目描述', link: '/zh/introduction/description' },
              { text: '开源精神', link: '/zh/introduction/openSource' },
              { text: '贡献者', link: '/zh/introduction/contributor' },
            ],
          },
        ],
      },
      '/en/': {
        lang: 'en-US',
        nav: [
          { text: 'Standard', link: '/en/standard/' },
        ],
        sidebar: [
          {
            text: 'introduction',
            children: [
              { text: 'description', link: '/en/introduction/description' },
              { text: 'openSource', link: '/en/introduction/openSource' },
              { text: 'contributor', link: '/en/introduction/contributor' },
            ],
          },
        ],
      },
    }
  }
}

module.exports = config