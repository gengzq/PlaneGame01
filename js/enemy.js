/**
 * Created by sx01 on 2017-10-30.
 */
var Enemy = function (opts) {
    var opts = opts || {};
    //继承父类方法
    Element.call(this,opts);
    //设置特有属性
    this.status = 'normal';
    this.icon = opts.icon;
    this.live = opts.live;
    this.type = opts.type;
    this.boomIcon = opts.boomIcon;
    this.boomCount = 0;
};
Enemy.prototype = new Element();
Enemy.prototype.down = function () {
    this.move(0,this.speed)
};
Enemy.prototype.booming = function() {
    // 设置状态为 booming
    this.status = 'booming';
    this.boomCount += 1;
    // 击落6次敌机及胜利
    if (this.boomCount > 6) {
        this.status = 'boomed';
    }
}
Enemy.prototype.draw = function () {
    // 绘制敌机状态
    switch(this.status) {
        case 'normal':
            context.drawImage(this.icon, this.x, this.y, this.width, this.height);
            // context.fillRect(this.x, this.y, this.width, this.height);
            break;
        case 'booming':
            context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height);
            break;
    }
};
