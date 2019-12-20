## AudioLevelObserver
> @ inherits RtpObserver

`AudioLevelObserver` 所选 `audio producers` 的音量。它只处理 `audio producers`（如果用 `vedio producers` 调用 `addProducer()`，它将失败）。

### 1. 辞典
#### 1). AudioLevelObserverOptions
Field | Type | Description | Required | Default
--|--|--|--|--
maxEntries | Number | `volumes` 事件中的最大条目数。 | No | 1
threshold | Number | `volumes` 事件中条目的最小平均音量(从 -270 到 0 的`dBvo` 值)。 | No | -80
interval | Number | 用于检查音频音量的时间间隔 `ms`。 | No | 1000
appData | Object | 自定义应用程序数据。 | No | {}

#### 2). AudioLevelObserverVolume
Field | Type | Description | Required | Default
--|--|--|--|--
producer | Producer | `audio producer` 实例。 | Yes | -
volume | Numer | 最后一个间隔中 `audio producer` 的平均音量(从 -127 到 0 的 `dBvo` 值)。 | Yes | -

### 2. 属性
另请参见 `RtpObserver` 属性。

### 3. 方法
另请参见 `RtpObserver` 方法。

### 4. 事件 Events
另请参见 `RtpObserver` 事件。

#### 1). audioLevelObserver.on('volumes', fn(volumes))
最多每 `interval` `ms` 发出一次。

Argument | Type | Description
--|--|--
volumes | Array<AudioLevelObserverVolume> | 按音频音量顺序排 `volume`（音量越大越靠前）。

#### 2). audioLevelObserver.on('silence')
当此 `rtpObserver` 中没有任何一个 `producer` 正在生成的音量超过给定的阈值的音频发出。

### 5. Observer Events
另请参见 `RtpObserver` 的 `Observer Events`。

#### 1). audioLevelObserver.observer.on('volumes', fn(volumes))
与 `audioLevelObserver.on('volumes', fn(volumes))` 事件相同。

#### 2). audioLevelObserver.observer.on('silence')
与 `audioLevelObserver.on('silence')` 事件相同。

### 更新时间: 2019-12-20 15:06:44