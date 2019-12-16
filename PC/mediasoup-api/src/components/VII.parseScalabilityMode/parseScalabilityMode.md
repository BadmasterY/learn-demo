## mediasoup.parseScalabilityMode(scalabilityMode)

`scalabilityMode` 根据 [webrtc-svc](https://w3c.github.io/webrtc-svc/) 中的规则解析给定的字符串。 

参数 | 类型 | 描述 | 必需 | 默认值
-- | -- | -- | -- | --
scalabilityMode | String | 可伸缩性模式。 | No | -	 

> @returns ScalabilityMode:
> - spatialLayers {@type Number} 空间层数 (默认 1)。
> - temporalLayers {@type Number} 临时层数 (默认 1)。

```js
mediasoup.parseScalabilityMode("L2T3");
// => { spatialLayers: 2, temporalLayers: 3 }

mediasoup.parseScalabilityMode("S3T3");
// => { spatialLayers: 3, temporalLayers: 3 }

mediasoup.parseScalabilityMode("L4T7_KEY_SHIFT");
// => { spatialLayers: 4, temporalLayers: 7 }

mediasoup.parseScalabilityMode(undefined);
// => { spatialLayers: 1, temporalLayers: 1 }
```

### 更新时间: 2019-12-16 16:19:26