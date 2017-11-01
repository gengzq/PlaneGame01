/**
 * Created by sx01 on 2017-10-30.
 */
/**
 * 子类 Plane 飞机
 * 1、继承 Element
 * 2、依赖 Bullet
 */
var Plane = function (opts) {
    var opts = opts || {};
    // 继承父类属性
    Element.call(this, opts);
    // 特有属性
    this.status = 'normal';
    this.icon = opts.icon;
    this.bullets = [];
    this.bulletSize = opts.bulletSize;
    this.bulletSpeed = opts.bulletSpeed;
    this.bulletIcon = opts.bulletIcon;
    this.boomIcon = opts.boomIcon;
    this.boomCount = 0;
};

// 继承Element的方法
Plane.prototype = new Element();

Plane.prototype.hasCrash = function (target) {
    var crash = false;
    //通过判断和和四周距离，以及飞机的距离
    if (!(this.x + this.width < target.x) &&
        !(target.x + target.width < this.x) &&
        !(this.y + this.height < target.y) &&
        !(target.y + target.height < this.y)) {
        // 物体碰撞后置为true
        crash = true;
    }
    return crash;
}

//判断是否击中敌机，击中后销毁子弹
Plane.prototype.hasHit = function(target) {
    var bullets = this.bullets;
    var hasHit = false;
    for (var j = bullets.length - 1; j >= 0; j--) {
        // 击中目标
        if (bullets[j].hasCrash(target)){
            this.bullets.splice(j, 1);
            hasHit = true;
            break;
        }
    }
    return hasHit;
};
//移动飞机，更新飞机位置
Plane.prototype.setPosition = function(newPlaneX, newPlaneY) {
    this.x = newPlaneX;
    this.y = newPlaneY;
    return this;
};

//发射子弹，确定子弹发射速度
Plane.prototype.startShoot = function() {
    var self = this;
    var bulletWidth = this.bulletSize.width;
    var bulletHeight = this.bulletSize.height;
    // 定时发射子弹
    this.shootingInterval = setInterval(function() {
        // 创建子弹,子弹位置是居中射出
        var bulletX = self.x + self.width / 2 - bulletWidth / 2;
        var bulletY = self.y - bulletHeight;
        // 每200ms发射一个子弹
        self.bullets.push(new Bullet({
            x: bulletX,
            y: bulletY,
            width: bulletWidth,
            height: bulletHeight,
            speed: self.bulletSpeed,
            icon: self.bulletIcon,
        }));
    }, 200);
};
//绘制子弹
Plane.prototype.drawBullets = function() {
    var bullets = this.bullets;
    var len = bullets.length;
    while (len--) {
        var bullet = bullets[len];
        // 会飞的子弹
        bullet.fly();
        //判断是否超出屏幕
        if (bullet.y <= 0) {
            bullets.splice(len, 1);
        } else {
            bullet.draw();
        }
    }
};
//飞机爆炸
Plane.prototype.booming = function() {
    this.status = 'booming';
    this.boomCount += 1;
    if (this.boomCount > 10) {
        this.status = 'boomed';
        clearInterval(this.shooting);
    }
    return this;
}
//重写父类方法
Plane.prototype.draw = function() {
    switch(this.status) {
        case 'booming':
            context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height);
            break;
        default:
            context.drawImage(this.icon, this.x, this.y, this.width, this.height);
            break;
    }
    // 绘制子弹
    this.drawBullets();
    return this;
};
