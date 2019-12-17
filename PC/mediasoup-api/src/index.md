# 学习 Mediasoup

> 使用 mediasoup v3.x 版本，截止至翻译日期版本为 3.4.3

**不支持**商业用途，仅供学习。

由于国内相关文档太少，同时官网也没有中文支持，也没有一个很友好的 `demo`。所以决定自己翻译一篇用于学习。

## mediasoup 介绍

[mediasoup 官网](https://mediasoup.org/)

[mediasoup API 3.x](https://mediasoup.org/documentation/v3/mediasoup/api)

### 概述

`mediasoup` 是 `SFU` 模式的媒体服务器。`SFU`  (*Selective Forwarding Unit*) 模式是从房间中的每个参与者接收音频和视频流，并将其转发给其他人(终端发送一个并接收很多)。与 `mixer` 或 `MCU` (*Multipoint Control Unit*) 相比，这种设计有更好的性能，更高的吞吐量和更少的延迟。 它具有高度的可扩展性，因为它不会转码或混合媒体，所以需要更少的资源。

由于终端分别获取其他参与者的媒体，所以他们可以有一个个性化的布局，并能选择要渲染的流显示。

> 有关SFU体系结构的详细信息可以在RFC 7667 "RTP拓扑" 部分 [3.7](https://link.zhihu.com/?target=https%3A//tools.ietf.org/html/rfc7667%23section-3.7) 中找到。

### 设计目标
- 成为 `WebRTC SFU`（Selective Forwarding Unit）。
- 支持 `WebRTC` 和普通 `RTP` 输入和输出。
- 在服务器端成为 `Node.js` 模块。
- 在客户端成为小型 `JavaScript` 和 `C++` 库。
- 极简主义：只处理媒体层。
- 与信号无关：不要强制使用任何信号协议。
- 是超低级的 `API`。
- 支持所有现有的 `WebRTC` 端点。
- 启用与知名多媒体库/工具的集成。

### 更新时间: 2019-12-16 15:05:31