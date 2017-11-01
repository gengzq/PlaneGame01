/**
 * Created by sx01 on 2017-10-30.
 */
//子弹的基本属性
var Bullet = function (opts) {
    var  opts = opts || {};
    Element.call(this,opts);
    this.icon = opts.icon;
};
Bullet.prototype = new Element();
Bullet.prototype.fly = function () {
    this.move(0,-this.speed);
    return this;
}
//碰撞后就消失
Bullet.prototype.hasCrash = function (target) {
    var crash = false;
    //通过判断和四周距离，以及飞机的距离
    if (!(this.x + this.width < target.x) &&
        !(target.x + target.width < this.x) &&
        !(this.y + this.height < target.y) &&
        !(target.y + target.height < this.y)) {
        // 物体碰撞后置为true
        crash = true;
    }
    return crash;
}

Bullet.prototype.draw = function() {
    //画子弹
    context.drawImage(this.icon, this.x, this.y, this.width, this.height);
    return this;
};