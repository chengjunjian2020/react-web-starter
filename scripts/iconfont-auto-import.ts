// iconfont-auto-import.ts
const IconfontAutoImport = require('iconfont-auto-import').default;
const path = require('path');

const app = new IconfontAutoImport({
  username: '18306001937', // 阿里巴巴矢量库登录账号
  password: '@python20140701', // 阿里巴巴矢量库登录密码
  projectId: '5086490', // 项目id
  basePath: path.resolve('src/static'),
  iconfontFolder: 'iconfont', // /src/static/iconfont
});

app.start();

