const errorThreshold = 1

export const matchHeight = (params: { selector?: string }) => {
  let initialized = false
  let remains: {
    element: globalThis.HTMLElement
    top: number
    height: number
  }[]
  const targets = document.querySelectorAll<globalThis.HTMLElement>(
    params.selector || '[data-mh]'
  )

  const init = () => {
    initialized = true
    update()
  }

  const update = () => {
    if (!initialized) {
      init()
    }

    if (!targets.length) return

    remains = [...targets].map((element) => {
      return {
        element,
        top: 0,
        height: 0,
      }
    })
    // remove all height before
    remains.forEach((item) => {
      item.element.style.minHeight = ''
    })
    process()
  }

  const process = () => {
    remains.forEach((item) => {
      const bb = item.element.getBoundingClientRect()

      item.top = bb.top
      item.height = bb.height
    })

    remains.sort((a, b) => a.top - b.top)

    const processingTop = remains[0].top
    const processingTargets = remains.filter(
      (item) => Math.abs(item.top - processingTop) <= errorThreshold
    )
    const maxHeightInRow = Math.max(
      ...processingTargets.map((item) => item.height)
    )

    processingTargets.forEach((item) => {
      const error = processingTop - item.top + errorThreshold
      const paddingAndBorder =
        parseFloat(
          window.getComputedStyle(item.element).getPropertyValue('padding-top')
        ) +
        parseFloat(
          window
            .getComputedStyle(item.element)
            .getPropertyValue('padding-bottom')
        ) +
        parseFloat(
          window
            .getComputedStyle(item.element)
            .getPropertyValue('border-top-width')
        ) +
        parseFloat(
          window
            .getComputedStyle(item.element)
            .getPropertyValue('border-bottom-width')
        )
      item.element.style.minHeight = `${
        maxHeightInRow - paddingAndBorder + error
      }px`
    })

    remains.splice(0, processingTargets.length)

    if (remains.length > 0) {
      process()
    }
  }
}
