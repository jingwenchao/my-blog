import { h, watch } from 'vue'
import { useData, EnhanceAppContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { createMediumZoomProvider } from './composables/useMediumZoom'
import MLayout from './components/MLayout.vue'
import MNavLinks from './components/MNavLinks.vue'
import './styles/index.scss'
let homePageStyle: HTMLStyleElement | undefined
export default {
  extends: DefaultTheme,
  Layout: () => {
    const props: Record<string, any> = {}
    // 获取 frontmatter
    const { frontmatter } = useData()
    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass
    }
    return h(MLayout, props)
  },
  async enhanceApp({ app, router }: EnhanceAppContext) {
    createMediumZoomProvider(app, router)
    app.provide('DEV', process.env.NODE_ENV === 'development')
    app.component('MNavLinks', MNavLinks)
    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () =>
          updateHomePageStyle(
            /* /vitepress-nav-template/ 是为了兼容 GitHub Pages */
            location.pathname === '/' || location.pathname === '/vitepress-nav-template/',
          ),
        { immediate: true },
      )
    }
    if (!import.meta.env.SSR) {
      const { loadOml2d } = await import('oh-my-live2d')
      loadOml2d({
        sayHello: false, // 不在控制台打印项目信息
        dockedPosition: 'left', // 桌面位置
        mobileDisplay: true, // 移动端是否展示
        primaryColor: '#00A9B0', // 主题色
        tips: {
          messageLine: 3, // 超出 3 行 省略
          copyTips: {
            // 复制时提示
            message: [
              '你复制了什么内容呢?记得注明出处哦~',
              '主人，你要有出息了，有人复制你东西了~',
            ],
          },
          idleTips: {
            // 闲置时提示
            wordTheDay(wordTheDayData) {
              return `${wordTheDayData.hitokoto}    by.${wordTheDayData.from}`
            },
          },
        },
        statusBar: {},
        menus: {
          items: [
            {
              id: 'Rest',
              icon: 'icon-rest',
              title: '休息',
              onClick(oml2d): void {
                oml2d.statusBarOpen('休息一会儿')
                oml2d.stageSlideOut()
              },
            },
            {
              id: 'SwitchModel',
              icon: 'icon-switch',
              title: '切换模型',
              onClick(oml2d): void {
                // actions ...
                oml2d.loadNextModel()
              },
            },
            {
              id: 'About',
              icon: 'icon-about', 
              title: '关于',
              onClick(oml2d): void {
                oml2d.loadNextModel();
              }
            }
          ],
        },
        models: [
          // {
          //   path: 'https://model.oml2d.com/Kar98k-normal/model.json',
          //   position: [-60, -10],
          //   // scale: 0.08,
          //   // motionPreloadStrategy: 'ALL',
          //   stageStyle: {
          //     width: 280,
          //     height: 450,
          //   },
          // },
          {
            path: 'https://model.oml2d.com/HK416-2-normal/model.json',
            // scale: 0.15,
            position: [60, 30],
            // stageStyle: {
            //   width: 220,
            //   height: 450,
            // },
          },
          // {
          //   path: 'https://model.oml2d.com/HK416-1-normal/model.json',
          //   // scale: 0.15,
          //   position: [-80, 0],
          //   stageStyle: {
          //     width: 350,
          //     height: 480,
          //   },
          // },
          // {
          //   path: 'https://model.oml2d.com/Senko_Normals/senko.model3.json',
          //   // scale: 0.15,
          //   position: [-60, 160],
          //   stageStyle: {
          //     width: 250,
          //     height: 450,
          //   },
          // },
        ],
      })
    }
  },
}

setTimeout(() => {
  const oml2dStage = document.querySelectorAll('canvas')
  // if (oml2dStage) {
  //   oml2dStage.style.display = 'block'
  // }
  oml2dStage.forEach((oml2dStage) => {
    makeElementDraggable(oml2dStage)
  })
}, 1000)

if (typeof window !== 'undefined') {
  // detect browser, add to class for conditional styling
  const browser = navigator.userAgent.toLowerCase()
  if (browser.includes('chrome')) {
    document.documentElement.classList.add('browser-chrome')
  } else if (browser.includes('firefox')) {
    document.documentElement.classList.add('browser-firefox')
  } else if (browser.includes('safari')) {
    document.documentElement.classList.add('browser-safari')
  }
}

// Speed up the rainbow animation on home page
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return
    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return
    homePageStyle.remove()
    homePageStyle = undefined
  }
}

// 函数：使元素可以拖动
function makeElementDraggable(element: HTMLElement) {
  let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;
  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    initialX = event.clientX - offsetX;
    initialY = event.clientY - offsetY;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  const onMouseMove = (event: MouseEvent) => {
    offsetX = event.clientX - initialX;
    offsetY = event.clientY - initialY;
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  };
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  element.addEventListener('mousedown', onMouseDown);
}