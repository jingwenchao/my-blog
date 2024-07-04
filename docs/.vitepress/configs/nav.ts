import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '前端导航', link: '/nav/' },
  { text: '主页', link: 'https://fe-mm.com' },
  {
    text: '别听水星记',
    link: 'https://notes.fe-mm.com',
  },
  { text: 'mmPlayer', link: 'https://netease-music.fe-mm.com' },
  {
    text: '笔记',
    items: [
      { text: 'JavaScript', link: '/notes/javascript/' },
      { text: 'TypeScript', link: '/notes/typescript/' },
    ]
  },
]
