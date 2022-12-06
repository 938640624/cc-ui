const debounce = {
    inserted(el, binding) {
        console.log(el, 'el')
        let timer
        el.addEventListener('click', () => {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                binding.value()
            }, 1000)
        })
    },
}

export default debounce
