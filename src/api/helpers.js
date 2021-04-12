import axios from 'axios'
import Qs from 'qs'

export function get(url) {
    return function(params = {}) {
        return axios.get(url, {
            params
        }).then((res) => {
            return res.data;
        }).catch((e) => {
            console.log(e.response);
        })
    }
}
export function post(url) {
    return function(params = {}) {
        return axios.post(url, Qs.stringify(params)).then((res) => {
            return res.data;
        }).catch((e) => {
            console.log(e);
        })
    }
}
export function upload(url) {
    return function(params = {}) {
        return axios.post(url, params, {
            headers: {
                "Content-Type": "multipart/form-data;boundary=" + new Date().getTime()
            }
        }).then((res) => {
            return res.data;
        }).catch((e) => {
            console.log(e);
        });
    }
}