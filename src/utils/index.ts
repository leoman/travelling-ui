// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (callback: any, wait: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    const next = () => callback(...args)
    clearTimeout(timeout)
    timeout = setTimeout(next, wait)
  }
}
