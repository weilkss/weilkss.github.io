# 个人博客

[website](https://www.weilkss.cn)

### 简介

> 这个博客吧，完全就是为了划水而生，没有特意的去做这件事，但是认真起来代码还是写得很爽，所以划着划着就划出了这个垃圾玩意，哈哈～～,2020 年，知道什么日子吗？我在写这段简介的时候，正忍受着戴口罩而带来的疼痛，多么想取下这个口罩，露出我帅气的脸蛋啊啊～啊，【对不起，主要想坐在我对面的小姐姐能取下口罩，毕竟，这么美的小脸蛋不能只能他男朋友欣赏。】

### 说下技术栈吧

#### 项目框架：`create-react-app`

`create-react-app`大家都很熟悉，主要还是里面用到的一些技术，因为我自己没有购买服务器，所以把项目挂在 GitHub 上，只买了一个域名，而且还不用备案就能使用 https 访问，确定就是有时候访问比较慢，具体 GitHub 搭建个人站点的方式我后面会讲到。`style`样式我选择的 less，我只是个人比较喜欢 less 一点，由于项目简单我就没有用到`redux`。

#### antd

[直通车](https://ant.design/index-cn)

阿里云团队推出的 reactui 框架，主要用到一些组件,分页、时间轴等

#### xwb-loading

[直通车](https://github.com/xwb007/xwb-loading)

我以前自己封装的一个`loading`,适用于 react 和 vue，项目中主要是为了处理白屏

#### xwb-react-markdown

[直通车](https://github.com/xwb007/xwb-react-markdown)

我自己封装的`markdown`，项目中主要是为了我自己编辑文章发布

#### react-select

[直通车](https://github.com/JedWatson/react-select#readme)

一个下拉选择器

#### Bmob

[直通车](https://www.bmob.cn/)

`Bmob`后端云 全方位一体化的后端服务平台提供可靠的 Serverless 云服务 轻松拥有开发中需要的各种后端能力，我的数据都是使用 bmob 存储，文档简单使用起来也方便，最主要的是请求快，比起 txy 的云服务快了很多，因为我之前做过一个[M3A](https://github.com/xwb007/M3A)的小程序，就使用了云开发，接口是真的慢。最主要的是他提供域名还支持 https，还适合小程序使用。

##### Example

```js
import Bmob from 'hydrogen-js-sdk';

// 初始化
Bmob.initialize('your SecretKey key', 'your code key');


/**
 *  获取首页文章列表
 * @param {*} page
 * @param {*} pagesize
 */
getArticleList(page, pagesize) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('Article');
    query.limit(pagesize);
    query.skip((page - 1) * pagesize);
    query.include('tid', 'Types');
    query.select('tid', 'title', 'describe', 'visit', 'len');
    query
      .find()
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// 更多操作
// http://doc.bmob.cn/data/wechat_app_new/index.html

```

#### 七牛云

[直通车](https://www.qiniu.com/)

主要用七牛云做图片存储，而且我把七牛云集成到`markdown`中，所以我在编辑文章的时候就可以使用网络图片

选择对象存储，有免费的图片域名使用，，而且访问快

这里需要注意的是：需要自己去生成一个 token，其实也很简单，直接用 node 就可以在本地生成，我直接贴代码吧

```js
const request = require('request');
const qiniu = require('qiniu');
const router = require('koa-router')();

// 下载七牛云node SDK qiniu
router.get('/qiniuToken', async ctx => {
  let accessKey = 'your access key';
  let secretKey = 'your secret key';
  let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  let options = {
    scope: 'xwb007',     // 你的对象存储 名称
    expires: 36000 * 24  // 时效
  };

  let putPolicy = new qiniu.rs.PutPolicy(options);
  let uploadToken = putPolicy.uploadToken(mac);
  ctx.body = 'token:' + uploadToken;
});

// 返回
token:'aS1fve6zuRVODg89_JG1VM*******YjAwNyIsImRlYWRsaW5lIjoxNTg0NjczNTAwfQ==',

```

### `create-react-app` 搭建 GitHub 个人博客

[直通车](https://www.buttr.cn/detail/0d011ca514)

感谢
