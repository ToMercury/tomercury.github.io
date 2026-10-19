# 网站架构与修改指南

> 本文档面向"我想改网站，但不知道动哪个文件"的场景。
> 面向站点维护者；给 AI/agent 看的仓库规则见 [`AGENTS.md`](./AGENTS.md)。
> 本文件已被 `_config.yml` 的 `exclude` 排除，**不会被发布到网站上**。

---

## 1. 这是什么

基于 **Jekyll 4 + Chirpy 7.6.0 主题源码**的静态站点/作品集：
主题代码**直接改在本仓库里**（不是通过 gem 引用），所以"改主题"和"改内容"是同一个仓库里的事。

```
内容(YAML/Markdown) + 模板(Liquid) --Jekyll--> _site/(纯静态HTML) --GitHub Pages--> 线上
                                                        ↑
                     JS(_javascript/)-[npm run build]->assets/js/dist/(已提交到 git)
                     SCSS(_sass/)-[npm run build]->_sass/vendors/_bootstrap.scss(已提交)
```

两条独立的构建管线，**只有 Jekyll 那条会自动跑**：

| 管线 | 命令 | 产物 | 谁来跑 |
|---|---|---|---|
| 页面渲染 | `bundle exec jekyll b` | `_site/` | 本地 `tools/` 脚本、CI |
| JS/CSS 打包 | `npm run build` | `assets/js/dist/*.min.js`、`_sass/vendors/_bootstrap.scss` | **只有你手动跑**（CI 不跑 npm！） |

⚠️ 所以：改了 `_javascript/` 或增删了 Bootstrap 类，必须 `npm run build` 并**提交产物**，否则线上不生效。

### 根目录结构地图：为什么有的在一级、有的在二级

根目录看着杂，其实只有四类东西，**各有各的归属规则，没有可以安全挪动的文件**（与上游 Chirpy 仓库逐一对照过，差异只有本 fork 新增的 5 个文件）：

```text
根目录/
├── 【页面】带 front matter、会生成网页的源文件 → 放根目录（或 _tabs/）
│   ├── index.md              关于我 → /
│   ├── _tabs/*.md            左侧导航 8 个栏目（含 Archives/Categories/Tags 索引页）
│   └── _posts/*.md           博文（Jekyll 规定的固定目录名）
│
├── 【主题源码】_ 开头 = 引擎内部目录，Jekyll 不会原样拷贝发布
│   ├── _layouts/  _includes/     模板与片段（改外观动这里）
│   ├── _sass/  _javascript/      样式 / JS 源码（产物 → assets/js/dist）
│   ├── _data/                    数据（locales、contact…）
│   ├── _tabs/                    ↑ 既算源码目录也是页面目录
│   └── _plugins/                 构建期 Ruby 钩子
│
├── 【发布资源】assets/           唯一原样发布到线上的静态目录
│                                 （图片、favicon、编译后 JS、404.html、feed.xml、search.json）
│
├── 【工具配置】必须在根目录 —— Ruby / npm / lint 工具只认这个位置，移动即失效
│   ├── Gemfile(+lock)  .ruby-version  jekyll-theme-chirpy.gemspec
│   ├── package.json(+lock)  rollup.config.js  purgecss.js  eslint.config.js
│   ├── .stylelintrc.json  .markdownlint.json  .editorconfig
│   └── _config.yml              ← Jekyll 唯一入口配置
│
├── 【不发布的目录】Jekyll 默认忽略 _ 与 . 开头 + exclude 列表
│   ├── docs/  tools/  README.md  AGENTS.md  ARCHITECTURE.md  LICENSE   ← exclude 显式排除
│   ├── .github/  .husky/  .vscode/  .devcontainer/  .nojekyll 等点目录  ← 点开头默认忽略
│   └── _site/  node_modules/  .jekyll-cache/                            ← 构建产物/依赖，gitignore
│
└── 【文档】README.md（上游说明）  AGENTS.md（给 agent 的仓库规则）  ARCHITECTURE.md（本文）
```

判断规则（遇到新文件不知道放哪时用）：

| 问题 | 答案 |
|---|---|
| 是页面（有 front matter、要有 URL）吗？ | 是 → 根目录；要进左侧导航 → `_tabs/`；是文章 → `_posts/` |
| 是模板/样式/JS/数据吗？ | → 对应 `_layouts`/`_includes`/`_sass`/`_javascript`/`_data`，**路径是 Jekyll 约定，不可移动** |
| 是图片/发布出去的静态文件吗？ | → `assets/` 下 |
| 是构建或工具配置吗？ | → 根目录，**工具强制要求，不可移动** |
| 是文档/脚本且不该发布吗？ | → 根目录或 `docs/`，并加进 `_config.yml` 的 `exclude:` |

---

## 2. 一个页面是怎么生成的（模板继承链）

```
_layouts/compress.html        ← 最外层：HTML 压缩
 └─ _layouts/default.html     ← 三栏骨架：左栏 + 主区 + 右栏 + 页脚
     ├─ page.html             ← 普通页面（tab、关于我、404…）
     │   ├─ archives.html / categories.html / tags.html   ← 归档类
     │   └─ category.html / tag.html   ← 单个分类/标签页（jekyll-archives 生成）
     ├─ post.html             ← 博文
     └─ home.html             ← 文章列表（/posts/）
```

`default.html` 展开后每个区域对应的文件：

| 区域 | 文件 | 说明 |
|---|---|---|
| `<head>` | `_includes/head.html` | SEO/favicon/meta，子模块见 `head.html` 内注释 |
| **左栏** | `_includes/sidebar.html` | 头像、站名、导航、主题切换、社交图标 |
| 顶栏 | `_includes/topbar.html` | 菜单按钮 + **搜索框** |
| **主内容** | 就是上面继承链里那个 layout 的内容 | |
| **右栏** | `_layouts/default.html` 里的 `.access` 块 | 见 §4 |
| 页脚 | `_includes/footer.html` | 版权（读 `_config.yml` 的 `social`） |
| 搜索结果 | `_includes/search-results.html` + `search-loader.html` | 见 §6 |
| 全站 JS 分发 | `_includes/js-selector.html` | 按 `page.layout` 决定加载哪个 JS |

页面 front matter 里的 `panel_includes` / `tail_includes` / `script_includes` 是**插槽**，
在对应 layout 里循环渲染，例如 `post.html` 用它们挂上了 `toc`、`related-posts`、`post-nav`、`comment`。

---

## 3. 站点地图：URL ↔ 源文件（改内容先查这张表）

| URL | 源文件 | layout | 归属导航 |
|---|---|---|---|
| `/` 关于我 | **`index.md`** | page | HOME（左侧第一个） |
| `/research/` | `_tabs/research.md` | page | Research |
| `/internships/` | `_tabs/internships.md` | page | Internships |
| `/skills/` | `_tabs/skills.md` | page | Skills |
| `/projects/` | `_tabs/projects.md` | page | Projects |
| `/posts/` | `_tabs/posts.md` | home | Posts（文章列表） |
| `/posts/<标题>/` | `_posts/YYYY-M-D-title.md` | post | 从 /posts/ 或文章内进入 |
| `/archives/` | `_tabs/archives.md` | archives | Archives |
| `/categories/` | `_tabs/categories.md` | categories | Categories |
| `/tags/` | `_tabs/tags.md` | tags | Tags |
| `/categories/<名>/`、`/tags/<名>/` | **无源文件**，`jekyll-archives` 按文章 front matter 自动生成 | category/tag | — |
| `/404.html` | `assets/404.html` | page | — |
| `/feed.xml` | `assets/feed.xml` | compress | — |
| `/app`、`/sw`（PWA） | `_javascript/pwa/{app,sw}.js`（rollup 打包时注入 front matter） | — | — |
| 搜索数据 | `assets/js/data/search.json`（Liquid 遍历文章生成） | compress | — |

导航与 URL 的对应关系由 `_config.yml` 决定：

```yaml
collections:
  tabs:
    output: true
    sort_by: order          # ← 左栏顺序 = _tabs/*.md 里的 order 字段
defaults:
  - scope: { type: tabs }
    values: { layout: page, permalink: /:title/ }   # ← /research/ 来自文件名 research.md
  - scope: { type: posts }
    values: { layout: post, permalink: /posts/:title/ }  # ⚠️ 别改，已有链接会全部失效
```

---

## 4. 左栏导航 & 右栏模块怎么来的

### 左栏（`_includes/sidebar.html`）

- **HOME 项是硬编码的**（`href="/"`，高亮条件 `page.url == '/'`，文案来自
  `_data/locales/en.yml` 的 `tabs.home: Home`）。
- 其余项 = 遍历 `site.tabs`（即 `_tabs/` 集合，按 `order` 排序）：
  - 图标 ← front matter `icon:`（Font Awesome 类名，如 `fas fa-microscope`）
  - 文案 ← 优先查 locales，查不到就用 front matter `title:`（当前 5 个 tab 都走后者）
  - 高亮 ← `tab.url == page.url`
- **增删/排序/改名导航 = 只改 `_tabs/*.md`**（新建一个 md 就多一个导航项）。
- **显示/隐藏某一项** = `_config.yml` 的 `nav_tabs:`（键为 URL 最后一段，如 `posts: off`）；
  只隐藏侧栏项，页面仍会生成。HOME 硬编码，不能关。
- 底部社交图标 ← `_data/contact.yml`；头像/站名/副标题 ← `_config.yml` 的 `avatar/title/tagline`。

### 右栏（`_layouts/default.html` 的 `.access` 块）

```liquid
{% include_cached update-list.html %}     ← 「最近更新」列表（数据=site.posts，条数见该文件 MAX_SIZE）
{% include_cached trending-tags.html %}   ← 「热门标签」（按文章数统计）
<!-- 然后按 layout.panel_includes 追加：post 页多一个「文章内容」TOC -->
```

**增删右栏模块 = 在 `default.html` 这个块里增删一行 `include`**，新建对应
`_includes/xxx.html` 即可。

---

## 5. 修改定位表（想改什么 → 打开哪个文件）★

| 我想改… | 打开这个 |
|---|---|
| 站名 / 副标题 / 简介 / URL / 语言 / 时区 / 头像 / 社交链接 | `_config.yml` |
| 关于我主页的正文 | `index.md` |
| 科研 / 实习 / 技术栈 / 项目 页的正文 | `_tabs/research.md`、`_tabs/internships.md`、`_tabs/skills.md`、`_tabs/projects.md` |
| 写一篇新文章 | 新建 `_posts/YYYY-M-D-标题.md` |
| 文章列表页（/posts/）的样子 | `_tabs/posts.md`（front matter）+ `_layouts/home.html`（渲染逻辑） |
| 文章列表顶部的 Browse 链接 | `_includes/browse-links.html`（由 `_tabs/posts.md` 的 `browse_links: true` 开关，`_layouts/home.html` 渲染） |
| 年份归档页（/archives/，不进侧栏） | 根目录 `archives.html`（与 `categories.html`/`tags.html` 同一模式） |
| 左栏导航的项 / 顺序 / 图标 / 文案 / 显隐 | `_tabs/*.md` 的 `order` / `icon` / `title`；显隐用 `_config.yml` 的 `nav_tabs`（如 `posts: off`）；HOME 项在 `_includes/sidebar.html` |
| 左栏底部社交按钮 | `_data/contact.yml` |
| 右栏模块的增删 / 顺序 | `_layouts/default.html` 的 `.access` 块 |
| 右栏「最近更新」条数 | `_includes/update-list.html` 里的 `MAX_SIZE` |
| 页脚版权文字/链接 | `_config.yml` 的 `social:` + `_includes/footer.html` |
| 界面文案（导航、「最近更新」、「搜索」…） | `_data/locales/en.yml`（`_config.yml` 里 `lang: en` 已切原版英文；改回中文界面需同时把 tab `title` 换回中文） |
| 字体 / 品牌色 | `_sass/abstracts/_variables.scss`（`$font-family-*` 等） |
| 明暗主题配色 | `_sass/themes/_light.scss`、`_sass/themes/_dark.scss` |
| 布局细节（侧栏/顶栏/右栏宽度间距） | `_sass/layout/*.scss` |
| 某个页面专属样式 | `_sass/pages/*.scss`（`_home.scss`/`_post.scss`/`_search.scss`…） |
| 交互行为（滚动、主题切换、PWA…） | `_javascript/*.js` → **改完必须 `npm run build` 并提交 `assets/js/dist/`** |
| 搜索框行为 / 结果高亮 | `_includes/search-loader.html`（`buildSnippet()` 负责上下文高亮） |
| 搜索用的库 | `assets/js/vendor/simple-jekyll-search.min.js`（**本地补丁版，见 §6，勿从 CDN 升级**） |
| favicon | `assets/img/favicons/` + `_includes/favicons.html`（链接已集中在后者，别处不用加） |
| SEO 描述 / 社交卡片 | `_config.yml` 的 `description` 等；自定义 meta 加 `_includes/metadata-hook.html` |
| 评论系统 | `_config.yml` 的 `comments.provider`（giscus/utterances/disqus）+ `_includes/comments/` |
| 访问统计 | `_config.yml` 的 `analytics.` + `_includes/analytics/` |
| PWA（安装/离线缓存） | `_config.yml` 的 `pwa.` + `_javascript/pwa/` + `_config.yml` 里的 `pwa.cache.exclude` |
| 404 页 | `assets/404.html` |
| 新增一个"顶级页面"但不放进导航 | 在根目录新建带 front matter + `permalink` 的页面，**不要**放进 `_tabs/` |
| 让某个根目录文件**不被发布** | `_config.yml` 的 `exclude:` 列表（新增非内容文件都要加，参考 `AGENTS.md`/`ARCHITECTURE.md` 的处理） |

---

## 6. 搜索的工作方式（和它的坑）

```
顶栏输入(_includes/topbar.html#search-input)
  → assets/js/vendor/simple-jekyll-search.min.js   ← 本地补丁版！
  → 拉取 assets/js/data/search.json                 ← Jekyll 遍历文章生成
  → _includes/search-loader.html                    ← 过滤 + buildSnippet() 关键词上下文高亮
  → _includes/search-results.html                   ← 渲染结果列表
```

- 库路径由 `_data/origin/cors.yml`（CDN）/ `basic.yml`（自托管）指定。
- ⚠️ 这个库是**本地修补过字面量（短语）匹配**的 v1.10.0：上游 CDN 版会把查询拆成单词、产生假命中。
  **不要**从 npm/CDN"升级"它，bug 在上游依然存在。改动会破坏搜索。
- 需要换搜索行为时，改 `search-loader.html` 的 `buildSnippet()`，别动 vendor 文件。

---

## 7. 改完之后：验证与发布

```sh
bash tools/run.sh          # 本地预览 http://127.0.0.1（改内容时开这个最直观）
npm test                   # 仅 lint：eslint(_javascript) + stylelint(_sass)
bash tools/test.sh         # CI 同款：生产构建 + HTML-Proofer 链接检查   ← 推送前必跑
# 若改了 _javascript/ 或增删 Bootstrap 类：
npm run build && git add assets/js/dist _sass/vendors   # 产物必须进 git
```

发布：提交 → push `master` → `.github/workflows/pages-deploy.yml` 自动构建并部署。
提交信息必须是 **Conventional Commits**（`fix(ui): …`），husky 的 commitlint 会拦截其它格式。

---

## 8. 踩坑清单（历史踩过的坑）

1. **`.html` 文件不解析 Markdown** —— Jekyll 只对 `.md/.markdown` 做 Markdown 转换。
   `index.html` 曾因写的是 Markdown 语法导致正文原样显示 `## 标题`、`{: .prompt-info }`，
   已改为 `index.md`。**内容页一律用 `.md`**。
2. **JS/CSS 产物是提交进 git 的**（因为 CI 只跑 `bundle exec jekyll b`，不跑 npm）。
   只改 `_javascript/` 不跑 `npm run build`，改动会静默不生效。
3. **分页已停用**：jekyll-paginate v1 只认根目录 `index.html` 作分页模板，而根页面现在是
   `index.md`（关于我），文章列表在 `/posts/`。`_config.yml` 里 `paginate` 已注释掉；
   `_layouts/home.html` 会走"无 paginator"分支列出全部文章。
4. **`assets/js/vendor/simple-jekyll-search.min.js` 是补丁版，勿升级**（§6）。
5. **新文件必须 `git add`**：gemspec 只打包 `git ls-files` 的输出，漏 add 会导致文件不进包。
6. **permalink `/posts/:title/` 不能改**，否则所有历史文章链接 404。
7. **`_plugins/posts-lastmod-hook.rb`** 依赖完整 git 历史（CI 用 `fetch-depth: 0`），浅克隆里失效。
8. **`assets/lib` 是 submodule**（chirpy-static-assets），仅 `assets.self_host.enabled: true` 时用到；
   当前走 CDN，不要随手 `git submodule update` 或开启 self_host（CI 没 checkout submodule）。
9. **根目录新增非内容文件**（脚本、文档）要加进 `_config.yml` 的 `exclude:`，否则会被原样发布出去。
