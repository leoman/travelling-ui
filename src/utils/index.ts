export const debounce = (callback: any, wait: number) => {
  let timeout: any = null
  return (...args: any) => {
    const next = () => callback(...args)
    clearTimeout(timeout)
    timeout = setTimeout(next, wait)
  }
}
