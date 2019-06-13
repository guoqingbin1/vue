import axios from 'axios';
import qs from 'qs';
import Router from '../router/index'
// 登录请求方法
const loginreq = (method, url, params) => {
    return axios({
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        data: params,
        traditional: true,
        transformRequest: [
            function(data) {
                let ret = '{'
                for (let it in data) {
                    ret +=
                        '"'+encodeURIComponent(it) +
                        '":"' +
                        encodeURIComponent(data[it]) +
                        '",'
                }
                ret=ret.substring(0,ret.length-1)
                ret +='}'
                return ret
            }
        ]
    }).then(res => res.data);
};
// 通用公用方法
const req = (method, url, params) => {
    return axios({
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'dataType':'json',
            token: localStorage.getItem('logintoken')
        },
        data:  params,
        traditional: true,
        transformRequest: [
            function(data) {
                let ret = '{'
                for (let it in data) {
                    ret +=
                        '"'+encodeURIComponent(it) +
                        '":"' +
                        encodeURIComponent(data[it]) +
                        '",'
                }
                ret=ret.substring(0,ret.length-1)
                ret +='}'
                return ret
            }
        ]
    }).then(res => {
        if(res.data!=null && res.data.code!=null && res.data.code==904){
            localStorage.removeItem("logintoken")
        }else{

            return res.data;
        }
    });
};

export {
    loginreq,
    req
}