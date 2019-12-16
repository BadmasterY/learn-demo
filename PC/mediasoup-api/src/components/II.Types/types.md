## mediasoup.types

一个对象，其中包含由 `mediasoup` 导出的所有类和 `TypeScript` 类型。

> @type Object readonly

```js
import { types as mediasoupTypes } from "mediasoup";

let worker: mediasoupTypes.Worker;
let rtpParameters: mediasoupTypes.RtpParameters;

// or alternatively:

import { Worker, RtpParameters } from "mediasoup/lib/types";

let worker: Worker;
let rtpParameters: RtpParameters;

```

### 更新时间: 2019-12-16 15:25:34