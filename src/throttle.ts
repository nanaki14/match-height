export const throttle = (fn: () => void, threshhold: number) => {
  let last: number
  let deferTimer: number

  return function () {
    const now = Date.now()

    if (last && now < last + threshhold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fn()
      }, threshhold)
    } else {
      last = now
      fn()
    }
  }
}
