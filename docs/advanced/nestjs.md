# NestJS 深入指南

## 核心概念与原理

### 1. NestJS 是什么？它的设计理念是什么？

NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架，采用 TypeScript 编写，借鉴了 Angular 的模块化设计思想。

**核心设计理念：**

1. **模块化架构**：一切皆模块，通过 Module 组织代码
2. **依赖注入**：控制反转（IoC）和依赖注入（DI）容器
3. **装饰器模式**：大量使用 TypeScript 装饰器
4. **渐进式**：可以从简单到复杂，无强制约束
5. **可测试性**：内置依赖注入使单元测试更简单

**与其他框架对比：**

| 特性       | NestJS     | Express    | Koa            |
| ---------- | ---------- | ---------- | -------------- |
| 语言       | TypeScript | JavaScript | JavaScript     |
| 架构       | 模块化+DI  | 简洁灵活   | 中间件洋葱模型 |
| 学习曲线   | 较陡       | 平缓       | 平缓           |
| 企业级支持 | 完善       | 一般       | 一般           |
| 装饰器     | 原生支持   | 不支持     | 不支持         |
| 适用场景   | 企业级应用 | 快速原型   | 轻量级服务     |

### 2. NestJS 的请求处理流程

```
┌─────────────────────────────────────────────────────────────────┐
│                      请求处理流程                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Client Request                                                │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────┐                                                   │
│   │  Guard  │ ──── 认证/授权检查                                  │
│   └────┬────┘                                                   │
│        ▼                                                        │
│   ┌─────────┐                                                   │
│   │ Interceptor │ ──── 前后置处理（日志、响应格式化）             │
│   └────┬────┘                                                   │
│        ▼                                                        │
│   ┌─────────┐                                                   │
│   │  Pipe   │ ──── 数据验证、类型转换                            │
│   └────┬────┘                                                   │
│        ▼                                                        │
│   ┌─────────┐                                                   │
│   │ Controller │ ──── 路由处理                                  │
│   └────┬────┘                                                   │
│        ▼                                                        │
│   ┌─────────┐                                                   │
│   │ Service │ ──── 业务逻辑                                    │
│   └────┬────┘                                                   │
│        ▼                                                        │
│   ┌─────────┐                                                   │
│   │  Filter  │ ──── 异常处理                                    │
│   └────┬────┘                                                   │
│        ▼                                                        │
│   Response                                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 模块化与依赖注入

### 3. NestJS 模块系统的设计

```typescript
// user.module.ts
import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./user.entity";

@Global() // 全局模块，其他模块可直接注入
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService], // 导出供其他模块使用
})
export class UserModule {}

// app.module.ts
import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [UserModule, AuthModule],
})
export class AppModule {}
```

### 4. 依赖注入的底层实现

```typescript
// 注入器实现原理
class Injector {
    private providers = new Map();

    resolve(target: any) {
        const dependencies = Reflect.getMetadata("design:paramtypes", target);
        const resolvedDeps = dependencies.map((dep) => {
            const provider = this.providers.get(dep);
            return this.resolve(provider);
        });

        return new target(...resolvedDeps);
    }
}

// 使用示例
@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService, // 注入
        @Inject("CONFIG") private readonly config: any, // 普通注入
    ) {}
}
```

**常见装饰器：**

| 装饰器          | 作用                 |
| --------------- | -------------------- |
| `@Inject()`     | 手动指定注入的 token |
| `@Optional()`   | 标记可选依赖         |
| `@Injectable()` | 标记为可注入的服务   |
| `@SkipSelf()`   | 跳过当前层级查找依赖 |

### 5. 作用域与生命周期

```typescript
// 默认：单例作用域（整个应用共享）
@Injectable()
export class UserService {}

// 请求作用域（每个请求创建新实例）
@Injectable({ scope: Scope.REQUEST })
export class UserService {}

// 瞬态作用域（每次注入创建新实例）
@Injectable({ scope: Scope.TRANSIENT })
export class UserService {}
```

**生命周期钩子：**

```typescript
@Injectable()
export class UsersService implements OnModuleInit, OnModuleDestroy {
    onModuleInit() {
        console.log("模块初始化");
    }

    onModuleDestroy() {
        console.log("模块销毁");
    }
}
```

## 控制器与路由

### 6. 控制器的完整用法

```typescript
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard)
    @UseInterceptors(LogInterceptor)
    async findAll(@Query("page") page: number = 1, @Query("limit") limit: number = 10, @Query("role") role?: string) {
        return this.userService.findAll({ page, limit, role });
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Patch(":id")
    async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param("id") id: string) {
        return this.userService.remove(+id);
    }
}
```

### 7. DTO 与数据验证

```typescript
// create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(["admin", "user", "guest"])
    role?: string;
}

// main.ts 启用验证
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // 只保留有装饰器的属性
            forbidNonWhitelisted: true, // 抛出未知属性错误
            transform: true, // 自动类型转换
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    await app.listen(3000);
}
```

## 服务与业务逻辑

### 8. 服务层的最佳实践

```typescript
// user.service.ts
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly cacheService: CacheService,
    ) {}

    async findAll(query: UserQuery): Promise<PaginatedResult<User>> {
        const cacheKey = `users:${JSON.stringify(query)}`;

        // 尝试从缓存获取
        const cached = await this.cacheService.get(cacheKey);
        if (cached) return cached;

        const { page, limit, role } = query;
        const [users, total] = await this.userRepository.findAndCount({
            where: role ? { role } : {},
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: "DESC" },
        });

        const result = {
            data: users,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };

        // 缓存结果
        await this.cacheService.set(cacheKey, result, { ttl: 300 });

        return result;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });

        if (existUser) {
            throw new ConflictException("User already exists");
        }

        const user = this.userRepository.create({
            ...createUserDto,
            password: await this.hashPassword(createUserDto.password),
        });

        return this.userRepository.save(user);
    }
}
```

### 9. 事务处理

```typescript
// 方式一：QueryRunner
async createWithTransaction(userDto: CreateUserDto, profileDto: CreateProfileDto) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = await queryRunner.manager.save(User, userDto);
    const profile = await queryRunner.manager.save(Profile, {
      ...profileDto,
      userId: user.id
    });

    await queryRunner.commitTransaction();
    return { user, profile };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// 方式二：TypeORM Transactional Decorator
@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) {}

  @Transaction()
  async createWithTransaction(
    @TransactionRepository(User) userRepo: Repository<User>,
    @TransactionRepository(Profile) profileRepo: Repository<Profile>
  ) {
    // 自动管理事务
  }
}
```

## 中间件、拦截器、守卫

### 10. 守卫（Guard）的使用

```typescript
// auth.guard.ts
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// 使用
@Get('admin')
@UseGuards(AuthGuard, RolesGuard)
@SetMetadata('roles', ['admin'])
async adminOnly() {}
```

### 11. 拦截器（Interceptor）的应用

```typescript
// logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private logger: Logger) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();
                this.logger.log(`${method} ${url} ${response.statusCode} - ${Date.now() - now}ms`);
            }),
            catchError((err) => {
                this.logger.error(`${method} ${url} - Error: ${err.message}`);
                throw err;
            }),
        );
    }
}

// transform.interceptor.ts - 统一响应格式
@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
                data,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}

// cache.interceptor.ts
@Injectable()
export class CacheInterceptor implements NestInterceptor {
    constructor(private readonly cacheService: CacheService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const cacheKey = `cache:${request.url}`;

        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
            return of(cached);
        }

        return next.handle().pipe(
            tap((response) => {
                this.cacheService.set(cacheKey, response, { ttl: 300 });
            }),
        );
    }
}
```

## 异常处理

### 12. 全局异常过滤器

```typescript
// http-exception.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal server error";
        let error = "Error";

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === "string") {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === "object") {
                message = (exceptionResponse as any).message || message;
                error = (exceptionResponse as any).error || error;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error,
            message,
        };

        this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : exception);

        response.status(status).json(errorResponse);
    }
}

// 使用
app.useGlobalFilters(new AllExceptionsFilter());
```

## 数据库集成

### 13. TypeORM 集成

```typescript
// app.module.ts
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get("DB_HOST"),
                port: configService.get("DB_PORT"),
                username: configService.get("DB_USERNAME"),
                password: configService.get("DB_PASSWORD"),
                database: configService.get("DB_DATABASE"),
                entities: [__dirname + "/**/*.entity{.ts,.js}"],
                synchronize: false, // 生产环境关闭
                logging: configService.get("NODE_ENV") === "development",
                migrations: [__dirname + "/migrations/*{.ts,.js}"],
            }),
        }),
    ],
})
export class AppModule {}

// user.entity.ts
@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ default: "user" })
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];
}

// 关系配置
@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => User, (user) => user.posts)
    author: User;
}
```

## 面试精选问题

### 问题一：NestJS 和 Express、Koa 相比有什么优势？

**答案要点**：

**架构优势：**

1. **模块化设计**：NestJS 提供清晰的模块化架构，易于大型项目维护
2. **依赖注入**：内置 DI 容器，提高代码可测试性和可维护性
3. **装饰器**：基于 Angular 的装饰器模式，代码更声明式
4. **类型安全**：完整的 TypeScript 支持，编译时类型检查

**生态系统：**

1. **开箱即用的功能**：认证、验证、缓存、日志等内置支持
2. **统一代码风格**：团队协作时更容易统一代码规范
3. **文档完善**：官方文档详细，社区活跃

**适用场景：**

- 企业级后端应用
- 微服务架构
- 需要高可维护性的项目
- 需要严格类型检查的项目

**NestJS 劣势：**

- 学习曲线较陡
- 框架较重，不适合微小型项目
- 动态性不如 Express

### 问题二：NestJS 的依赖注入是如何工作的？

**答案要点**：

**实现原理：**

1. **装饰器标记**：使用 `@Injectable()` 标记可注入的服务
2. **元数据存储**：通过 `reflect-metadata` 存储依赖信息
3. **容器解析**：IoC 容器根据元数据自动解析依赖关系

```typescript
// 底层原理简化实现
class Container {
    private providers = new Map();

    register(token: any, provider: any) {
        this.providers.set(token, provider);
    }

    resolve(target: any) {
        const dependencies = Reflect.getMetadata("design:paramtypes", target);
        const resolvedDeps = dependencies.map((dep) => this.providers.get(dep));
        return new target(...resolvedDeps);
    }
}
```

**生命周期：**

- `DEFAULT`：单例，应用启动时创建
- `REQUEST`：每个请求创建新实例
- `TRANSIENT`：每次注入创建新实例

### 问题三：如何实现 NestJS 的自定义装饰器？

```typescript
// 1. 自定义参数装饰器
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

// 使用
@Get('profile')
async getProfile(@CurrentUser() user: User) {}

// 2. 自定义类装饰器
export function RequireRole(role: Role) {
  return applyDecorators(
    SetMetadata('roles', [role]),
    UseGuards(RolesGuard)
  );
}

// 使用
@Post()
@RequireRole('admin')
async create() {}

// 3. 自定义守卫装饰器
export const CheckPermission = (permission: string) => {
  return applyDecorators(
    UseGuards(PermissionGuard),
    SetMetadata('permission', permission)
  );
};
```

### 问题四：NestJS 如何实现微服务架构？

```typescript
// main.ts - TCP 微服务
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            host: "localhost",
            port: 3001,
        },
    });

    await app.startAllMicroservices();
    await app.listen(3000);
}

// users 微服务
@Module({
    imports: [
        ClientsModule.register([
            {
                name: "USERS_SERVICE",
                transport: Transport.TCP,
                options: { host: "localhost", port: 3001 },
            },
        ]),
    ],
})
export class UsersModule {}

// 客户端使用
@Injectable()
export class UsersService {
    constructor(@Inject("USERS_SERVICE") private client: ClientProxy) {}

    findAll() {
        return this.client.send({ cmd: "findAll" }, {});
    }
}
```

### 问题五：NestJS 的中间件和拦截器有什么区别？

**中间件：**

- 执行顺序：最早期处理请求
- 无法访问 `ExecutionContext` 的特定信息
- 无法修改控制器的响应
- 适合：日志、静态资源、CORS

**拦截器：**

- 在请求到达控制器前后执行
- 可以包装响应（使用 `map()` 修改返回）
- 可以处理响应后执行逻辑
- 适合：响应格式化、缓存、计时

```typescript
// 中间件
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log("Middleware - before");
        next();
        console.log("Middleware - after");
    }
}

// 拦截器
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        console.log("Interceptor - before");
        return next.handle().pipe(tap(() => console.log("Interceptor - after")));
    }
}
```

### 问题六：NestJS 如何保证安全性？

```typescript
// 1. CSRF 防护
app.use(csurf());

// 2. 速率限制
app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }),
);

// 3. 优雅关闭
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableShutdownHooks();

    process.on("SIGTERM", async () => {
        await app.close();
        process.exit(0);
    });
}

// 4. 输入验证
app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }),
);

// 5. 敏感数据过滤
@Injectable()
export class AuthService {
    private sanitizeUser(user: User) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
}
```

## 最佳实践

### 项目结构建议

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── decorators/
│   │       └── current-user.decorator.ts
│   └── users/
│       ├── users.module.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── dto/
│       │   ├── create-user.dto.ts
│       │   └── update-user.dto.ts
│       └── entities/
│           └── user.entity.ts
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── transform.interceptor.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── decorators/
├── config/
│   ├── database.config.ts
│   └── app.config.ts
├── app.module.ts
└── main.ts
```

### 性能优化

1. **使用 `fastify` 替代默认 Express 适配器**
2. **配置合适的缓存策略**
3. **使用数据库连接池**
4. **合理的索引优化**
5. **使用 `onModuleDestroy` 清理资源**
