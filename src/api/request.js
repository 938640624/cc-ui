import axios from 'axios'
// 创建axios
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API + '/myorthox/emrs-admin/',
})

// service.interceptors.request.use：添加请求拦截器
service.interceptors.request.use(
    (config) => {
        // 发送请求前给headers头部添加token
        config.headers['Authorization'] =
            'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjozMywidXNlcl9rZXkiOiI3NzIzNTZhOS0xY2MyLTQ4NDctOTQwZS03MDBmYTFiOThkOTQiLCJ1dWlkIjoiYmQ0OTNkMjg5ZDEzNDhjN2I5NDcxNzE5OTJiN2Y3ZTciLCJ1c2VybmFtZSI6IumZiOWImyJ9.BLrhjclaxfoIXXlC27VgdacaEJQGlWDwatxa6TMn9cLIS6fPjI_lO68I7M-OrT52DPJS5vGKiWTM-15Wfw0XNA'
        return config
    },
    (error) => {
        // 请求错误时返回错误
        return Promise.reject(error)
    }
)

// service.interceptors.response.use：添加相应蓝九七
service.interceptors.response.use(
    async (response) => {
        const res = response.data
        // 200成功，则返回数据
        if (res.code === 200) return res
        // 401请求没有系统权限，重新加载
        else if (res.code === 401) {
            // 刷新当前页面
            location.reload()
        } else {
            return Promise.reject(res)
        }
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default service
