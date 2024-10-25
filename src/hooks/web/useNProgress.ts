import { useCssVar } from '@vueuse/core'
import type { NProgressOptions } from 'nprogress'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const primaryColor = useCssVar('--el-color-primary', document.documentElement)

export const useNProgress = () => {
  NProgress.configure({
    // 动画方式
    easing: 'ease',
    // 递增进度条的速度
    speed: 500,
    // 是否显示加载ico
    showSpinner: false,
    // 自动递增间隔
    trickleSpeed: 200,
    // 初始化时的最小百分比
    minimum: 0.3,
    // 加载条的父元素
    parent: 'body'
  } as NProgressOptions)

  const initColor = async () => {
    await nextTick()
    const bar = document.getElementById('nprogress')?.getElementsByClassName('bar')[0] as ElRef
    if (bar) {
      bar.style.background = unref(primaryColor.value) as string
    }
  }

  initColor()

  const start = () => {
    NProgress.start()
  }

  const done = () => {
    NProgress.done()
  }

  return {
    start,
    done
  }
}
