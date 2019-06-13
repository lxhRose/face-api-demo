import dva from 'dva';
import RouterConfig from './router';
import './index.less';

const app = dva();
app.router(RouterConfig);
app.start('#root');

