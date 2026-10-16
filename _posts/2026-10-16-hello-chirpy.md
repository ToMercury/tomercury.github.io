---
title: 测试文章：Hello Chirpy
description: 一篇用来观察网站各功能渲染效果的测试文章，看完后可以删除。
date: 2026-10-16 12:00:00 +0800
categories: [Blog, Test]
tags: [test, chirpy, markdown]
image:
  path: /assets/img/favicons/pluse.png
  alt: 站点图标
---

> 这是一篇测试文章，用来观察：文章列表卡片、TOC、代码高亮、表格、脚注、提示框、图片、
> 分类/标签归档、脚部导航等是否正常。确认后可直接删除本文件。
{: .prompt-info }

如果你从侧栏的 **Posts** 进入这里，说明文章列表（`/posts/`）工作正常；
列表页顶部应有 `Browse: Archives · Categories · Tags` 一行链接。

## 一、Markdown 基本排版

这是一段包含**加粗**、*斜体*、~~删除线~~、`行内代码` 和
[站内链接（指向另一篇测试文章）](/posts/Test/) 的正文。
站点信息请参考[关于我](/)，或回到[文章列表](/posts/)。

> 提示（prompt-tip）样式
{: .prompt-tip }

> 注意（prompt-warning）样式
{: .prompt-warning }

> 信息（prompt-info）样式
{: .prompt-info }

## 二、代码高亮

```python
def hello(name: str) -> str:
    """打个招呼"""
    return f"Hello, {name}!"

print(hello("Chirpy"))
```

```yaml
# _config.yml 关键配置
lang: en          # 界面语言为英文
timezone: Asia/Shanghai
permalink: /posts/:title/
```

## 三、表格

| 功能 | 负责文件 | 观察点 |
|:---|:---|:---:|
| 文章列表 | `_tabs/posts.md` | 列表卡片 + 顶部 Browse 链接 |
| 年份归档 | `archives.html` | 按年分组列出所有文章 |
| 分类索引 | `categories.html` | 不进侧栏，可从本文进入 |
| 标签索引 | `tags.html` | 同上 |

## 四、列表

1. 有序列表项
2. 第二项
   - 嵌套的无序项

- [ ] 未完成任务
- [x] 已完成任务

## 五、其他

脚注的用法见这里[^1]，键盘按键样式 <kbd>Ctrl</kbd> + <kbd>C</kbd>。
点击右下角 **Back to Top**、左下角主题切换，或使用顶栏搜索试试
（搜索 `chirpy` 应能命中本文）。

---

[^1]: 这是脚注正文。点击上标可跳回原文位置。
