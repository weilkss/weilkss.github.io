# Git 面试指南

## 核心概念

Git 是现代前端工程化中不可或缺的版本控制工具，面试中经常考察对 Git 的深入理解。

---

## 基本命令

### 基础操作

```bash
# 初始化仓库
git init

# 克隆仓库
git clone https://github.com/user/repo.git
git clone --depth 1 https://github.com/user/repo.git # 浅克隆

# 添加文件
git add file.txt          # 添加单个文件
git add .                  # 添加所有文件
git add -p                 # 交互式添加（部分添加）

# 提交
git commit -m "message"
git commit -am "message"   # 跳过 add 直接提交已跟踪文件
git commit --amend         # 修改最后一次提交

# 查看状态
git status
git status -s              # 简洁格式
```

### 分支操作

```bash
# 创建分支
git branch feature         # 创建但不切换
git checkout -b feature   # 创建并切换
git switch -c feature     # 新语法，创建并切换

# 切换分支
git checkout feature
git switch feature         # 新语法

# 合并分支
git merge feature         # 合并 feature 到当前分支
git merge --no-ff feature # 禁用快进合并，保留分支历史

# 删除分支
git branch -d feature     # 安全删除
git branch -D feature     # 强制删除
```

### 远程操作

```bash
# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 拉取
git fetch origin          # 获取远程更新（不合并）
git pull origin main      # 拉取并合并

# 推送
git push origin main
git push -u origin main   # 设置上游分支
git push --force          # 强制推送（慎用）

# 查看远程
git remote -v
git remote show origin
```

---

## 面试高频问题

### Q1：git pull 和 git fetch + git merge 的区别？

**答**：

| 操作 | git pull | git fetch + git merge |
|------|----------|----------------------|
| 执行内容 | 拉取并合并 | 分两步执行 |
| 安全性 | 可能产生冲突时直接暴露 | 可以先查看远程更新再合并 |
| 灵活性 | 不够灵活 | 可以先 `git log origin/main` 查看再决定 |

**原理**：
```bash
# git pull = git fetch + git merge
git fetch origin main
git log origin/main..HEAD  # 查看本地提交
git merge origin/main     # 合并到当前分支

# 推荐做法：先 fetch 查看，再决定是否合并
git fetch origin
git diff origin/main      # 查看差异
git merge origin/main     # 确认后合并
```

### Q2：git merge 和 git rebase 的区别？

**答**：

| 特性 | git merge | git rebase |
|------|-----------|------------|
| 合并方式 | 创建新的合并提交 | 变基，将提交"复制"到目标分支上 |
| 历史记录 | 保留分支合并历史 | 线性历史，更干净 |
| 适用场景 | 合并公共分支 | 整理本地提交、合并私有分支 |

**示例**：
```bash
# 场景：main 分支有新的提交
#        A---B---C  main
#           \
#            D---E  feature

# merge 方式
git checkout main
git merge feature
# 结果：
#        A---B---C---F  main
#           \      /
#            D---E  feature

# rebase 方式
git checkout feature
git rebase main
# 结果：
#        A---B---C---D'---E'  feature
#                   ↑
#                   新的位置
```

**注意**：不要对已推送到远程的提交进行 rebase！

### Q3：如何处理冲突？

**答**：

**产生冲突的场景**：
1. 合并分支时同一文件被不同人修改
2. rebase 时同一文件被不同人修改
3. pull 时本地有未提交的修改

**解决步骤**：
```bash
# 1. 执行合并/rebase，产生冲突
git merge feature
# Auto-merging file.txt
# CONFLICT (content): Merge conflict in file.txt

# 2. 查看冲突文件
git status
# Unmerged paths:
#   both modified:   file.txt

# 3. 编辑冲突文件，手动解决
# <<<<<<< HEAD
# 当前分支的内容
# =======
# 要合并分支的内容
# >>>>>>> feature

# 4. 标记为已解决
git add file.txt

# 5. 完成提交
git commit  # merge 时
git rebase --continue  # rebase 时
```

**最佳实践**：
1. 冲突处理前先 `git diff` 查看差异
2. 与同事沟通确定最终代码
3. 保留必要的代码，不要简单删掉一方
4. 测试验证后再提交

### Q4：如何撤销操作？

**答**：

```bash
# 撤销工作区的修改（未 add）
git checkout -- file.txt
git restore file.txt          # 新语法

# 撤销暂存区的文件（已 add，未 commit）
git reset HEAD file.txt       # 取消暂存
git restore --staged file.txt # 新语法

# 撤销提交（未 push）
git reset --soft HEAD~1       # 保留修改在暂存区
git reset --mixed HEAD~1      # 保留修改在工作区（默认）
git reset --hard HEAD~1        # 完全撤销，删除修改（危险！）

# 恢复已删除的提交（未关闭终端）
git reflog                     # 查看所有操作记录
git reset --hard HEAD@{n}     # 恢复到指定位置

# 撤销已 push 的提交
git revert HEAD                # 创建一个新的提交来撤销
git push origin main
```

### Q5：git reset、git revert、git checkout 的区别？

**答**：

| 命令 | 作用 | 是否改历史 | 适用场景 |
|------|------|------------|----------|
| git reset | 回退到指定提交 | ✅ 改历史 | 撤销本地提交 |
| git revert | 撤销指定提交 | ❌ 创建新提交 | 撤销已推送的提交 |
| git checkout | 切换分支/恢复文件 | ❌ | 切换分支/恢复工作区 |

```bash
# reset - 回退历史，会丢失提交
# A -> B -> C -> D (HEAD)
# reset 到 B：A -> B (丢失 C, D)

# revert - 反向合并，安全撤销
# A -> B -> C -> D (HEAD)
# revert C：C 被撤销但保留，产生新提交 E
# A -> B -> C -> D -> E
```

### Q6：什么是 Git Flow 工作流？

**答**：

**分支类型**：
1. `main/master` - 生产环境代码，只接受 release 和 hotfix 合并
2. `develop` - 开发主分支，集成所有功能分支
3. `feature/*` - 功能分支，从 develop 创建
4. `release/*` - 发布分支，从 develop 创建
5. `hotfix/*` - 热修复分支，从 main 创建

**流程示意**：
```
main:    ────●─────────────────●────────────────●
              ↑                 ↑               ↑
           release/*         release/*        hotfix/*
              |                 |               |
develop: ─────────────────●─────●───●───────────●
                            ↑           ↑
                        feature/*    feature/*
```

**Git Flow 命令**：
```bash
# 开始新功能
git checkout develop
git checkout -b feature/user-login

# 完成功能
git checkout develop
git merge feature/user-login --no-ff
git branch -d feature/user-login

# 开始发布
git checkout -b release/1.0.0 develop
# 修复发布版本的问题
git checkout develop
git merge release/1.0.0 --no-ff
git checkout main
git merge release/1.0.0 --no-ff
git branch -d release/1.0.0

# 热修复
git checkout -b hotfix/1.0.1 main
# 修复后
git checkout main && git merge hotfix/1.0.1 --no-ff
git checkout develop && git merge hotfix/1.0.1 --no-ff
git branch -d hotfix/1.0.1
```

### Q7：如何管理大文件？

**答**：

**Git LFS (Large File Storage)**：
```bash
# 安装
brew install git-lfs
git lfs install

# 追踪大文件
git lfs track "*.psd"
git lfs track "node_modules/**"

# .gitattributes 会自动创建
# *.psd filter=lfs diff=lfs merge=lfs -text

# 正常提交
git add file.psd
git commit -m "Add design file"
git push origin main
```

**大文件管理策略**：
1. 使用 `.gitignore` 忽略 node_modules、dist 等
2. 大型二进制文件使用 Git LFS
3. 设计文件定期归档，不保留历史版本

### Q8：如何回退已经 push 的提交？

**答**：

**方式1：git revert（推荐）**
```bash
# 创建一个新提交来撤销指定提交的修改
git revert <commit-hash>
git push origin main
```

**方式2：git reset + force push（危险）**
```bash
# 本地回退
git reset --hard HEAD~1

# 强制推送（会覆盖远程历史，危险！）
git push --force origin main
```

**场景选择**：
- 已推送到公共分支：使用 `git revert`，安全
- 仅自己使用的分支：可以使用 `git reset`

### Q9：Cherry-pick 的使用场景？

**答**：

**功能**：选择性地应用某个提交的修改到当前分支。

```bash
# 将指定提交应用到当前分支
git cherry-pick <commit-hash>

# 应用多个提交
git cherry-pick <commit-1> <commit-2>

# 应用一系列连续提交
git cherry-pick <start-commit>..<end-commit>

# cherry-pick 时继续
git cherry-pick --continue
git cherry-pick --abort  # 放弃 cherry-pick
git cherry-pick --skip   # 跳过当前提交
```

**应用场景**：
1. 需要将某个功能的几个提交应用到其他分支
2. 在 release 分支上修复 bug，需要同步到 main 和 develop
3. 误删了某个提交，需要恢复到其他分支

```bash
# 示例：把 feature 分支的某个提交应用到 main
git checkout main
git cherry-pick abc123

# 如果有冲突，解决后
git add .
git cherry-pick --continue
```

### Q10：Submodule 和 Subtree 的区别？

**答**：

| 特性 | Submodule | Subtree |
|------|-----------|---------|
| 存储方式 | 独立仓库引用 | 完整副本 |
| 克隆后状态 | 需要 init 更新 | 直接可用 |
| 更新方式 | pull 后手动更新 | 推送更新 |
| 权限要求 | 需要子模块仓库权限 | 不需要 |
| 代码耦合 | 低 | 高 |

```bash
# Submodule 添加
git submodule add https://github.com/user/repo.git libs/repo

# Submodule 克隆后初始化
git clone --recursive https://github.com/user/main-repo.git

# Submodule 更新
cd libs/repo
git pull origin main
cd ../..
git add libs/repo
git commit -m "Update submodule"

# Subtree 添加
git subtree add --prefix=libs/repo https://github.com/user/repo.git main

# Subtree 更新
git subtree pull --prefix=libs/repo https://github.com/user/repo.git main
```

---

## 高级技巧

### 暂存工作

```bash
# 暂存当前修改
git stash
git stash save "message"

# 查看暂存列表
git stash list

# 应用暂存（保留暂存记录）
git stash apply stash@{0}

# 应用并删除暂存
git stash pop

# 删除暂存
git stash drop stash@{0}

# 查看暂存内容
git stash show -p stash@{0}
```

### 交互式 Rebase

```bash
# 修改最近 3 个提交
git rebase -i HEAD~3

# 在打开的编辑器中：
# pick abc123 commit 1
# squash def456 commit 2  # 合并到上一个提交
# reword ghi789 commit 3  # 修改提交信息

# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# d, drop = remove commit
```

### 查找问题

```bash
# 查看某行代码的修改历史
git log -p --follow file.txt
git blame file.txt

# 搜索提交信息
git log --grep="keyword"

# 查看两个分支的差异
git diff main..feature

# 查看已删除文件的历史
git log --all --full-history -- file.txt
```

### 标签管理

```bash
# 创建标签
git tag v1.0.0
git tag -a v1.0.0 -m "version 1.0.0"

# 查看标签
git tag -l
git show v1.0.0

# 推送标签
git push origin v1.0.0
git push origin --tags

# 删除标签
git tag -d v1.0.0
git push origin --delete v1.0.0
```
