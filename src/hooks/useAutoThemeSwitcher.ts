export default function useAutoThemeSwitcher(appStore: ReturnType<typeof useAppStore>) {
  const handleAttributeChange = () => {
    const rootElement = document.documentElement
    const mode = rootElement.classList.contains('dark') ? 'dark' : 'light'
    appStore.switchMode(mode)
  }

  const observerOptions = {
    attributes: true,
    attributeFilter: ['class']
  }

  const observer = new MutationObserver(handleAttributeChange)

  const targetElement = document.querySelector('html')!

  const initializeThemeSwitcher = () => {
    observer.observe(targetElement, observerOptions)
  }

  return { initializeThemeSwitcher }
}
