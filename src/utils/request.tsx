import fetch from 'dva/fetch';
import * as React from 'react';
import {stringify} from 'qs';
import { Modal, message } from 'antd';

const proxyMap = {
  // 标签
  'GET /applies': {
    url: '../devtool/schemas/label-apply-list.json'
  },
  'POST /repository/save': {
    url: '../devtool/schemas/repository-save.json'
  },
}

const TEST_URL = "/api";
// const TEST_URL = "";
let modal = [];
function notifyException(data) {
  if (parseInt(data.meta.code, 10) !== 200) {
    if (parseInt(data.meta.code, 10) === 401) {
        Modal.confirm({
            title: '提示',
            content: '您还未注册，请先前往注册！',
            onOk: () => goThePage('#/theWebsite/order/register/normal')
        });
    } else {
        if (modal.length > 0) {
            modal.map((item) => {
                item.destroy();
            });
            modal = [];
        }
        let m = Modal.error({title: '错误提示', content: data.meta.message});
        modal.push(m);
    }
  }
  return data
}

function goThePage(href) {
    window.location.href = href;
}

function urlToObj(str) {
    let obj = {};
    
    let arr = str.split("#");
    let arr1 = arr[0].split("?");
    let arr2 = arr1[1].split("&");
　　for(let i=0 ; i < arr2.length; i++){
        let res = arr2[i].split("=");
　　　　 obj[res[0]] = res[1];
　　}
　　return obj;
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options?) {
    const newOptions = {...options, credentials: 'include'};
    let newUrl = TEST_URL + url;
    if (newOptions.method === 'POST' || newOptions.method === 'PUT' ||  newOptions.method === 'DELETE') {
      if (newOptions.params instanceof FormData) {
        newOptions.headers = {
            'enctype': 'multipart/form-data'
        };
        newOptions.body = newOptions.params;
      } else {
        newOptions.headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8'
        };
        newOptions.body = JSON.stringify(newOptions.params);
      }
    } else if (newOptions.method === 'GET') {
      newOptions.headers = {};
      newUrl = newOptions.params ? `${newUrl}?${stringify(newOptions.params)}` : newUrl;
    }
    
    let openId = sessionStorage.getItem("openId");
    if (openId) {
        newOptions.headers.openid = openId;
    } else {
        let openIdObj:any = urlToObj(location.href);
        newOptions.headers.openid = openIdObj.openId;
    }
    

    return fetch(newUrl, newOptions)
      .then((response) => response.json())
      .then(notifyException)
      .then((data) => data)
      .catch((error) => {
        if ('stack' in error && 'message' in error) {
          if (modal.length > 0) {
            modal.map((item) => {
              item.destroy();
            });
            modal = [];
          }
          let m = Modal.error({
            title: '服务器异常',
            content: '服务器异常，请刷新页面重试！',
          });
          modal.push(m);
          console.error(`请求错误: ${url} ${error.message}`);
        }
        return error;
    });
  }
