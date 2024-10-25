import { watch, ref } from 'vue'
import { useTitle as usePageTitle } from '@vueuse/core'
import { useGlobSetting } from '@/hooks/setting'

/**
 * 监听页面改变并且修改标题title
 */
export const useTitle = (newTitle?: string) => {
  const { title } = useGlobSetting()

  const tTitle = ref(newTitle ? `${newTitle} - ${title} ` : `${title}`)

  const pageTitle = usePageTitle()
  watch(
    tTitle,
    (n, o) => {
      if (n !== o) {
        pageTitle.value = n
      }
    },
    { immediate: true }
  )
  return tTitle
}
