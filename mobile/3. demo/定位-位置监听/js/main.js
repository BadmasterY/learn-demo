window.addEventListener('load', e => {
    let timer;

    let btnStart = document.getElementById('btnStart');
    let btnEnd = document.getElementById('btnEnd');

    btnStart.addEventListener('click', start, false);
    btnEnd.addEventListener('click', stop, false);

    let control = document.getElementById('control');
    let map = new AMap.Map('map', {
        resizeEnable: true,
        center: [116.397428, 39.90923], // 地图中心点
        zoom: 13, // 默认缩放等级
        viewMode: '3D'
    });

    map.plugin(['AMap.ToolBar'], function () {
        map.addControl(new AMap.ToolBar());
    });

    let options = {
        enableHighAccuracy: true, // 开启高精度(GPS)定位
        timeout: 30000, // 设置接口超时时间为30s
        maximumAge: 1000, // 设置物理信息的最大缓存时间为1s
    };

    // 获取定位信息
    getPosition(coords => {
        coords = convert(coords.longitude, coords.latitude); // 转换地理坐标
        // 根据当前位置信息设置初始点
        let startPoint = new AMap.LngLat(coords.longitude, coords.latitude);
        //简写
        // let startPoint = [coords.longitude, coords.latitude];
        control.innerText += coords.longitude + ' == ' + coords.latitude;
        map.setCenter(startPoint); // 将当前位置设置为中心点
        map.setZoom(16); // 设置缩放

    });

    // 设置实时路况
    // let trafficLayer = new AMap.TileLayer.Traffic({
    //     zIndex: 10
    // });

    // trafficLayer.setMap(map);

    // map.add(trafficLayer);

    function getPosition(callback) {
        if (!navigator.geolocation) throw new Error('不支持！');

        // 获取定位
        navigator.geolocation.getCurrentPosition(position => {
            callback(position.coords);
        }, error => {
            switch (error.code) {
                case 1:
                    control.innerText += `用户拒绝获取位置信息`;
                    break;
                case 2:
                    control.innerText += `浏览器无法获取位置信息`;
                    break;
                case 3:
                    control.innerText += `获取位置信息超时`;
                    break;
                default:
                    control.innerText += `尝试获取位置信息时发生错误: ${error.message}`;
                    break;
            }
        }, options);
    }

    // 坐标转换
    function convert(longitude, latitude) {
        if (coordtransform && coordtransform.wgs84togcj02) {
            var coords = coordtransform.wgs84togcj02(longitude, latitude);
            return {
                longitude: coords[0],
                latitude: coords[1]
            }
        }
        return { longitude: longitude, latitude: latitude };
    }

    // 开始监听 watchPosition
    function start() {
        timer = navigator.geolocation.watchPosition(position => {
            let coords = position.coords;
            if(coords.accuracy > 20) return; // 丢弃低精度定位
            coords = convert(coords.longitude, coords.latitude);
            // 修改中心点位置信息
            map.setCenter(new AMap.LngLat(coords.longitude, coords.latitude));
        }, error => {
            control.innerText += error;
        }, options);
    }

    // 停止监听 clearWatch
    function stop() {
        navigator.geolocation.clearWatch(timmer);
    }


}, false);