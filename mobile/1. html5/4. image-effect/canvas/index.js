// 饼状图构造函数
var PieChart = function(selector, options) {
    var canvas = (typeof selector === 'string') ? document.querySelector(selector) : null;
    if(!canvas) throw new Error('canvas not found.');

    var defaultOptions = {
        radius: 200, // 饼图半径
        legendParms: { // 图例参数
            font: '24px Arial', // 字体
            x: 30, // 图例 x 轴左边
            y: 30, // 图例 y 轴左边
            margin: 50, // // 图例间距
            width: 40, // 图例宽度
            height: 24, // 图例高度
        },
    };

    // 获取 context 环境
    this.context = canvas.getContext('2d');
    this.width = canvas.getAttribute('width') || 300;
    this.height = canvas.getAttribute('height') || 300;
    this.options = Object.assign(defaultOptions, options);
}

Object.assign(PieChart.prototype, {
    // 载入饼状图需要的数据
    load(data) {
        var _this = this;
        data.forEach(function(item){
            _this.count ? _this.count += item.value : _this.count = item.value;
        });
        _this.data = data;
        return _this;
    },

    // 饼状图渲染
    render() {
        var _this = this;
        // 绘制图例
        var _generateLegend = function(item, index) {
            // 图标绘制
            _this.context.fillRect(
                _this.options.legendParms.x,
                _this.options.legendParms.y + index * _this.options.legendParms.margin,
                _this.options.legendParms.width,
                _this.options.legendParms.height
            );
            
            // 文字绘制
            _this.context.font = _this.options.legendParms.font;
            _this.context.fillText(
                item.title,
                _this.options.legendParms.y + _this.options.legendParms.margin,
                (index + 1) * _this.options.legendParms.margin
            );
        };

        var temparc = 0;
        _this.data.forEach(function(item, index){
            item.color = `#${('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)}`;
            _this.context.beginPath();
            _this.context.moveTo(_this.width / 2, _this.height / 2);

            var startarc = temparc,
                endarc = startarc + (item.value / _this.count) * Math.PI * 2;
            
            // 绘制饼状图
            _this.context.arc(
                _this.width / 2, // 圆点中心 x 坐标
                _this.height / 2, // 圆点中心 y 坐标
                _this.options.radius, // 饼状图半径
                startarc, // 开始角度
                endarc, // 结束角度
                false, // 逆时针
            );

            _this.context.closePath();

            _this.context.fillStyle = item.color;
            _this.context.fill(); // 填充路径
            
            temparc = endarc;
            if(_this.options.legend) {
                _generateLegend(item, index);
            }
        });

        return _this;
    },
});

var data = [
    {title: '哇哈哈', value: 1024},
    {title: '农夫山泉', value: 512},
    {title: '美之源', value: 256},
    {title: '可口可乐', value: 960},
];

var pie = new PieChart('.pie-chart', {legend: true});
pie.load(data).render();