---
title: Sniptool 截屏与剪贴板工具
description: 专为 Linux (Debian / X11 / Xfce) 桌面深度定制的轻量级、高性能截图与剪贴板增强工具。
date: 2026-11-20 00:00:00 +0800
category: 开源工具
category_slug: tools
type: tool
icon: fas fa-crop-alt
github: https://github.com/ToMercury/sniptool
order: 2
tags: [Python, Qt, Linux, 截图工具, 剪贴板]
---

> 本项目为基于 AI Agent 协同开发的轻量级 Linux 桌面辅助工具，按需定制核心功能，总耗时约 1 天。
{: .prompt-tip }

## 一、项目背景

0. 前不久和 Win 小弟彻底说了拜拜，全面拥抱 Linux（Ubuntu、Fedora、Debian）
1. 无论在 Windows 还是 Linux，我从来没有遇到过特别顺手，特别合我胃口的截图小工具
2. 市面上大部分截图工具，功能特别冗余复杂，80% 的功能我从未用过
3. Windows PixPin 还不错，但是功能同样冗余，而且没有 Linux 版本
4. 大部分这些截图工具，想要使用高级功能（如OCR、翻译），需要开会员
5. 我的使用频率不高，而且个人开发者，开会员之后有擅自修改权益或跑路风险
6. Windows 剪贴板特别合我胃口，但是在 Linux 没有找到平替
7. AI Agent 时代，这些个性化小工具，自己写很方便
8. Linux 操作系统深度适配 AI Agent，开发、调试、打包非常方便
9. 最重要的是，我的某个 Agent 优惠券快过期了，不能浪费

## 二、项目概述

**Sniptool** 是一款专为 Linux 桌面环境深度定制的轻量级、高性能截图与剪贴板增强工具。界面优雅圆角、启动敏捷流畅、原生适配多屏与高分屏，提供开箱即用的现代化桌面体验。

- **核心语言与技术栈**：Python 3.10+ / PySide6 (Qt 6) / python-xlib / Tesseract OCR
- **运行环境**：Debian 13、Xfce 4.20、X11 桌面环境
- **开源地址**：[GitHub - ToMercury/sniptool](https://github.com/ToMercury/sniptool)

## 三、核心特性与亮点

1. **流畅截屏与丰富标注**：毫秒级全屏冻结遮罩，支持矩形、箭头、直线、画笔与文本标注；支持 1px 像素级微调选区，支持标注对象的撤销与重做。
2. **离线 OCR 与智能翻译**：集成 Tesseract OCR，一键对选区文字进行提取并复制；支持调用 DeepSeek AI 智能翻译选区文字。
3. **贴图功能 (Pin)**：截屏一键置顶钉在桌面上，支持等比例滚轮缩放、右键另存与快速关闭，便于多任务对比参考。
4. **剪贴板历史面板**：全局快捷键呼出，记录历史文本与图片，支持搜索、收藏星标、光标保持与一键粘贴回原活动窗口。
5. **常驻后台守护**：提供轻量守护进程，不占用终端，快捷响应全局热键。

## 四、快捷键速查

| 场景 | 快捷键 / 交互 | 功能说明 |
| :--- | :--- | :--- |
| **全局** | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd> | 唤起截屏遮罩 |
| | <kbd>Super</kbd> + <kbd>V</kbd> | 唤起剪贴板历史面板 |
| **截屏遮罩** | 鼠标左键拖拽 | 框选截屏区域 |
| | <kbd>Enter</kbd> / <kbd>Ctrl</kbd> + <kbd>S</kbd> | 保存截图到指定目录并关闭 |
| | <kbd>Ctrl</kbd> + <kbd>C</kbd> | 复制截图至剪贴板并关闭 |
| | <kbd>Shift</kbd> + <kbd>C</kbd> | 对选区执行 OCR 文字识别并自动复制 |
| | <kbd>Ctrl</kbd> + <kbd>T</kbd> | 对选区文字执行 DeepSeek 智能翻译 |
| | <kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>Ctrl</kbd> + <kbd>Y</kbd> | 撤销 / 重做上一步标注操作 |
| **贴图 (Pin)** | 双击图片 / <kbd>Esc</kbd> | 关闭贴图窗口并释放资源 |
| | 鼠标滚轮 / 拖拽边框 | 等比例放大/缩小贴图 |
| **剪贴板面板** | <kbd>↑</kbd> / <kbd>↓</kbd> | 浏览切换历史项目 |
| | <kbd>Space</kbd> | 对当前记录切换收藏状态 |
| | 双击 / <kbd>Enter</kbd> | 复制并立即粘贴回原活动窗口 |

## 五、快速上手

```bash
# 1. 启动常驻后台服务（自动脱离终端在后台运行）
./sniptool daemon

# 2. 命令行快速调出对应功能
./sniptool capture      # 立即触发截图
./sniptool clipboard    # 呼出剪贴板历史面板
./sniptool settings     # 打开设置中心

# 3. 退出后台服务
./sniptool quit
```
