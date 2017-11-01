/**
 * Created by sx01 on 2017-10-30.
 */
/**
 * parent Object
 */
var Element =function (opts) {
    var opts = opts || {};
    //设置左边和尺寸
    this.x = opts.x;
    this.y = opts.y;
    this.width = opts.width;
    this.height = opts.height;
    this.speed = opts.speed;
};
//子弹原型
Element.prototype = {
    move:function (x,y) {
        var addX = x || 0;
        var addY = y || 0;
        this.x += x;
        this.y += y;
    },
    //each one have this function
    draw:function () { }
};