#### H5 视频播放
video + webVTT

##### video
Video元素事件:

事件名 | 功能  
-|-
abort | 当指定的音频/视频(audio/video)加载被异常终止时产生该事件
canplay | 当浏览器可以开发播放指定的音频/视频(audio/video)时产生该事件
canplaythrough | 当浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频(audio/video)时产生该事件
durationchange | 当指定的音频/视频(audio/video)的时长数据发生变化时产生该事件
emptied | 当播放列表为空时产生该事件
ended | 当前播放列表结束时产生该事件
error | 当加载指定的音频/视频(audio/video)错误时产生该事件
loadeddata | 当当前帧的数据已加载，但没有足够的数据来播放指定音频/视频(audio/video)的下一帧时产生该事件
loadedmetadata | 当指定的音频/视频(audio/video)的元数据已加载时产生该事件,音频/视频(audio/video)的元数据包括: 时长、尺寸（仅视频）以及文本轨道
loadstart | 当浏览器开始寻找指定的音频/视频(audio/video)时产生该事件,即当加载过程开始时
pause | 当指定的音频/视频(audio/video)暂停时产生该事件
play | 当指定的音频/视频(audio/video)播放时产生该事件
playing | 当指定的音频/视频(audio/video)因缓冲而暂停或停止后恢复到播放时产生该事件
progress | 当浏览器正在下载指定的音频/视频(audio/video)时产生该事件
ratechange | 当指定的音频/视频(audio/video)播放速度发生改变时产生该事件
seeked | 当用户已移动/跳跃到指定的音频/视频(audio/video)新的位置时产生该事件
seeking | 当用户开始移动/跳跃到指定的音频/视频(audio/video)新的位置时产生该事件
stalled | 当浏览器尝试获取指定的音频/视频(audio/video)数据,但数据不可用时产生该事件
suspend | 当浏览器刻意不加载指定的音频/视频(audio/video)数据时产生该事件
timeupdate | 当指定的音频/视频(audio/video)播放位置发生改变时产生该事件
volumechange | 当指定的音频/视频(audio/video)音量发生改变时产生该事件
wiating | 当指定的音频/视频(audio/video)由于需要缓冲下一帧而停止时产生该事件

###### 当音频/视频(audio/video)处于加载过程中时，会依次发生以下事件:
- loadstart
- durationchange
- loadedmetadata
- loadeddata
- progress
- canplay
- canplaythrough

##### webVTT(Web Video Text Tracks)
网络视频文本轨道

示例:
```webVTT
WEBVTT

Cue-1
00:00:01.000 --> 00:00:05.000
这里设置了1-5秒的字幕

Cue-2
00:00:06.000 --> 00:00:10.000
这里是6-10秒的字幕
```

Cue-id 命名随意,但必须唯一
Cue的语法格式:
```
[idstring]
[hh:]mm:ss:msmsms --> [hh:]mm:ss:msmsms
Text String
```
