import * as React from 'react';
import { LocaleProvider } from 'antd';
import * as zhCN from 'antd/lib/locale-provider/zh_CN';
import { Router, Route, Switch, Redirect } from 'dva/router';

import FaceDemo from './pages/faceDemo/faceDemo';

// 路由配置
function RouterConfig({ history, app }) {
    return (
        <LocaleProvider locale={zhCN as any}>
            <Router history={history}>
                <Switch>
                    <Route path= "/" key="FaceDemo" exact component={FaceDemo}/>
                </Switch>
            </Router>
        </LocaleProvider>
    );
}

export default RouterConfig;
