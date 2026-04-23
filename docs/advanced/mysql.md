# MySQL 面试指南

## 一、数据库基础概念

### 1.1 什么是数据库？

数据库是按照数据结构来组织、存储和管理数据的仓库，它是一个长期存储在计算机内的、有组织的、可共享的、统一管理的大量数据的集合。

**核心特征：**
- 数据结构化：数据以特定的模型组织，如关系模型、文档模型等
- 数据共享：多个应用程序可以同时访问数据库中的数据
- 数据独立性：应用程序与物理存储细节相分离
- 数据持久化：数据能够长期保存，不会因程序结束而丢失
- 事务支持：保证数据的一致性和完整性

### 1.2 MySQL 存储引擎

MySQL 支持多种存储引擎，不同的存储引擎有不同的特点和适用场景：

| 引擎 | 事务支持 | 锁粒度 | 适用场景 |
|------|----------|--------|----------|
| InnoDB | 支持 | 行级锁 | 默认引擎，适用于大多数场景 |
| MyISAM | 不支持 | 表级锁 | 读多写少，只读表 |
| MEMORY | 不支持 | - | 临时表，高速缓存 |
| CSV | 不支持 | - | 数据交换 |

**InnoDB 是 MySQL 5.5.5 之后的默认存储引擎，它的特点是：**
- 支持行级锁和表级锁
- 支持事务（ACID 特性）
- 支持外键约束
- 采用 MVCC（多版本并发控制）提高并发性能
- 使用聚簇索引存储数据

```sql
-- 查看存储引擎
SHOW ENGINES;

-- 查看当前表使用的存储引擎
SHOW TABLE STATUS LIKE 'table_name';

-- 创建表时指定存储引擎
CREATE TABLE t1 (
    id INT PRIMARY KEY
) ENGINE = InnoDB;

-- 修改表的存储引擎
ALTER TABLE t1 ENGINE = MyISAM;
```

---

## 二、SQL 基础

### 2.1 SQL 语句分类

| 类别 | 说明 | 举例 |
|------|------|------|
| DDL | 数据定义语言 | CREATE, ALTER, DROP, TRUNCATE |
| DML | 数据操作语言 | INSERT, UPDATE, DELETE, SELECT |
| DCL | 数据控制语言 | GRANT, REVOKE |
| TCL | 事务控制语言 | COMMIT, ROLLBACK, SAVEPOINT |

### 2.2 DDL 语句

```sql
-- 创建数据库
CREATE DATABASE db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    age INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 修改表结构
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users MODIFY COLUMN age VARCHAR(10);
ALTER TABLE users DROP COLUMN phone;
ALTER TABLE users ADD INDEX idx_username (username);
ALTER TABLE users ADD FOREIGN KEY (dept_id) REFERENCES depts(id);

-- 删除表
DROP TABLE IF EXISTS users;

-- 清空表（不可回滚）
TRUNCATE TABLE users;
```

### 2.3 DML 语句

```sql
-- 插入数据
INSERT INTO users (username, email, age) VALUES ('张三', 'zhangsan@example.com', 25);
INSERT INTO users (username, email) VALUES 
    ('李四', 'lisi@example.com'),
    ('王五', 'wangwu@example.com');

-- 更新数据
UPDATE users SET age = 30 WHERE id = 1;

-- 删除数据
DELETE FROM users WHERE id = 1;

-- 查询数据（基础）
SELECT * FROM users;
SELECT username, email FROM users WHERE age > 20 ORDER BY created_at DESC LIMIT 10;

-- 聚合函数
SELECT 
    COUNT(*) as total,
    SUM(age) as total_age,
    AVG(age) as avg_age,
    MAX(age) as max_age,
    MIN(age) as min_age
FROM users;

-- 分组查询
SELECT department, COUNT(*) as count, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 5000;

-- 连接查询
SELECT u.username, d.dept_name
FROM users u
INNER JOIN departments d ON u.dept_id = d.id;

-- 子查询
SELECT * FROM users WHERE age > (SELECT AVG(age) FROM users);

-- 联合查询
SELECT username FROM users WHERE status = 'active'
UNION
SELECT username FROM admin_users WHERE login_time > '2024-01-01';
```

---

## 三、索引

### 3.1 索引的概念与作用

**索引是对数据库表中一列或多列的值进行排序的数据结构**，类似于书的目录，可以大大提高查询效率。

**索引的优缺点：**

| 优点 | 缺点 |
|------|------|
| 大幅提高查询速度 | 占用磁盘空间 |
| 加速表与表的连接 | 降低写入性能（INSERT/UPDATE/DELETE） |
| 使用优化器提高性能 | 需要维护成本 |

### 3.2 索引类型

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引
UNIQUE INDEX idx_email (email)

-- 普通索引
INDEX idx_name (name)

-- 复合索引
INDEX idx_name_age (name, age)

-- 全文索引（MyISAM）
FULLTEXT INDEX ft_content (content)

-- 前缀索引
INDEX idx_phone (phone(6))

-- 查看索引
SHOW INDEX FROM users;

-- 删除索引
DROP INDEX idx_name ON users;
```

### 3.3 索引数据结构

**B+ Tree 索引（InnoDB 默认）：**

```
        [15]                    [30]
       /    \                  /     \
   [1,5,10]  [15,20]    [25,28,30]  [35,40]
      |         |           |          |
    数据      数据         数据       数据
```

**B+ Tree 的特点：**
- 所有数据都存储在叶子节点
- 叶子节点之间通过双向链表连接，便于范围查询
- 树高一般控制在 3-4 层，减少磁盘 IO
- 支持等值查询和范围查询

**Hash 索引（Memory 引擎）：**
- 基于 Hash 表实现，查询效率 O(1)
- 只支持等值查询，不支持范围查询和排序
- 适用于等值查询频繁的场景

### 3.4 索引失效场景

```sql
-- 场景1：使用函数或运算
SELECT * FROM users WHERE YEAR(created_at) = 2024;  -- 失效
SELECT * FROM users WHERE age + 1 > 20;             -- 失效

-- 场景2：使用 LIKE 前缀通配符
SELECT * FROM users WHERE name LIKE '%张%';          -- 失效
SELECT * FROM users WHERE name LIKE '张%';          -- 有效

-- 场景3：类型转换
SELECT * FROM users WHERE phone = 13800138000;      -- 失效（字符串字段）

-- 场景4：OR 语句包含非索引列
SELECT * FROM users WHERE name = '张三' OR age = 25; -- 可能失效

-- 场景5：复合索引不符合最左前缀原则
-- 创建索引 INDEX idx_name_age (name, age)
SELECT * FROM users WHERE age = 25;                 -- 失效
SELECT * FROM users WHERE name = '张三';            -- 有效
SELECT * FROM users WHERE name = '张三' AND age = 25;  -- 有效
```

### 3.5 索引优化策略

```sql
-- 1. 选择区分度高的列作为索引
SELECT COUNT(DISTINCT name) / COUNT(*) FROM users;  -- 区分度越接近1越好

-- 2. 控制索引数量，避免过多索引
-- 3. 使用覆盖索引减少回表查询
CREATE INDEX idx_name_age ON users(name, age);
SELECT name, age FROM users WHERE name = '张三';  -- 不需要回表

-- 4. 短索引优化，对于字符串类型使用前缀索引
ALTER TABLE users ADD INDEX idx_phone (phone(6));

-- 5. 利用索引进行排序
SELECT * FROM users WHERE age > 20 ORDER BY created_at;
CREATE INDEX idx_age_created ON users(age, created_at);
```

---

## 四、事务

### 4.1 事务的概念

**事务是数据库执行的基本单位，它是一个不可分割的操作序列**，具有 ACID 四大特性。

**ACID 特性：**

| 特性 | 说明 | 举例 |
|------|------|------|
| Atomic（原子性） | 事务是最小执行单位，不可分割 | 转账操作要么全部成功，要么全部失败 |
| Consistency（一致性） | 事务执行前后，数据库状态保持一致 | 转账前后总金额不变 |
| Isolation（隔离性） | 并发执行的事务相互隔离，不相互干扰 | 两个转账操作同时进行，结果正确 |
| Durability（持久性） | 事务提交后，其结果永久保存 | 提交后数据不会丢失 |

### 4.2 事务隔离级别

```sql
-- 查看当前会话隔离级别
SELECT @@tx_isolation;
SELECT @@transaction_isolation;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | 实现方式 |
|----------|------|-----------|------|----------|
| READ UNCOMMITTED | 可能 | 可能 | 可能 | 无 |
| READ COMMITTED | 不可能 | 可能 | 可能 | 快照读 |
| REPEATABLE READ（MySQL默认） | 不可能 | 不可能 | 可能 | MVCC + Next-Key Lock |
| SERIALIZABLE | 不可能 | 不可能 | 不可能 | 锁机制 |

**脏读、不可重复读、幻读的概念：**

```sql
-- 脏读：读取到其他事务未提交的数据
-- 事务A                      事务B
BEGIN;                       BEGIN;
UPDATE users SET age=30;    -- 
SELECT age FROM users;      -- 读取到age=30（脏数据）
ROLLBACK;                   -- 
                            COMMIT;

-- 不可重复读：同一事务中，两次读取同一数据结果不同
-- 事务A                      事务B
BEGIN;
SELECT age FROM users;      -- age=25
                            BEGIN;
                            UPDATE users SET age=30;
                            COMMIT;
SELECT age FROM users;      -- age=30（不可重复读）
COMMIT;

-- 幻读：同一事务中，两次查询结果集不同（新增或删除）
-- 事务A                      事务B
BEGIN;
SELECT * FROM users;        -- 5条记录
                            INSERT INTO users VALUES(...);
                            COMMIT;
SELECT * FROM users;        -- 6条记录（幻读）
COMMIT;
```

### 4.3 事务控制语句

```sql
-- 开启事务
START TRANSACTION;
BEGIN;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;

-- 设置保存点
SAVEPOINT point1;

-- 回滚到保存点
ROLLBACK TO point1;

-- 关闭自动提交
SET autocommit = 0;

-- 开启自动提交
SET autocommit = 1;
```

### 4.4 事务并发问题解决方案

**MVCC（Multi-Version Concurrency Control）：**

```sql
-- InnoDB 中的 MVCC 实现
-- 每行数据有两个隐藏列：DB_TRX_ID（创建版本）和 DB_ROLL_PTR（删除版本）

-- SELECT 读取规则：
-- 1. 读取创建版本 <= 当前事务版本
-- 2. 读取删除版本 > 当前事务版本 或 未定义
SELECT * FROM users WHERE id = 1;

-- 快照读：读取历史版本，不加锁
-- 当前读：读取最新数据，加锁
SELECT * FROM users WHERE id = 1 FOR UPDATE;  -- 当前读，加锁
```

**Next-Key Lock（临键锁）：**

```sql
-- 范围查询时，锁定索引区间（左开右闭）
SELECT * FROM users WHERE age BETWEEN 10 AND 30 FOR UPDATE;
-- 锁定区间：(-∞, 10], (10, 30], (30, +∞)

-- 记录锁：锁定单条记录
SELECT * FROM users WHERE id = 1 FOR UPDATE;

-- 间隙锁：锁定区间
SELECT * FROM users WHERE age > 20 AND age < 30 FOR UPDATE;
-- 锁定区间：(20, 30)
```

---

## 五、锁

### 5.1 锁的分类

```
按操作划分：
├── 共享锁（S锁）：SELECT ... LOCK IN SHARE MODE
└── 排他锁（X锁）：SELECT ... FOR UPDATE

按粒度划分：
├── 表级锁：MyISAM，InnoDB 表锁
├── 行级锁：InnoDB 行锁
└── 页级锁：BDB 引擎

按实现划分：
├── 悲观锁：先加锁再操作
└── 乐观锁：基于版本号实现
```

### 5.2 InnoDB 行锁

```sql
-- 共享锁：允许事务读取数据
SELECT * FROM users WHERE id = 1 LOCK IN SHARE MODE;

-- 排他锁：允许事务删除或更新数据
SELECT * FROM users WHERE id = 1 FOR UPDATE;

-- 间隙锁：锁定区间
SELECT * FROM users WHERE id > 10 AND id < 20 FOR UPDATE;
-- 锁定区间：(10, 20)
```

### 5.3 死锁及其处理

**死锁产生条件：**
1. 互斥条件：资源一次只能被一个事务使用
2. 请求与保持条件：事务已保持至少一个资源
3. 不剥夺条件：资源不能被强制剥夺
4. 循环等待条件：形成资源循环等待链

```sql
-- 查看死锁日志
SHOW ENGINE INNODB STATUS;

-- 处理死锁的方法：
-- 1. InnoDB 自动检测并回滚小事务
-- 2. 按固定顺序访问表
-- 3. 大事务拆分为小事务
-- 4. 减少锁持有时间
```

**避免死锁的策略：**

```sql
-- 1. 按固定顺序访问表
-- 错误示例：
UPDATE users SET age = 30 WHERE id = 1;  -- 先更新 id=1
UPDATE orders SET status = 'paid' WHERE id = 2;  -- 后更新 id=2

-- 正确示例：
UPDATE users SET age = 30 WHERE id = 1;
UPDATE users SET age = 30 WHERE id = 2;

-- 2. 使用低隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 3. 添加合理的索引，减少锁的范围
```

---

## 六、性能优化

### 6.1 SQL 优化

```sql
-- 1. 避免 SELECT *，只查询需要的字段
SELECT id, username, email FROM users WHERE id = 1;

-- 2. 使用 LIMIT 限制返回行数
SELECT * FROM users LIMIT 100;

-- 3. 使用批量操作减少数据库交互
INSERT INTO users (name) VALUES ('A'), ('B'), ('C');

-- 4. 避免在 WHERE 条件中使用函数
-- 低效：
SELECT * FROM users WHERE YEAR(created_at) = 2024;
-- 高效：
SELECT * FROM users WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- 5. 使用 EXPLAIN 分析查询
EXPLAIN SELECT * FROM users WHERE name = '张三';
```

### 6.2 EXPLAIN 分析

```sql
EXPLAIN SELECT u.*, o.* 
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id 
WHERE u.age > 20;

-- 输出字段说明：
-- id: 查询序号
-- select_type: 查询类型（SIMPLE, PRIMARY, SUBQUERY, DERIVED, UNION）
-- table: 表名
-- type: 连接类型（system, const, eq_ref, ref, range, index, ALL）
-- possible_keys: 可能使用的索引
-- key: 实际使用的索引
-- key_len: 索引长度
-- ref: 使用常量还是字段
-- rows: 估算读取的行数
-- Extra: 额外信息（Using index, Using filesort, Using temporary）
```

### 6.3 慢查询日志

```sql
-- 查看慢查询配置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';

-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- 超过1秒记录

-- 分析慢查询
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log;

-- 使用 performance_schema
SELECT * FROM performance_schema.events_statements_summary_by_digest 
ORDER BY SUM_TIMER_WAIT DESC LIMIT 10;
```

---

## 七、面试题

### 7.1 面试题1：InnoDB 和 MyISAM 的区别？

**参考答案：**

| 特性 | InnoDB | MyISAM |
|------|--------|--------|
| 事务支持 | 支持 | 不支持 |
| 锁粒度 | 行级锁 | 表级锁 |
| 外键约束 | 支持 | 不支持 |
| 全文索引 | 5.6+支持 | 支持 |
| 存储结构 | 聚簇索引 | 非聚簇索引 |
| 崩溃恢复 | 自动恢复 | 需手动修复 |
| 查询性能 | 大量查询稍慢 | 大量查询更快 |
| 写入性能 | 事务写入较慢 | 写入较快 |

**实际选择建议：**
- 需要事务支持、外键约束、并发写入：选择 InnoDB
- 只读表、大量全文搜索需求：选择 MyISAM
- 现代应用默认选择 InnoDB

### 7.2 面试题2：什么是聚簇索引和非聚簇索引？

**参考答案：**

**聚簇索引（Clustered Index）：**
- 数据行与索引存储在一起，叶子节点包含完整数据
- 每个表只能有一个聚簇索引（主键索引）
- 适合范围查询和主键查询
- 插入数据时可能造成页分裂，影响性能

**非聚簇索引（Non-clustered Index）：**
- 叶子节点只存储索引列和主键值
- 查询时需要回表（根据主键查找完整数据）
- 一个表可以有多个非聚簇索引
- 插入性能较高

```sql
-- InnoDB 使用聚簇索引
CREATE TABLE orders (
    id INT PRIMARY KEY,           -- 聚簇索引，叶子节点包含所有数据
    order_no VARCHAR(20) UNIQUE,  -- 非聚簇索引，叶子节点包含 order_no 和 id
    amount DECIMAL(10,2)
);

-- 查询流程
SELECT * FROM orders WHERE id = 1;           -- 直接通过聚簇索引获取
SELECT * FROM orders WHERE order_no = 'A001'; -- 先通过非聚簇索引找到 id，再回表查询
```

### 7.3 面试题3：如何优化慢查询？

**参考答案：**

**步骤一：定位慢查询**
```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- 查看慢查询
SHOW FULL PROCESSLIST;
```

**步骤二：分析查询计划**
```sql
EXPLAIN SELECT * FROM users WHERE name = '张三';

-- 重点关注：
-- type: 最好达到 ref 或 range 级别
-- key: 确认使用了索引
-- rows: 扫描行数越少越好
-- Extra: 避免 Using filesort, Using temporary
```

**步骤三：针对性优化**

```sql
-- 1. 优化索引
ALTER TABLE users ADD INDEX idx_name (name);

-- 2. 优化 SQL 语句
-- 低效：
SELECT * FROM users WHERE YEAR(created_at) = 2024;
-- 高效：
SELECT * FROM users WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- 3. 优化数据类型
-- 使用 TINYINT 替代 INT 存储状态
ALTER TABLE users MODIFY COLUMN status TINYINT DEFAULT 0;

-- 4. 读写分离
-- 主库写入，从库读取
```

**步骤四：使用缓存**
```sql
-- 应用层缓存（Redis）
const cacheKey = `user:${userId}`;
const cachedUser = await redis.get(cacheKey);
if (cachedUser) {
    return JSON.parse(cachedUser);
}
const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
await redis.setex(cacheKey, 3600, JSON.stringify(user));
return user;
```

### 7.4 面试题4：MySQL 如何保证高可用？

**参考答案：**

**主从复制架构：**

```sql
-- 主库配置（my.cnf）
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog-format = ROW

-- 从库配置（my.cnf）
[mysqld]
server-id = 2
relay-log = relay-bin
read-only = ON

-- 主库创建复制用户
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- 从库执行复制命令
CHANGE MASTER TO 
    MASTER_HOST = 'master_host',
    MASTER_USER = 'repl',
    MASTER_PASSWORD = 'password',
    MASTER_LOG_FILE = 'mysql-bin.000001',
    MASTER_LOG_POS = 123;
START SLAVE;
```

**读写分离：**

```javascript
// 应用层实现读写分离
class DatabaseRouter {
    getConnection(isWrite) {
        if (isWrite) {
            return mysqlPool.master;
        }
        return mysqlPool.slave;
    }
}

// 中间件实现
app.use(async (ctx, next) => {
    const isWrite = ['POST', 'PUT', 'DELETE'].includes(ctx.method);
    ctx.db = dbRouter.getConnection(isWrite);
    await next();
});
```

**故障转移方案：**
1. MHA（MySQL High Availability）
2. MySQL Cluster
3. Galera Cluster
4. ProxySQL + Keepalived

### 7.5 面试题5：分库分表策略

**参考答案：**

**垂直拆分：按业务拆分**

```sql
-- 用户库
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100)
);

-- 订单库
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,2)
);
```

**水平拆分：按数据拆分**

```sql
-- 按用户ID取模分表
-- user_0: id % 3 == 0
-- user_1: id % 3 == 1
-- user_2: id % 3 == 2

-- 按时间分表
-- orders_2024_Q1
-- orders_2024_Q2

-- 分片键选择原则：
-- 1. 尽量均匀分布
-- 2. 查询频繁的字段
-- 3. 不经常修改
```

**分片中间件：**
- ShardingSphere
- MyCat
- Cobar
- Vitess

---

## 八、Redis 相关（扩展）

### 8.1 MySQL + Redis 缓存策略

```sql
-- 缓存穿透：布隆过滤器
SELECT * FROM users WHERE id = ?

-- 缓存击穿：互斥锁或逻辑过期
-- 逻辑过期示例：
function getUser(id) {
    const cacheKey = `user:${id}`;
    const cached = redis.get(cacheKey);
    
    if (cached) {
        const user = JSON.parse(cached);
        if (user.logical_expire > Date.now()) {
            return user;
        }
    }
    
    // 获取锁
    const lockKey = `lock:user:${id}`;
    const lock = redis.set(lockKey, '1', 'NX', 'EX', 10);
    
    if (lock) {
        const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        user.logical_expire = Date.now() + 3600000;
        redis.setex(cacheKey, 3600, JSON.stringify(user));
        redis.del(lockKey);
        return user;
    }
    
    // 等待后重试
    await sleep(100);
    return getUser(id);
}

-- 缓存雪崩：过期时间随机化 + 持久化
redis.setex(`user:${id}`, Math.random() * 3600, JSON.stringify(user));
```
