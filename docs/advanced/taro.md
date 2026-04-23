# Taro 跨端框架面试指南

## 什么是 Taro？

Taro 是由京东凹凸团队开发的一款跨平台开发框架，它使用 React 语法进行开发，通过编译的方式将同一套代码转换为不同平台的原生应用。Taro 3.x 采用的是运行时适配器模式，支持 React、Vue、Nerv 等多种框架。

```javascript
// Taro 跨端架构
┌─────────────────────────────────────────────────────────────────┐
│                      Taro 跨端架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      ┌─────────────────┐                        │
│                      │   Taro 统一语法  │                        │
│                      │   (React/Vue)   │                        │
│                      └────────┬────────┘                        │
│                               │                                  │
│                               ▼                                  │
│                      ┌─────────────────┐                        │
│                      │   Taro 编译器    │                        │
│                      │  (代码转换引擎)   │                        │
│                      └────────┬────────┘                        │
│                               │                                  │
│        ┌──────────────────────┼──────────────────────┐          │
│        │                      │                      │          │
│        ▼                      ▼                      ▼          │
│  ┌───────────┐         ┌───────────┐         ┌───────────┐    │
│  │  微信小程序 │         │   H5/Web   │         │ React     │    │
│  │  (编译转换) │         │  (编译转换)  │         │ Native    │    │
│  └───────────┘         └───────────┘         └───────────┘    │
│        │                      │                      │          │
│        ▼                      ▼                      ▼          │
│  ┌───────────┐         ┌───────────┐         ┌───────────┐    │
│  │  wxss/wxml │         │   HTML5   │         │ iOS/Android│   │
│  │  (原生态)   │         │   (DOM)   │         │ (原生组件)  │   │
│  └───────────┘         └───────────┘         └───────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

// Taro 支持的平台
- 微信小程序
- 支付宝小程序
- 百度小程序
- 字节跳动小程序
- QQ 小程序
- 京东小程序
- H5 浏览器
- React Native
- 快手小程序
- 钉钉小程序
```

## 核心概念解析

### 1. 项目结构

```bash
# Taro 项目标准结构
├── src/
│   ├── app.jsx              # 应用入口
│   ├── app.config.ts        # 应用全局配置
│   ├── app.scss             # 应用全局样式
│   ├── pages/               # 页面目录
│   │   ├── index/
│   │   │   ├── index.jsx    # 页面逻辑
│   │   │   ├── index.config.ts  # 页面配置
│   │   │   ├── index.scss   # 页面样式
│   │   │   └── index.html   # 页面模板（可选）
│   │   └── detail/
│   ├── components/          # 组件目录
│   │   ├── MyComponent/
│   │   │   ├── index.jsx    # 组件逻辑
│   │   │   ├── index.scss   # 组件样式
│   │   │   └── index.config.ts   # 组件配置
│   ├── store/               # 状态管理
│   │   └── index.ts
│   ├── utils/               # 工具函数
│   └── styles/              # 公共样式
├── config/
│   ├── index.ts             # 默认配置
│   ├── dev.ts               # 开发环境配置
│   └── prod.ts              # 生产环境配置
├── project.config.json      # 项目配置文件
└── package.json
```

### 2. 页面配置与路由

```typescript
// src/pages/index/index.config.ts
export default definePageConfig({
  navigationBarTitleText: '首页',
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black',
  backgroundColor: '#f5f5f5',
  enablePullDownRefresh: true,
  onReachBottomDistance: 50,
  disableScroll: false,
  ...platformSpecificConfig // 平台特定配置
});

// src/app.config.ts
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detail/index',
    'pages/user/index',
    'pages/cart/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro App',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#333',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      { pagePath: 'pages/index/index', text: '首页', iconPath: 'assets/home.png', selectedIconPath: 'assets/home-active.png' },
      { pagePath: 'pages/cart/index', text: '购物车', iconPath: 'assets/cart.png', selectedIconPath: 'assets/cart-active.png' },
      { pagePath: 'pages/user/index', text: '我的', iconPath: 'assets/user.png', selectedIconPath: 'assets/user-active.png' }
    ]
  },
  subPackages: [
    {
      root: 'pagesPkg/user/',
      pages: [
        { path: 'setting', name: 'setting' }
      ]
    }
  ],
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: ['pagesPkg/user']
    }
  }
});
```

### 3. 组件开发

```tsx
// src/components/MyComponent/index.tsx
import { View, Text, Image } from '@tarojs/components';
import { useEffect, useState, useMemo, useCallback } from 'react';
import './index.scss';

interface Props {
  title: string;
  imageUrl?: string;
  onClick?: (id: string) => void;
}

export default function MyComponent({ title, imageUrl, onClick }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await Taro.request({ url: '/api/data' });
      setData(result.data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const processedData = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);

  const handleClick = useCallback((id: string) => {
    onClick?.(id);
  }, [onClick]);

  return (
    <View className='my-component'>
      <Text className='title'>{title}</Text>
      {loading ? (
        <View className='loading'>加载中...</View>
      ) : (
        <View className='list'>
          {processedData.map(item => (
            <View 
              key={item.id} 
              className='item'
              onClick={() => handleClick(item.id)}
            >
              {imageUrl && <Image src={imageUrl} className='image' />}
              <Text>{item.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
```

### 4. 样式系统

```scss
// src/components/MyComponent/index.scss
// Taro 支持的样式单位：px、rpx、vh、vw
// Taro 默认将 rpx 作为响应式单位

.my-component {
  padding: 20px;
  background-color: #fff;
  
  .title {
    font-size: 32px;
    font-weight: bold;
    color: #333;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #999;
  }
  
  .list {
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      .image {
        width: 100px;
        height: 100px;
        margin-right: 20px;
        border-radius: 8px;
      }
    }
  }
}

// 平台特定样式
/* #ifdef mp-weixin */
.my-component {
  /* 微信小程序特定样式 */
  padding: 30px;
}
/* #endif */

/* #ifdef h5 */
.my-component {
  /* H5 特定样式 */
  padding: 40px;
}
/* #endif */
```

## 生命周期

### 小程序端生命周期

```tsx
import { useDidShow, useDidHide, useResize, usePullDownRefresh, useReachBottom, usePageScroll } from '@tarojs/taro';

export default function Page() {
  // 页面加载时调用（首次进入页面）
  useEffect(() => {
    console.log('Page loaded');
    return () => {
      console.log('Page unmount');
    };
  }, []);

  // 页面显示时调用（每次打开页面都会调用）
  useDidShow(() => {
    console.log('Page shown');
  });

  // 页面隐藏时调用（当navigateTo或tab切换时）
  useDidHide(() => {
    console.log('Page hidden');
  });

  // 窗口尺寸变化时调用（仅小程序）
  useResize((res) => {
    console.log('Window resized:', res.size);
  });

  // 下拉刷新
  usePullDownRefresh(() => {
    console.log('Pull down refresh');
    // 异步操作完成后
    Taro.stopPullDownRefresh();
  });

  // 上拉触底
  useReachBottom(() => {
    console.log('Reach bottom');
    loadMoreData();
  });

  // 页面滚动
  usePageScroll((res) => {
    console.log('Page scroll:', res.scrollTop);
  });

  return <View>Page Content</View>;
}
```

### 组件生命周期

```tsx
import { useState, useEffect, useRef } from 'react';
import { View } from '@tarojs/components';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  const timerRef = useRef<number>();

  // 组件挂载后
  useEffect(() => {
    console.log('Component mounted');

    // 定时器示例
    timerRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // 返回清理函数
    return () => {
      console.log('Component will unmount');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 当 count 变化时
  useEffect(() => {
    console.log('Count updated:', count);
  }, [count]);

  return <View>Count: {count}</View>;
}
```

### 完整生命周期流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                   Taro 生命周期流程                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   App 生命周期:                                                   │
│   ┌─────────┐                                                    │
│   │ onLaunch │ ──► ┌─────────┐                                  │
│   └─────────┘      │ onShow  │ ──► ┌─────────┐                 │
│                    └─────────┘      │ on Hide │                 │
│                                       └─────────┘                 │
│   页面生命周期:                                                   │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐               │
│   │ onLoad   │ ──► │ onShow   │ ──► │ onReady  │               │
│   └──────────┘     └──────────┘     └──────────┘               │
│                         │                    │                   │
│                         ▼                    ▼                   │
│                    ┌──────────┐       ┌──────────┐              │
│                    │ onHide   │       │ onUnload │              │
│                    └──────────┘       └──────────┘              │
│                                                                 │
│   页面事件:                                                       │
│   - onPullDownRefresh    下拉刷新                                │
│   - onReachBottom        上拉触底                                │
│   - onPageScroll         页面滚动                                │
│   - onShareAppMessage    分享                                    │
│   - onResize             窗口尺寸变化                           │
│   - onTabItemTap         Tab 点击                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 状态管理

### 1. useState 和 useReducer

```tsx
import { View, Text, Button } from '@tarojs/components';
import { useState, useReducer } from 'react';

// useState 示例
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button onClick={() => setCount(c => c + 1)}>+</Button>
      <Button onClick={() => setCount(c => c - 1)}>-</Button>
      <Button onClick={() => setCount(0)}>Reset</Button>
    </View>
  );
}

// useReducer 示例
type State = { count: number };
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

function CounterWithReducer() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <View>
      <Text>Count: {state.count}</Text>
      <Button onClick={() => dispatch({ type: 'increment' })}>+</Button>
      <Button onClick={() => dispatch({ type: 'decrement' })}>-</Button>
      <Button onClick={() => dispatch({ type: 'reset' })}>Reset</Button>
    </View>
  );
}
```

### 2. Redux 集成

```typescript
// src/store/index.ts
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

// src/store/reducers/index.ts
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import goodsReducer from './goodsReducer';

const rootReducer = combineReducers({
  user: userReducer,
  goods: goodsReducer
});

export default rootReducer;

// src/store/reducers/userReducer.ts
interface UserState {
  userInfo: User | null;
  isLogin: boolean;
  loading: boolean;
}

const initialState: UserState = {
  userInfo: null,
  isLogin: false,
  loading: false
};

export default function userReducer(state = initialState, action: AnyAction): UserState {
  switch (action.type) {
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload };
    case 'SET_LOGIN_STATUS':
      return { ...state, isLogin: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}
```

### 3. MobX 集成

```typescript
// src/store/userStore.ts
import { makeAutoObservable, runInAction } from 'mobx';

class UserStore {
  userInfo: User | null = null;
  isLogin = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUserInfo(userInfo: User) {
    this.userInfo = userInfo;
    this.isLogin = true;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  async login(username: string, password: string) {
    this.loading = true;
    try {
      const result = await request('/api/login', { username, password });
      runInAction(() => {
        this.userInfo = result.data;
        this.isLogin = true;
      });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  logout() {
    this.userInfo = null;
    this.isLogin = false;
  }
}

export default new UserStore();

// src/pages/user/index.tsx - 在组件中使用
import { View, Text, Button } from '@tarojs/components';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import userStore from '../../store/userStore';

function UserPage() {
  useEffect(() => {
    // 初始化检查登录状态
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    await userStore.login('username', 'password');
  };

  const handleLogout = () => {
    userStore.logout();
  };

  return (
    <View className='user-page'>
      {userStore.isLogin ? (
        <>
          <Text>欢迎, {userStore.userInfo?.name}</Text>
          <Button onClick={handleLogout}>退出登录</Button>
        </>
      ) : (
        <Button onClick={handleLogin}>登录</Button>
      )}
    </View>
  );
}

export default observer(UserPage);
```

## 路由与导航

### 路由跳转

```typescript
import Taro from '@tarojs/taro';

// 1. 跳转到指定页面（不保留当前页面）
Taro.navigateTo({ url: '/pages/detail/index?id=123' });

// 2. 跳转到 Tab 页面（会关闭所有非 Tab 页面）
Taro.switchTab({ url: '/pages/index/index' });

// 3. 页面替换（关闭当前页面，跳转到指定页面）
Taro.redirectTo({ url: '/pages/detail/index?id=123' });

// 4. 返回上一页
Taro.navigateBack({ delta: 1 });

// 5. 重新加载到首页
Taro.reLaunch({ url: '/pages/index/index' });

// 6. 跳转至分包页面
Taro.navigateTo({ url: '/pagesPkg/user/setting?id=123' });
```

### 获取路由参数

```tsx
import { useRouter } from '@tarojs/taro';

function DetailPage() {
  const router = useRouter();
  const { id, name } = router.params;

  console.log('Detail id:', id);
  console.log('Detail name:', name);

  return <View>详情页 ID: {id}</View>;
}
```

### 编程式导航

```tsx
import { View, Button } from '@tarojs/components';
import { navigateTo, switchTab } from '@tarojs/taro';

function NavigationDemo() {
  const handleNavigate = () => {
    navigateTo({ url: '/pages/detail/index?id=123' });
  };

  const handleSwitchTab = () => {
    switchTab({ url: '/pages/cart/index' });
  };

  return (
    <View>
      <Button onClick={handleNavigate}>跳转详情页</Button>
      <Button onClick={handleSwitchTab}>跳转购物车</Button>
    </View>
  );
}
```

## API 请求

### 请求封装

```typescript
// src/utils/request.ts
import Taro from '@tarojs/taro';
import { getBaseUrl } from './config';
import { getAuthToken } from './auth';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  showLoading?: boolean;
  showError?: boolean;
}

interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

const baseUrl = getBaseUrl();

export default function request<T = any>(options: RequestOptions): Promise<ResponseData<T>> {
  const { url, method = 'GET', data, header = {}, showLoading = true, showError = true } = options;

  return new Promise((resolve, reject) => {
    if (showLoading) {
      Taro.showLoading({ title: '加载中...' });
    }

    const authToken = getAuthToken();
    const requestHeader: Record<string, string> = {
      'Content-Type': 'application/json',
      ...header
    };

    if (authToken) {
      requestHeader['Authorization'] = `Bearer ${authToken}`;
    }

    Taro.request({
      url: `${baseUrl}${url}`,
      method,
      data,
      header: requestHeader,
      timeout: 30000
    })
      .then(res => {
        if (showLoading) {
          Taro.hideLoading();
        }

        if (res.statusCode === 200) {
          const response = res.data as ResponseData<T>;
          if (response.code === 0 || response.code === 200) {
            resolve(response);
          } else if (response.code === 401) {
            // Token 过期，跳转登录
            Taro.removeStorageSync('token');
            Taro.navigateTo({ url: '/pages/login/index' });
            reject(new Error(response.message));
          } else {
            if (showError && response.message) {
              Taro.showToast({ title: response.message, icon: 'none' });
            }
            reject(new Error(response.message));
          }
        } else {
          handleError(res.statusCode);
          reject(new Error(`Request failed with status ${res.statusCode}`));
        }
      })
      .catch(error => {
        if (showLoading) {
          Taro.hideLoading();
        }
        Taro.showToast({ title: '网络请求失败', icon: 'none' });
        reject(error);
      });
  });
}

function handleError(statusCode: number) {
  switch (statusCode) {
    case 400:
      Taro.showToast({ title: '请求参数错误', icon: 'none' });
      break;
    case 401:
      Taro.showToast({ title: '未授权', icon: 'none' });
      break;
    case 403:
      Taro.showToast({ title: '禁止访问', icon: 'none' });
      break;
    case 404:
      Taro.showToast({ title: '资源不存在', icon: 'none' });
      break;
    case 500:
      Taro.showToast({ title: '服务器错误', icon: 'none' });
      break;
    default:
      Taro.showToast({ title: '网络错误', icon: 'none' });
  }
}

// 使用示例
export const getUserInfo = () => request({ url: '/api/user/info' });
export const login = (data: { username: string; password: string }) => 
  request({ url: '/api/login', method: 'POST', data });
export const getGoodsList = (params: { page: number; pageSize: number }) =>
  request({ url: '/api/goods/list', data: params });
```

## 性能优化

### 1. 长列表优化

```tsx
import { View, Text, Image } from '@tarojs/components';
import { useState, useEffect, useCallback } from 'react';
import Taro from '@tarojs/taro';

interface GoodsItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function GoodsList() {
  const [list, setList] = useState<GoodsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    const currentPage = reset ? 1 : page;

    try {
      const result = await Taro.request({
        url: '/api/goods/list',
        data: { page: currentPage, pageSize: 20 }
      });

      const newList = result.data.data.list;
      setList(prev => reset ? newList : [...prev, ...newList]);
      setHasMore(newList.length === 20);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Load data failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const onPullDownRefresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    loadData(true).finally(() => {
      Taro.stopPullDownRefresh();
    });
  }, []);

  // 上拉加载更多
  const onReachBottom = useCallback(() => {
    if (hasMore && !loading) {
      loadData();
    }
  }, [hasMore, loading]);

  const goToDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` });
  };

  return (
    <View className='goods-list'>
      {list.map(item => (
        <View 
          key={item.id} 
          className='goods-item'
          onClick={() => goToDetail(item.id)}
        >
          <Image src={item.image} className='goods-image' mode='aspectFill' />
          <View className='goods-info'>
            <Text className='goods-name'>{item.name}</Text>
            <Text className='goods-price'>¥{item.price}</Text>
          </View>
        </View>
      ))}
      {loading && <View className='loading'>加载中...</View>}
      {!hasMore && <View className='no-more'>没有更多了</View>}
    </View>
  );
}
```

### 2. 图片优化

```tsx
import { Image, View } from '@tarojs/components';

// 使用懒加载
<Image 
  src={imageUrl}
  mode='aspectFill'
  lazyLoad           // 懒加载
  showMenuByLongpress // 长按菜单
/>

// 使用缩略图
const thumbnailUrl = useMemo(() => {
  return `${originalUrl}?x-oss-process=image/resize,w_200`;
}, [originalUrl]);

// 渐进式加载
<Image 
  src={thumbnailUrl}
  className='thumbnail'
  onLoad={() => setShowFullImage(true)}
/>
{showFullImage && <Image src={fullImageUrl} className='full-image' />}

// 条件渲染大图
{isVisible && <Image src={largeImageUrl} />}
```

### 3.setData 优化

```typescript
// ❌ 低效：频繁调用 setData，每次传递完整数据
this.setData({
  list: newList,
  count: this.data.count + 1,
  userInfo: this.data.userInfo
});

// ✅ 高效：只传递变化的数据
this.setData({
  'list[0].name': 'new name',
  'list[2]': { id: '3', name: 'item 3' }
});

// ✅ 高效：使用变量先处理好数据，再一次性 setData
const processedData = this.processList(newList);
this.setData({ list: processedData });

// ✅ 高效：避免在 setData 中使用函数
// ❌
this.setData({ items: this.data.items.filter(i => i.active) });
// ✅
const filtered = this.data.items.filter(i => i.active);
this.setData({ items: filtered });

// ✅ 高效：分批更新大数据
const batchUpdate = (data: any[], batchSize = 100) => {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    setTimeout(() => {
      this.setData({ 
        [`list[${i}${i + batchSize > data.length ? '' : `-${i + batchSize - 1}`}]`]: batch 
      });
    }, 0);
  }
};
```

## 跨平台兼容

### 平台判断

```typescript
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

const systemInfo = Taro.getSystemInfoSync();
const platform = Taro.getEnv();

// 判断平台
const isMiniProgram = platform === 'MINIPROGRAM';
const isH5 = platform === 'WEB';
const isRN = platform === 'RN';

// 平台特定代码
/* #ifdef mp-weixin */
// 仅在微信小程序中执行
Taro.getUserProfile();
/* #endif */

/* #ifdef h5 */
// 仅在 H5 中执行
window.addEventListener('scroll', handleScroll);
/* #endif */

/* #ifdef rn */
// 仅在 React Native 中执行
NativeModules.openCamera();
/* #endif */

// 条件渲染
{/* #ifdef mp-weixin */}
<View>微信小程序特有功能</View>
{/* #endif */}

{/* #ifdef h5 */}
<View>H5 特有功能</View>
{/* #endif */}
```

### 条件编译

```typescript
// src/utils/platform.ts

// 运行时平台判断
export const isWeapp = Taro.getEnv() === 'MINIPROGRAM';
export const isH5 = Taro.getEnv() === 'WEB';
export const isRN = Taro.getEnv() === 'RN';

// 平台特定 API 封装
export const showActionSheet = (options: any) => {
  /* #ifdef mp-weixin */
  return Taro.showActionSheet({ itemList: options.weapp });
  /* #endif */

  /* #ifdef h5 */
  return Promise.resolve(options.h5);
  /* #endif */

  /* #ifdef rn */
  return Taro.showActionSheet({ itemList: options.rn });
  /* #endif */
};

// 分享功能
export const share = (params: { title: string; path: string; imageUrl?: string }) => {
  /* #ifdef mp-weixin */
  return Taro.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
  /* #endif */

  /* #ifdef h5 */
  if (navigator.share) {
    return navigator.share(params);
  }
  // 降级处理
  copyToClipboard(params.path);
  /* #endif */
};
```

---

## 面试题

### 面试题 1：Taro 的工作原理是什么？它如何实现跨平台？

**参考答案：**

**核心原理：**

Taro 的核心原理是通过**编译时转换**和**运行时适配**相结合的方式，实现"一套代码，多端运行"。

```
┌─────────────────────────────────────────────────────────────────┐
│                    Taro 工作原理                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   开发阶段:                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  使用 React 语法编写 Taro 代码                            │   │
│   │  import { View, Text } from '@tarojs/components'         │   │
│   │  <View><Text>Hello Taro</Text></View>                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   编译阶段:                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Taro 编译器 (基于 Babel / AST 转换)                     │   │
│   │                                                          │   │
│   │  ┌────────────┐    ┌────────────┐    ┌────────────┐      │   │
│   │  │ 微信小程序 │    │    H5      │    │ React      │      │   │
│   │  │ 编译器     │    │  编译器     │    │ Native     │      │   │
│   │  │            │    │            │    │ 编译器     │      │   │
│   │  │ wxml + wxss│    │  HTML + CSS│    │ JSX       │      │   │
│   │  └────────────┘    └────────────┘    └────────────┘      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   输出阶段:                                                       │
│   ┌────────────┐    ┌────────────┐    ┌────────────┐          │
│   │ 微信小程序  │    │   H5 Web   │    │ React      │          │
│   │ 原生代码    │    │   页面     │    │ Native     │          │
│   └────────────┘    └────────────┘    └────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**编译转换流程：**

1. **代码解析**：通过 Babel 解析 JavaScript/TypeScript 代码，生成 AST（抽象语法树）

2. **AST 转换**：
   - 将 JSX 转换为各平台对应的模板语法
   - 将 `View`、`Text` 等组件转换为小程序组件或 HTML 标签
   - 处理平台特定的 API 调用

3. **样式转换**：
   - 将 SCSS/Less 编译为小程序 wxss 或普通 CSS
   - 处理单位转换（px → rpx）

4. **输出生成**：生成各平台的原生代码或 bundle

**运行时适配：**

```typescript
// Taro 运行时核心
import Taro from '@tarojs/taro';

// Taro.getEnv() 返回当前运行环境
const env = Taro.getEnv();
// 'WEAPP' | 'WEB' | 'RN' | 'ALIPAY' | 'BAIDU' | 'TT'

// 统一的 API 调用，Taro 内部会根据平台调用对应的实现
Taro.request({ url: '/api' });  // 自动适配各平台的请求方式
Taro.showToast({ title: 'Hello' });  // 自动适配各平台的 Toast
Taro.navigateTo({ url: '/pages/index' });  // 自动适配路由跳转
```

**Taro 与其他跨平台方案对比：**

| 方案 | 原理 | 性能 | 复杂度 | 适用场景 |
|------|------|------|--------|---------|
| **Taro** | 编译转换 | 高 | 中 | 需要同时发布小程序和 H5/RN |
| **React Native** | JS 引擎 | 高 | 高 | 仅 RN 开发 |
| **Flutter** | Skia 绘制 | 最高 | 高 | 高性能跨平台应用 |
| **uni-app** | 编译转换 | 高 | 低 | Vue 技术栈，优先小程序 |

### 面试题 2：Taro 3.x 和之前版本有什么区别？

**参考答案：**

**架构对比：**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Taro 1.x / 2.x 架构                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    React 代码                            │   │
│   │   <View><Text>Hello</Text></View>                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼ (编译时转换)                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              各平台原始代码                               │   │
│   │  小程序: wxml + wxss + js                               │   │
│   │  H5: HTML + CSS + JS                                    │   │
│   │  RN: JSX                                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   特点:                                                          │
│   - 编译时完成所有转换                                           │
│   - 运行时无额外开销                                             │
│   - 不支持 Vue 语法                                              │
│   - 小程序支持需要额外配置                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Taro 3.x 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              React / Vue / Nerv 代码                     │   │
│   │   支持多种框架                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼ (编译时)                             │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              各平台 Runtime 适配器                       │   │
│   │  小程序 Runtime | H5 Runtime | RN Runtime                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼ (运行时适配)                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              各平台原生渲染                               │   │
│   │  小程序组件 | DOM | React Native 组件                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   特点:                                                          │
│   - 运行时适配器模式                                             │
│   - 支持 React、Vue、Nerv                                       │
│   - 更好的热更新能力                                             │
│   - 更接近原生开发体验                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**核心区别：**

| 特性 | Taro 1.x / 2.x | Taro 3.x |
|------|---------------|----------|
| **核心原理** | 编译时全量转换 | 编译时 + 运行时适配 |
| **框架支持** | 仅 React | React、Vue、Nerv |
| **小程序支持** | 代码转换 | Runtime 适配器 |
| **热更新** | 困难 | 更容易 |
| **包体积** | 较小 | 稍大（包含 Runtime） |
| **开发体验** | 受限的 React | 完整 React 体验 |
| **动态性** | 弱 | 强 |
| **适用场景** | 小程序为主 | 多端均衡 |

**升级原因：**

1. **业务需求**：企业需要同时支持更多平台
2. **开发效率**：开发者希望使用熟悉的 React/Vue 完整特性
3. **维护成本**：统一的框架降低多端维护成本
4. **生态兼容**：更好地融入 React/Vue 生态

### 面试题 3：如何在 Taro 中实现状态管理？

**参考答案：**

**Taro 支持多种状态管理方案，以下是几种常用方案：**

**方案一：React Hooks（useState/useReducer）**

适用于简单到中等复杂度的应用。

```tsx
import { useState, useReducer, useContext, createContext } from 'react';
import { View, Text, Button } from '@tarojs/components';

// useState 示例
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button onClick={() => setCount(c => c + 1)}>+</Button>
      <Button onClick={() => setCount(c => c - 1)}>-</Button>
    </View>
  );
}

// useReducer 示例 - 更适合复杂状态逻辑
type State = { count: number; user: User | null };
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setUser'; payload: User }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'setUser':
      return { ...state, user: action.payload };
    case 'reset':
      return { count: 0, user: null };
    default:
      return state;
  }
}

function ComplexCounter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, user: null });

  return (
    <View>
      <Text>Count: {state.count}</Text>
      <Text>User: {state.user?.name || 'Not logged in'}</Text>
      <Button onClick={() => dispatch({ type: 'increment' })}>+</Button>
      <Button onClick={() => dispatch({ type: 'reset' })}>Reset</Button>
    </View>
  );
}
```

**方案二：Context + useContext（跨组件共享）**

适用于跨层级组件通信。

```tsx
// store/ThemeContext.tsx
import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {}
});

export function ThemeProvider({ children }: { children: any }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// 使用
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View className={`theme-${theme}`}>
      <Button onClick={toggleTheme}>切换主题</Button>
    </View>
  );
}
```

**方案三：Redux（复杂应用）**

适用于大型项目，需要完善的状态管理机制。

```typescript
// 安装: npm install @tarojs/plugin-redux redux redux-thunk

// store/index.ts
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

// reducers
const userReducer = (state = { info: null, loading: false }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, info: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const goodsReducer = (state = { list: [], total: 0 }, action) => {
  switch (action.type) {
    case 'SET_GOODS_LIST':
      return { ...state, list: action.payload.list, total: action.payload.total };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
  goods: goodsReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// 使用
import { Provider } from '@tarojs/plugin-redux';
import store from './store';

// app.tsx
function App({ children }: any) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

// 页面中使用
import { connect } from '@tarojs/plugin-redux';

function UserPage({ userInfo, dispatch }: any) {
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // async action
    (dispatch as any)(async () => {
      const res = await Taro.request({ url: '/api/user' });
      dispatch({ type: 'SET_USER', payload: res.data });
    });
  }, []);

  return <View>User: {userInfo?.name}</View>;
}

export default connect(state => ({
  userInfo: state.user.info
}))(UserPage);
```

**方案四：MobX（响应式状态管理）**

适用于需要细粒度响应式的应用。

```typescript
// 安装: npm install mobx mobx-react

// store/counterStore.ts
import { makeAutoObservable, runInAction } from 'mobx';

class CounterStore {
  count = 0;
  list: Item[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }

  setList(list: Item[]) {
    this.list = list;
  }

  async fetchList() {
    this.loading = true;
    try {
      const res = await Taro.request({ url: '/api/list' });
      runInAction(() => {
        this.list = res.data;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const counterStore = new CounterStore();

// 页面组件
import { observer } from 'mobx-react';
import { counterStore } from '../../store/counterStore';

const Counter = observer(() => {
  return (
    <View>
      <Text>Count: {counterStore.count}</Text>
      <Button onClick={() => counterStore.increment()}>+</Button>
    </View>
  );
});
```

**状态管理方案对比：**

| 方案 | 学习成本 | 适用场景 | 调试体验 | 包体积 |
|------|---------|---------|---------|--------|
| Hooks | 低 | 简单应用 | 一般 | 小 |
| Context | 低 | 中小应用 | 一般 | 小 |
| Redux | 高 | 大型应用 | 好 | 中 |
| MobX | 中 | 中大型应用 | 一般 | 中 |
| dva | 中 | 大型应用 | 好 | 中 |

### 面试题 4：Taro 的性能优化有哪些手段？

**参考答案：**

**1. setData 优化**

小程序中 setData 是性能开销最大的操作之一。

```typescript
// ❌ 低效：每次传递完整数据
onScrollToLower: function() {
  const newList = this.data.list.concat(newData);
  this.setData({
    list: newList,
    scrollTop: 0,
    loading: false
  });
}

// ✅ 高效：只传递变化的部分
onScrollToLower: function() {
  const newList = this.data.list.concat(newData);
  // 使用路径形式更新
  this.setData({
    'list': newList,
    'scrollTop': 0,
    'loading': false
  });
}

// ✅ 高效：数组指定位置更新
this.setData({
  'list[0]': { ...this.data.list[0], updated: true }
});

// ✅ 高效：对象属性更新
this.setData({
  'obj.prop': 'new value',
  'arr[0].name': 'updated name'
});

// ✅ 高效：避免频繁单次更新，合并多次操作
let updates: any = {};
const addUpdates = (key: string, value: any) => {
  updates[key] = value;
};
addUpdates('count', this.data.count + 1);
addUpdates('loading', true);
this.setData(updates); // 一次性更新
```

**2. 长列表优化**

```tsx
// 使用虚拟列表
import { View, Text } from '@tarojs/components';
import { useMemo } from 'react';

function VirtualList({ data, itemHeight = 80 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleCount] = useState(10);

  const startIndex = useMemo(() => 
    Math.floor(scrollTop / itemHeight), 
  [scrollTop]);

  const endIndex = useMemo(() => 
    Math.min(startIndex + visibleCount + 2, data.length),
  [startIndex, visibleCount, data.length]);

  const visibleData = useMemo(() => 
    data.slice(startIndex, endIndex),
  [data, startIndex, endIndex]);

  const totalHeight = data.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <ScrollView
      scrollY
      scrollTop={scrollTop}
      onScroll={(e) => setScrollTop(e.detail.scrollTop)}
      className='virtual-list'
    >
      <View style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <View style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleData.map((item, index) => (
            <View key={item.id} className='list-item' style={{ height: `${itemHeight}px` }}>
              <Text>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
```

**3. 图片优化**

```tsx
// 使用懒加载
<Image 
  src={imageUrl}
  lazyLoad
  mode='aspectFill'
/>

// 缩略图
const thumbUrl = useMemo(() => {
  return originalUrl + '?x-oss-process=image/resize,w_200,m_lfit';
}, [originalUrl]);

// 条件渲染大图
{shouldLoadLarge && <Image src={largeImageUrl} />}

// 使用 CDN 压缩
const optimizedUrl = `${baseUrl}/image.jpg?x-oss-process=image/quality,q_50`;
```

**4. 事件处理优化**

```tsx
// ❌ 低效：每次渲染创建新函数
<View onClick={() => handleClick(item.id)}>

// ✅ 高效：使用 useCallback 缓存
const handleClick = useCallback((id: string) => {
  // 处理点击
}, []);

<View onClick={() => handleClick(item.id)}>

// ✅ 高效：使用事件委托
function List({ items, onItemClick }) {
  const handleClick = useCallback((e) => {
    const id = e.target.dataset.id;
    if (id) onItemClick(id);
  }, [onItemClick]);

  return (
    <View onClick={handleClick}>
      {items.map(item => (
        <View key={item.id} data-id={item.id}>{item.name}</View>
      ))}
    </View>
  );
}
```

**5. 依赖优化**

```typescript
// 按需引入 API
// ❌
import Taro from '@tarojs/taro';
Taro.showToast({ title: 'hello' });

// ✅ 按需引入
import { showToast } from '@tarojs/taro';
showToast({ title: 'hello' });

// 组件懒加载
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// 大型库按需加载
// 使用 lodash 时
import debounce from 'lodash/debounce';  // ✅
import _ from 'lodash';  // ❌
```

**6. 样式优化**

```scss
// 避免过于通配的选择器
/* ❌ */
view text {
  font-size: 28px;
}

/* ✅ */
.title-text {
  font-size: 28px;
}

// 使用简写属性
/* ❌ */
.item {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
}

/* ✅ */
.item {
  margin: 10px 20px;
}

// 避免多层嵌套
/* ❌ */
.a .b .c .d {
  color: red;
}

/* ✅ */
.d {
  color: red;
}
```

**7. 缓存优化**

```typescript
// 数据缓存
const CACHE_KEY = 'goods_list';
const CACHE_TIME = 5 * 60 * 1000; // 5分钟

async function getGoodsList(forceRefresh = false) {
  // 检查缓存
  if (!forceRefresh) {
    const cached = Taro.getStorageSync(CACHE_KEY);
    if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
      return cached.data;
    }
  }

  // 请求新数据
  const res = await Taro.request({ url: '/api/goods' });
  Taro.setStorageSync(CACHE_KEY, {
    data: res.data,
    timestamp: Date.now()
  });

  return res.data;
}

// 计算结果缓存
const expensiveResult = useMemo(() => {
  return computeExpensiveValue(data, filters);
}, [data, filters]);
```

### 面试题 5：Taro 跨平台开发中有哪些坑？如何解决？

**参考答案：**

**1. 平台 API 差异**

不同平台对 API 的支持程度不同。

```typescript
// 解决方案：条件判断 + 统一封装
import Taro from '@tarojs/taro';

const showShareMenu = () => {
  const env = Taro.getEnv();
  
  /* #ifdef mp-weixin */
  Taro.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
  /* #endif */

  /* #ifdef h5 */
  if (navigator.share) {
    navigator.share({
      title: '分享标题',
      url: window.location.href
    });
  } else {
    Taro.showToast({ title: '浏览器不支持分享', icon: 'none' });
  }
  /* #endif */
};

// 封装统一的请求方法
const request = (options) => {
  return Taro.request({
    ...options,
    // 微信小程序添加 header
    /* #ifdef mp-weixin */
    header: {
      ...options.header,
      'content-type': 'application/json'
    },
    /* #endif */
    // H5 添加 credentials
    /* #ifdef h5 */
    credentials: 'include',
    /* #endif */
  });
};
```

**2. 组件差异**

```tsx
// 某些组件在不同平台表现不同
// 解决方案：使用条件渲染或 Taro 提供的抽象组件

// Swiper 组件差异
// 微信小程序中需要设置 current 和 onChange
<Swiper
  current={current}
  onChange={(e) => setCurrent(e.detail.current)}
>
  {items.map(item => (
    <SwiperItem key={item.id}>
      <Image src={item.src} mode='aspectFill' />
    </SwiperItem>
  ))}
</Swiper>

// Text 组件的嵌套规则差异
// 微信小程序中 Text 内只能嵌套 Text
// ❌ 错误
<Text>
  <View>text</View>
</Text>

// ✅ 正确
<View>
  <Text>text</Text>
</View>

// 富文本渲染差异
// 微信使用 rich-text
// H5 使用 dangerouslySetInnerHTML
/* #ifdef mp-weixin */
<rich-text nodes={htmlContent} />
/* #endif */

/* #ifdef h5 */
<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
/* #endif */

// 或者使用 Taro 提供的统一方案
import { RichText } from '@tarojs/components';
<RichText html={htmlContent} />
```

**3. 样式差异**

```scss
// 尺寸单位差异
// Taro 默认使用 rpx，但在某些场景需要使用 px

// 小程序中 1px 边框问题
/* #ifdef mp-weixin */
.border-1px {
  border: 1px solid #eee;
}
/* #endif */

/* #ifdef h5 */
.border-1px {
  border: 1px solid #eee;
  box-sizing: border-box; // H5 需要
}
/* #endif */

// 安全区域适配
.container {
  padding-top: constant(safe-area-inset-top);    // 兼容 iOS < 11.2
  padding-top: env(safe-area-inset-top);          // 兼容 iOS >= 11.2
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

// 使用 Taro 提供的安全区域组件
import { View } from '@tarojs/components';
<SafeAreaView>
  <View>内容</View>
</SafeAreaView>
```

**4. 路由与导航差异**

```typescript
// 路由参数长度限制
// 微信小程序 URL 参数有长度限制
// ✅ 解决方案：使用 Storage 或全局状态

// A 页面 - 传递大数据
Taro.setStorageSync('page_params', JSON.stringify(largeData));
Taro.navigateTo({ url: '/pages/detail/index?id=123' });

// B 页面 - 获取数据
const params = JSON.parse(Taro.getStorageSync('page_params'));

// Tab 页面跳转限制
// switchTab 只能跳转到 tabBar 页面
// ❌ 错误
Taro.switchTab({ url: '/pages/detail/index' });

// ✅ 正确
Taro.switchTab({ url: '/pages/cart/index' });

// 如果需要从非 tab 跳转到 tab，使用 redirectTab
Taro.redirectTab({ url: '/pages/cart/index' });
```

**5. 事件系统差异**

```tsx
// 事件参数差异
// 小程序中事件对象结构不同于 H5
const handleClick = (e: any) => {
  /* #ifdef mp-weixin */
  const dataset = e.currentTarget.dataset;
  const id = dataset.id;
  /* #endif */

  /* #ifdef h5 */
  const id = e.target.dataset.id;
  /* #endif */
};

// Touch 事件差异
// 小程序 touch 事件在 h5 中是 mouse 事件
const handleTouchStart = (e: any) => {
  /* #ifdef mp-weixin */
  const touch = e.touches[0];
  /* #endif */

  /* #ifdef h5 */
  const touch = e;
  /* #endif */
};
```

**6. 第三方库兼容**

```typescript
// 并不是所有 npm 包都支持跨平台

// 检查库的支持平台
// 使用前查看包的 README 或 package.json

// 小程序不支持的 API
// - window.location
// - document.cookie
// - XMLHttpRequest (使用 Taro.request 替代)

// 动态 require
// ❌ 小程序中可能不支持
const Module = require(`./modules/${moduleName}`);

// ✅ 使用 import
const Module = await import(`./modules/${moduleName}`);

// 或使用 Taro 的 dynamicImport
import { dynamic } from 'dva/dynamic';
const UserPage = dynamic(() => import('./UserPage'));
```

**7. 调试技巧**

```typescript
// 平台特定日志
const log = (message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${Taro.getEnv()}]`, message);
  }
};

// 使用 vconsole 调试
/* #ifdef h5 */
import VConsole from 'vconsole';
new VConsole();
/* #endif */

// 编译时查看差异
// 运行 taro build --platform weapp --watch
// 查看编译产物，了解转换结果
```

**总结：跨平台开发最佳实践**

1. **开发前**：仔细阅读各平台文档，了解 API 差异
2. **编码时**：使用 Taro 提供的统一 API，避免平台特定代码
3. **测试时**：在各平台分别测试，重点关注差异点
4. **发布前**：使用条件编译处理平台差异
5. **维护时**：保持各平台代码同步更新