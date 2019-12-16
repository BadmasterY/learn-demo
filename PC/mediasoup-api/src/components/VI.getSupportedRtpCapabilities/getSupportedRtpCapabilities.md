## mediasoup.getSupportedRtpCapabilities()

返回 `mediasoup` 支持的 `RTP` 功能的克隆副本，特别是 [mediasoup/src/supportedRtpCapabilities.ts](https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts) 文件的内容。 

> @returns RtpCapabilities

```js
const rtpCapabilities = mediasoup.getSupportedRtpCapabilities();

console.log(rtpCapabilities);
// => { codecs: [...], headerExtensions: [...] }
```

**注意**: 这些不是 `mediasoup-client` 的`device.load()` 方法和 `libmediasoupclient` 的`device.Load()` 方法所需的 `RTP` 功能。在那里，必须改用 `router.rtpCapabilities getter` 来替代。

### 更新时间: 2019-12-16 16:06:08