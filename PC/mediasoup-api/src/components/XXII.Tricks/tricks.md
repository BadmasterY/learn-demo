## Tricks
这理有一些 `mediasoup` 的使用技巧。

### 1. RTP 功能过滤
相关问题:
- 在 `Firefox` 和 `FFmpeg` 中接收视频方向错误。

`mediasoup` 中的 `router.rtpCapabilities` 表示 `router` 支持的 `RTP` 功能。尽管 `codecs` 列表取决于 `router` 创建过程中给出的 `RouterOptions`，但其他 `RTP` 功能（例如 `headerExtensions`）是固定的，并且基本上是 `mediasoup` 中 `headerExtensions` 的`supportedRtpCapabilities.ts` 文件中的副本。

例如，其中一些 `RTP` 标头扩展会影响客户端的行为。一个很好的例子是 `"urn：3gpp：video-orientation"` 扩展名，如果客户端和 `mediasoup` 都支持，它将使客户端不旋转其发送视频（例如，将手机从纵向移动到横向时），但是，而是将方向值设置为 `RTP` 标头扩展。`Chrome` 和任何基于 `libwebrtc` 的端点（例如 `libmediasoupclient`）都支持此功能。

这样做的问题是，如果接收方 `consumer`（例如，今天的 `Firefox` 或 `FFmpeg`）不支持这种 `RTP` 标头扩展名，则当发送方旋转其视频时，接收方将无法实现它，并将使用方向为 `90º` 或 `-90º`。为了避免出现此问题，请注意以下技巧：

在发送方（假设它支持 `"urn：3gpp：video-orientation"` 扩展名），应用程序可以使用以下命令调用 `device.load()`（`mediasoup-client`，即 `Chrome`）或 `device.load()`（`libmediasoupclient`）。通过删除有问题的标头来过滤 `router` 的 `RTP` 功能的版本。例如，在 `Chrome` 中运行 `mediasoup-client` 时，它将如下所示：

```js
// 让我们通过我们自己的应用程序信令获得 router 的 RTP 功能。
let routerRtpCapabilities = await mySignaling.request("getRouterRtpCapabilities");

// 仅适用于Chrome、Safari或任何基于libwebrtc的浏览器。
if (supportsVideoOrientationHeaderExtension)
{
  // 移除 "urn:3gpp:video orientation" 扩展
  // 这样当旋转设备时，Chrome 将对旋转的视频进行编码
  // 而不是在 RTP 头扩展中指示视频方向
  routerRtpCapabilities.headerExtensions = routerRtpCapabilities.headerExtensions.
    filter((ext) => ext.uri !== 'urn:3gpp:video-orientation');
}

// 最后将 router 的 RTP 功能应用到设备上。
await device.load({ routerRtpCapabilities });
```

### 更新时间: 2019-12-23 13:27:50