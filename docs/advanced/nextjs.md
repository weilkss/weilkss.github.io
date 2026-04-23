# Next.js 深入指南

## 核心概念与原理

### 1. Next.js 是什么？它解决了什么问题？

Next.js 是 Vercel 开发的 React 框架，用于构建全栈 Web 应用程序。它解决了传统 React 应用的以下问题：

**解决的问题：**

| 问题         | 传统 React                      | Next.js              |
| ------------ | ------------------------------- | -------------------- |
| SSR/SSG 支持 | 需要额外配置（Webpack + Babel） | 开箱即用             |
| 路由系统     | 需要 React Router               | 基于文件系统的路由   |
| SEO 优化     | 困难，搜索引擎难以抓取          | 天然 SEO 友好        |
| 首屏加载     | 白屏问题                        | SSR/SSG 减少白屏     |
| API 路由     | 需要独立后端服务                | 内置 API Routes      |
| 性能优化     | 手动配置                        | 自动代码分割、预取等 |

**核心特性：**

- **服务端渲染 (SSR)**：服务器端渲染页面
- **静态站点生成 (SSG)**：预渲染静态页面
- **增量静态再生成 (ISR)**：在运行时更新静态内容
- **App Router**：基于 React Server Components 的新一代路由
- **API Routes**：快速构建后端接口
- **自动代码分割**：按路由自动分割代码
- **图片优化**：内置 Next/Image 组件

### 2. Pages Router vs App Router

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js 路由架构对比                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Pages Router (旧)              App Router (新)                │
│   ───────────────               ────────────────                │
│                                                                 │
│   ├── pages/                    ├── app/                        │
│   │   ├── _app.js               │   ├── layout.js              │
│   │   ├── _document.js          │   ├── page.js                │
│   │   ├── index.js              │   ├── loading.js             │
│   │   └── users/                │   ├── error.js               │
│   │       ├── index.js          │   ├── not-found.js           │
│   │       └── [id].js            │   ├── users/                 │
│   │                             │   │   ├── page.js             │
│   │                             │   │   ├── loading.ts          │
│   │                             │   │   └── [id]/                │
│   │                             │   │       └── page.ts         │
│   │                             │   └── api/                    │
│   │                             │       └── users/route.ts      │
│   └── public/                   └── public/                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Next.js 的渲染模式

```
┌─────────────────────────────────────────────────────────────────┐
│                      渲染模式对比                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   CSR (Client-Side Rendering)                                   │
│   ┌─────────────────────────────────────┐                       │
│   │  Server: HTML Shell                 │                       │
│   │  Browser: Download JS → Render      │                       │
│   │  问题：SEO 不友好，首屏慢              │                       │
│   └─────────────────────────────────────┘                       │
│                                                                 │
│   SSR (Server-Side Rendering)                                   │
│   ┌─────────────────────────────────────┐                       │
│   │  Server: Fetch Data → Render HTML  │                       │
│   │  Browser: Receive HTML → Hydrate    │                       │
│   │  特点：首屏快，SEO 友好               │                       │
│   └─────────────────────────────────────┘                       │
│                                                                 │
│   SSG (Static Site Generation)                                  │
│   ┌─────────────────────────────────────┐                       │
│   │  Build: Fetch Data → Generate HTML  │                       │
│   │  Server: Serve Static HTML          │                       │
│   │  特点：最快，适合静态内容             │                       │
│   └─────────────────────────────────────┘                       │
│                                                                 │
│   ISR (Incremental Static Regeneration)                          │
│   ┌─────────────────────────────────────┐                       │
│   │  Build: Generate Static Pages       │                       │
│   │  Runtime: Revalidate Periodically   │                       │
│   │  特点：静态 + 动态更新                │                       │
│   └─────────────────────────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Pages Router 详解

### 4. 页面与路由系统

```javascript
// pages/index.js - 首页
export default function Home() {
  return <h1>Home Page</h1>;
}

// pages/about.js - 关于页面
export default function About() {
  return <h1>About Page</h1>;
}

// pages/blog/[id].js - 动态路由
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { id } = router.query;

  return <h1>Blog Post: {id}</h1>;
}

// pages/users/[...slug].js - 捕获所有路由
// /users/a/b/c -> slug = ['a', 'b', 'c']

// pages/blog/[year]/[month]/[day].js - 多层动态路由
// /blog/2024/04/23 -> { year: '2024', month: '04', day: '23' }
```

### 5. getStaticProps 与 getStaticPaths

```javascript
// pages/blog/[id].js
export async function getStaticPaths() {
    const res = await fetch("https://api.example.com/posts");
    const posts = await res.json();

    return {
        paths: posts.map((post) => ({
            params: { id: post.id.toString() },
        })),
        fallback: "blocking", // or false or 'blocking'
    };
}

export async function getStaticProps({ params }) {
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    const post = await res.json();

    return {
        props: { post },
        revalidate: 60, // ISR: 60秒后重新生成
    };
}

export default function BlogPost({ post }) {
    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </article>
    );
}
```

### 6. getServerSideProps

```javascript
// pages/dashboard.js
export async function getServerSideProps(context) {
    const { req, res, query } = context;

    // 获取用户 session
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    const data = await fetchUserData(session.user.id);

    return {
        props: { user: data },
    };
}

export default function Dashboard({ user }) {
    return <div>Welcome, {user.name}</div>;
}
```

## App Router（新一代）

### 7. App Router 的核心概念

```typescript
// app/page.tsx - 首页
export default function HomePage() {
  return <h1>Home</h1>;
}

// app/layout.tsx - 根布局（所有页面共享）
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <header>
          <nav>...</nav>
        </header>
        {children}
        <footer>...</footer>
      </body>
    </html>
  );
}

// app/blog/[id]/page.tsx - 动态路由
interface Props {
  params: { id: string };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.id);

  return <h1>{post.title}</h1>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ id: post.id.toString() }));
}
```

### 8. React Server Components

```typescript
// app/users/page.tsx - Server Component (默认)
// 这个组件会在服务器端渲染
async function UsersPage() {
  const users = await db.query('SELECT * FROM users');

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// app/users/page.client.tsx - Client Component
'use client';

import { useState } from 'react';

export function UserList({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);

  return (
    <>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={() => fetchMoreUsers()}>Load More</button>
    </>
  );
}

// 组合使用
import { UserList } from './page.client';

async function UsersPage() {
  const initialUsers = await getInitialUsers();

  return <UserList initialUsers={initialUsers} />;
}
```

### 9. 布局与嵌套

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <aside>
        <DashboardSidebar />
      </aside>
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/page.tsx
// 自动使用 dashboard/layout.tsx
export default function DashboardPage() {
  return <h1>Dashboard</h1>;
}

// app/dashboard/settings/page.tsx
// 也使用 dashboard/layout.tsx
export default function SettingsPage() {
  return <h1>Settings</h1>;
}
```

### 10. Loading 和 Error 状态

```typescript
// app/blog/loading.tsx - 加载状态
export default function Loading() {
  return <Skeleton />;
}

// app/blog/error.tsx - 错误边界
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/blog/not-found.tsx - 404 页面
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find the requested blog post.</p>
    </div>
  );
}
```

## 数据获取

### 11. 不同数据获取方式对比

| 方式                     | 使用场景       | 缓存策略             |
| ------------------------ | -------------- | -------------------- |
| `fetch` + Next.js cache  | 全局缓存数据   | auto (默认)          |
| `fetch` + `revalidate`   | ISR 数据       | 定时重新验证         |
| `fetch` + `no-store`     | 实时数据       | 不缓存               |
| `useSWR` / `React Query` | 客户端数据获取 | 客户端缓存           |
| 路由处理器               | API 路由       | Route segment config |

```typescript
// app/page.tsx
async function getData() {
    const res = await fetch("https://api.example.com/data", {
        cache: "force-cache", // 默认行为，SSG
    });
    return res.json();
}

// ISR 示例
async function getBlogPosts() {
    const res = await fetch("https://api.example.com/posts", {
        next: { revalidate: 60 }, // 每 60 秒重新验证
    });
    return res.json();
}

// 动态数据
async function getRealTimeData() {
    const res = await fetch("https://api.example.com/realtime", {
        cache: "no-store", // 每次都获取新数据
    });
    return res.json();
}
```

## API Routes

### 12. API 路由详解

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
});

export async function GET(request: NextRequest) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await db.query("SELECT * FROM users");

    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = userSchema.parse(body);

        const user = await db.createUser(validatedData);

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
```

## 样式方案

### 13. CSS Modules 与 Tailwind

```typescript
// styles/Home.module.css
.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  color: blue;
}

// components/Header.tsx
import styles from './Header.module.css';

export default function Header() {
  return <header className={styles.container}><h1 className={styles.title}>Title</h1></header>;
}
```

```typescript
// Tailwind CSS
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">Welcome</h1>
      </div>
    </div>
  );
}
```

### 14. CSS-in-JS 方案

```typescript
// styled-components (需要客户端组件)
'use client';

import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
`;

export default function Home() {
  return <Button primary>Click me</Button>;
}

// Tailwind + 配置文件
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#0070f3',
      },
    },
  },
  plugins: [],
};
```

## 性能优化

### 15. 图片优化

```typescript
// 使用 Next/Image
import Image from 'next/image';

export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full h-64">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={true} // LCP 优化
        placeholder="blur"
        blurDataURL={generateBlurDataURL()}
      />
    </div>
  );
}

// remotePatterns 配置
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**'
      }
    ]
  }
};
```

### 16. 字体优化

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}

// 本地字体
// app/layout.tsx
import localFont from 'next/font/local';

const myFont = localFont({ src: './fonts/MyFont.woff2' });
```

## 面试精选问题

### 问题一：Next.js 的渲染模式有哪些？各自适用场景是什么？

**答案要点**：

**1. SSG（Static Site Generation）**

```typescript
// 适用于：内容不经常变化的页面
export async function getStaticProps() {
    const posts = await getAllPosts();
    return { props: { posts } };
}
```

- 博客、文档、营销页面
- 优点：性能最快，CDN 友好
- 缺点：不适合频繁更新的内容

**2. SSR（Server-Side Rendering）**

```typescript
// 适用于：需要实时数据的页面
export async function getServerSideProps() {
    const data = await fetchLatestData();
    return { props: { data } };
}
```

- 仪表盘、用户专属页面
- 优点：数据实时
- 缺点：每次请求都需要服务器渲染

**3. ISR（Incremental Static Regeneration）**

```typescript
// 适用于：内容定期更新但不要求实时的页面
export async function getStaticProps() {
    return {
        props: { data },
        revalidate: 60, // 60秒后重新生成
    };
}
```

- 电商产品页、新闻列表
- 优点：静态性能 + 动态更新
- 缺点：可能有短暂的数据不一致

**4. CSR（Client-Side Rendering）**

```typescript
// 适用于：用户特定数据、实时更新
import useSWR from "swr";

export default function Dashboard() {
    const { data, error } = useSWR("/api/dashboard", fetcher);
}
```

- 社交媒体 feed、实时数据监控
- 优点：用户体验流畅
- 缺点：首屏可能有白屏

### 问题二：App Router 和 Pages Router 有什么区别？

**答案要点**：

| 特性       | Pages Router      | App Router        |
| ---------- | ----------------- | ----------------- |
| React 版本 | React 17/18       | React 18+ (RSC)   |
| 布局       | \_app.js          | layout.tsx        |
| 嵌套布局   | 不支持            | 原生支持          |
| 加载状态   | 需要手动处理      | loading.tsx       |
| 错误边界   | componentDidCatch | error.tsx         |
| 数据获取   | getStaticProps    | async component   |
| API 路由   | pages/api         | app/api           |
| 状态管理   | 任意方案          | 推荐 Server State |

**App Router 优势：**

1. **React Server Components**：减少客户端 JavaScript
2. **嵌套布局**：更容易实现复杂的布局层级
3. **流式渲染**：Streaming SSR，更快首屏
4. **Suspense**：内置 Suspense 支持
5. **更好的 TypeScript 支持**

### 问题三：Next.js 如何实现认证？

**答案要点**：

```typescript
// 使用 NextAuth.js (Auth.js)
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await validateUser(credentials.email, credentials.password);
        if (user) return user;
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
});

export { handler as GET, handler as POST };

// 使用 Session 保护页面
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return <div>Protected Dashboard</div>;
}
```

### 问题四：Next.js 如何进行性能优化？

**答案要点**：

**1. 图片优化**

```typescript
<Image src={src} alt={alt} priority loading="lazy" />
```

**2. 组件懒加载**

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // 客户端-only
});
```

**3. 字体优化**

```typescript
// 自动优化和预加载字体
const inter = Inter({ subsets: ["latin"], display: "swap" });
```

**4. 代码分割**

- Next.js 自动按路由分割
- dynamic import 进一步分割

**5. Prefetch 优化**

```typescript
<Link href="/about" prefetch={true} />
```

**6. Caching Headers**

```typescript
// next.config.js
module.exports = {
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
        ];
    },
};
```

### 问题五：Next.js 的 Middleware 是什么？如何使用？

**答案要点**：

```typescript
// middleware.ts (项目根目录)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // 获取 token
    const token = request.cookies.get("token")?.value;

    // 检查受保护的路由
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 添加请求头
    const response = NextResponse.next();
    response.headers.set("x-custom-header", "value");
    return response;
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
```

### 问题六：如何优化 Next.js 的 SEO？

**答案要点**：

```typescript
// app/layout.tsx
export const metadata = {
    title: "My Website",
    description: "Description of my website",
    keywords: ["nextjs", "react", "seo"],
    authors: [{ name: "Author" }],
    openGraph: {
        title: "My Website",
        description: "Description",
        url: "https://mywebsite.com",
        siteName: "MyWebsite",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "My Website",
        description: "Description",
    },
};

// 动态 metadata
export async function generateMetadata({ params }) {
    const product = await getProduct(params.id);

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            images: [product.imageUrl],
        },
    };
}

// robots.txt
// app/robots.txt
export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/private/",
        },
        sitemap: "https://mywebsite.com/sitemap.xml",
    };
}
```

## 最佳实践

### 项目结构建议

```
my-next-app/
├── app/                        # App Router
│   ├── (marketing)/            # 路由组（不影响 URL）
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── about/page.tsx
│   ├── (app)/                 # 另一个路由组
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── settings/page.tsx
│   │   └── layout.tsx
│   ├── api/                   # API Routes
│   │   └── users/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # 通用 UI 组件
│   └── forms/                 # 表单组件
├── lib/                       # 工具函数
│   ├── utils.ts
│   └── api.ts
├── public/                    # 静态资源
├── styles/                    # 全局样式
└── types/                     # TypeScript 类型
```
