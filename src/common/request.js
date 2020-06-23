import Bmob from 'hydrogen-js-sdk';
import config from '../common/config';
import utils from './utils';
Bmob.initialize(config.SecretKey, config.code);

export default {
  /**
   *  获取首页文章列表
   * @param {*} page
   * @param {*} pagesize
   */
  getArticleList(page, pagesize, total) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Article');
      query.limit(pagesize);
      query.skip((page - 1) * pagesize);
      query.include('tid', 'Types');
      query.select('tid', 'title', 'describe', 'visit', 'len');
      query.order('-createdAt');
      query
        .find()
        .then(res => {
          if (page === 1) {
            query.count().then(count => {
              resolve({
                alists: res,
                page,
                pagesize,
                total: count
              });
            });
          } else {
            resolve({
              alists: res,
              page,
              pagesize,
              total
            });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 查询文章详情
   * @param {*} id
   */
  getArticleDetail(id) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Article');
      query.include('tid', 'Types');
      query
        .get(id)
        .then(res => {
          res.increment('visit');
          res.save();
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 获取文章内容过大的文章
   */
  getArticleDetailById(id) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Article');
      query.include('tid', 'Types');
      query.select('tid', 'title', 'describe', 'visit', 'len', 'createdAt', 'updatedAt');
      query.equalTo('objectId', '==', id);
      query
        .find()
        .then(res => {
          res.set('visit', res[0].visit + 1);
          res.saveAll();
          resolve(res[0]);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 获取分类
   */
  getTypes() {
    return new Promise((resolve, reject) => {
      Bmob.Query('Types')
        .find()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 发布文章
   * @param {*} params
   */
  setArticle(params) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Article');
      const poiID = Bmob.Pointer('Types').set(params.tid);
      query.set('len', utils.htmltoTextLength(params.html));
      query.set('text', params.text);
      query.set('html', params.html);
      query.set('title', params.title);
      query.set('tid', poiID);
      query.set('visit', 200);
      query.set('describe', params.describe);
      query
        .save()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 获取推荐
   * @param {*} tid
   */
  getRecommendArticle(id, tid) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Article');
      query.limit(3);
      query.select('title');
      query.equalTo('tid', '==', tid);
      query.equalTo('objectId', '!=', id);
      query
        .find()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 获取最热
   */
  getArticleHot() {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Article');
      query.limit(10);
      query.order('-visit');
      query.include('tid', 'Types');
      query.select('tid', 'title', 'describe', 'visit');
      query
        .find()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 更具tid 获取文章列表
   * @param {*} tid
   */
  getArticleTabs(tid) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Article');
      query.equalTo('tid', '==', tid);
      query.include('tid', 'Types');
      query.select('tid', 'title');
      query
        .find()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 获取分类和文章数量
   */
  async getTypesArticleCount(callback) {
    const types = await this.getTypes();
    function func(index) {
      const query = Bmob.Query('Article');
      query.equalTo('tid', '==', types[index].objectId);
      query.count().then(count => {
        types[index].count = count;
        callback(types);
        if (index < types.length - 1) {
          func(index + 1);
        }
      });
    }
    func(0);
  },
  /**
   * 获取数量
   * @param {*} acount  文章数量
   * @param {*} tcount  分类数量
   * @param {*} icount  图片数量
   * @param {*} vcount  电影数量
   */
  getPersonalCount() {
    return new Promise(async resolve => {
      const acount = await Bmob.Query('Article').count();
      const tcount = await Bmob.Query('Types').count();
      const vcount = await Bmob.Query('Video').count();
      const query = Bmob.Query('Atlas');
      query.select('atlas');
      const ilist = await query.find();
      let icount = 0;
      for (const item of ilist) {
        icount += item.atlas.length;
      }
      resolve({
        acount,
        tcount,
        icount,
        vcount
      });
    });
  },
  /**
   * 上传图集
   * @param {*} params
   */
  setAtlas(params) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Atlas');
      query.set('title', params.title);
      query.set('describe', params.describe);
      query.set('atlas', params.atlas);
      query
        .save()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 获取图集
   */
  getAtlas() {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Atlas');
      query
        .find()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 获取图册详情
   * @param {*} id
   */
  getAtlasById(id) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Atlas');
      query
        .get(id)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 上传电影
   * @param {*} param
   */
  setVideo(param) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Video');
      for (const key in param) {
        query.set(key, param[key]);
      }
      query
        .save()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 获取电影列表
   */
  getVideos() {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Video');
      query.order('-time');
      query
        .find()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 获取电影详情
   * @param {*} id
   */
  getVideoById(id) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Video');
      query
        .get(id)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 访问量
   * @param {*} param
   */
  setVisits(param) {
    return new Promise((resolve, reject) => {
      const query = Bmob.Query('Visits');
      for (const key in param) {
        query.set(key, param[key]);
      }
      query
        .save()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
