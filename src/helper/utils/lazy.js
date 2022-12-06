export function lazyLoad(className) {
    const viewHeight = document.body.clientHeight
    const imgArr = document.querySelectorAll(`.${className}`)
    imgArr.forEach((item) => {
        if (item.dataset.src === '') {
            return
        }

        const rect = item.getBoundingClientRect()
        if (rect.bottom >= 0 && rect.top < viewHeight) {
            item.src = item.dataset.src
            item.removeAttribute('data-src')
        }
    })
}
