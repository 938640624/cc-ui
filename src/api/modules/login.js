import request from '../request'

/**
 * @description 发送验证码
 * @param {string} phone 手机号
 */
export function loginSendCode(data) {
    return request({
        url: '/login/sendCode',
        method: 'POST',
        data: data,
    })
}
