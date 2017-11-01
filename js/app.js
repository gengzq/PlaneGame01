/**
 * Created by sx01 on 2017-10-26.
 */


var $body = $(document.body);
//画布相关
var $canvas = $('#game');
var canvas = $canvas.get(0);
var context = canvas.getContext('2d');
//设置画布
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;

//判断是否有requestAnimationFrame，处理浏览器兼容问题
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 30);
    };

//事件绑定
function  bindEvent() {
    var self = this;
    //点击开始按钮
    $body.on('click','.js-start',function () {
        $body.attr('data-status','start');
        //开始游戏
        Game.start();
    });
    //点击说明按钮
    $body.on('click','.js-explain',function () {
        $body.attr('data-status','explain');
    });
    //点击设置按钮
    $body.on('click','.js-setting',function () {
        $body.attr('data-status','setting');
    });
    //点击确认设置按钮
    $body.on('click','.js-confirm-setting',function () {
        $body.attr('data-status','index');
    });
    //点击朕知道了按钮
    $body.on('click','.js-confirm-explain',function () {
        $body.attr('data-status','index');
    });
}

/*创建游戏对象*/
var Game = {
    //游戏初始化方法
    init:function (opts) {
        var opts = Object.assign({},opts,CONFIG)
        this.opts = opts;

        //计算飞机对象最大横坐标
        this.planePosX = canvasWidth/2 - opts.planeSize.width/2;
        this.planePosY = canvasHeight - opts.planeSize.height - 50;
    },
    //游戏开始
    start:function () {
        
	var self = this;
        var opts = this.opts;
        var images = this.images;
        //初始化数据，敌机数量为0，分数为0
        this.enemys = [];
        this.score = 0;

        //随机生成大小敌机
        this.createSmallEnemyInterval = setInterval(function () {
            self.createEnemy('normal');
        },500);
        this.createBigEnemyInterval = setInterval(function () {
            self.createEnemy('big');
        },1500);
        // 生成我的战机
        this.plane = new Plane({
            x: this.planePosX,
            y: this.planePosY,
            width: opts.planeSize.width,
            height: opts.planeSize.height,
            // 子弹尺寸速度
            bulletSize: opts.bulletSize,
            bulletSpeed: opts.bulletSpeed,
            // 图标相关
            icon: resourceHelper.getImage('bluePlaneIcon'),
            bulletIcon: resourceHelper.getImage('fireIcon'),
            boomIcon: resourceHelper.getImage('enemyBigBoomIcon')
        });
        // 飞机开始射击
       this.plane.startShoot();
       
       this.update();
    },
    //更新
    update:function () {
        var self = this;
        var opts = this.opts;
this.updateElement();
        //清理画布
        context.clearRect(0,0,canvasWidth,canvasHeight);
        

        if (this.plane.status === 'boomed') {
            this.end();
            return;
        }
	this.draw();
        //设置一个循环，做成动画效果
        requestAnimFrame(function () {
            self.update();
        });
    },
    //更新所有元素为初始状态
    updateElement: function() {
        var opts = this.opts;
        var enemySize = opts.enemySize;
        var enemys = this.enemys;
        var plane = this.plane;
        var len = enemys.length;
        if (plane.status === 'booming') {
            plane.booming();
            return;
        }
        //循环更新元素
        while (len--){
            var enemy = enemys[len];
            enemy.down();
            if(enemy.y >= canvasHeight){
                this.enemys.splice(len,1);
            }else{
                //判断飞机状态
                if (plane.status === 'normal') {
                    if (plane.hasCrash(enemy)) {
                        plane.booming();
                    }
                }
                // 根据敌机状态判断是否被击中
                switch(enemy.status) {
                    case 'normal':
                        if (plane.hasHit(enemy)) {
                            enemy.live -= 1;
                            if (enemy.live === 0) {
                                enemy.booming();
                            }
                        }
                        break;
                    case 'booming':
                        enemy.booming();
                        break;
                    case 'boomed':
                        enemys.splice(len, 1);
                        break;
                }
            }
        }
    },
    /**
     * 绑定手指触摸
     */
    bindTouchAction: function () {
        var opts = this.opts;
        var self = this;
        // 飞机极限横坐标、纵坐标
        var planeMinX = 0;
        var planeMinY = 0;
        var planeMaxX = canvasWidth - opts.planeSize.width;
        var planeMaxY = canvasHeight - opts.planeSize.height;
        // 手指初始位置坐标
        var startTouchX;
        var startTouchY;
        // 飞机初始位置
        var startPlaneX;
        var startPlaneY;

        // 首次触屏
        $canvas.on('touchstart', function (e) {
            var plane = self.plane;
            // 记录首次触摸位置
            startTouchX = e.touches[0].clientX;
            startTouchY = e.touches[0].clientY;
            // console.log('touchstart', startTouchX, startTouchY);
            // 记录飞机的初始位置
            startPlaneX = plane.x;
            startPlaneY = plane.y;

        });
        // 滑动屏幕
        $canvas.on('touchmove', function (e) {
            var newTouchX = e.touches[0].clientX;
            var newTouchY = e.touches[0].clientY;
            // console.log('touchmove', newTouchX, newTouchY);

            // 新的飞机坐标等于手指滑动的距离加上飞机初始位置
            var newPlaneX = startPlaneX + newTouchX - startTouchX;
            var newPlaneY = startPlaneY + newTouchY - startTouchY;
            // 判断是否超出位置
            if(newPlaneX < planeMinX){
                newPlaneX = planeMinX;
            }
            if(newPlaneX > planeMaxX){
                newPlaneX = planeMaxX;
            }
            if(newPlaneY < planeMinY){
                newPlaneY = planeMinY;
            }
            if(newPlaneY > planeMaxY){
                newPlaneY = planeMaxY;
            }
            // 更新飞机的位置
            self.plane.setPosition(newPlaneX, newPlaneY);
            // 禁止默认事件，防止滚动屏幕
            e.preventDefault();
        });
    },
    /**
     * 绑定电脑键盘
     */
    bindKeyBroadAction: function () {
    
        var opts = this.opts;
        var self = this;
        // 飞机极限横坐标、纵坐标
        var planeMinX = 0;
        var planeMinY = 0;
        var planeMaxX = canvasWidth - opts.planeSize.width;
        var planeMaxY = canvasHeight - opts.planeSize.height;

        //飞机新位置
        var newPlaneX;
        var newPlaneY;
        window.addEventListener('keydown', doKeyDown, true);

        function  doKeyDown(e) {
                console.log("检测到了键盘事件");
                var plane = self.plane;
                // 飞机初始位置
                var startPlaneX = plane.x;
                var startPlaneY = plane.y;
                 newPlaneX = startPlaneX;
                newPlaneY = startPlaneY;
                var keyID = e.keyCode ? e.keyCode :e.which;
                if(keyID === 38 || keyID === 87)  { // up arrow and W
                    newPlaneY = startPlaneY-4;
                }
                if(keyID === 39 || keyID === 68)  { // right arrow and D
                    newPlaneX = startPlaneX+4;
                }
                if(keyID === 40 || keyID === 83)  { // down arrow and S
                    newPlaneY = startPlaneY+4;
                }
                if(keyID === 37 || keyID === 65)  { // left arrow and A
                    newPlaneX = startPlaneX-4;
                }
                // 判断是否超出位置
                if(newPlaneX < planeMinX){
                    newPlaneX = planeMinX;
                }
                if(newPlaneX > planeMaxX){
                    newPlaneX = planeMaxX;
                }
                if(newPlaneY < planeMinY){
                    newPlaneY = planeMinY;
                }
                if(newPlaneY > planeMaxY){
                    newPlaneY = planeMaxY;
                }
                // 更新飞机的位置
                self.plane.setPosition(newPlaneX, newPlaneY);
                // 禁止默认事件，防止滚动屏幕
                e.preventDefault();
        }
        //键盘响应事件
    },
   //创建敌机，区分大小飞机
    createEnemy:function (enemyType) {
        //小飞机的基本属性
        var enemys = this.enemys;
        var opts = this.opts;
        var images = this.images || {};
        var enemySize = opts.enemySmallSize;
        var enemySpeed = opts.enemySpeed;
        //获取飞机的图片
        var enemyIcon = resourceHelper.getImage('enemySmallIcon');
        var enemyBoomIcon = resourceHelper.getImage('enemySmallBoomIcon');
        var enemyLive = 1;
        //大飞机的基本属性
        if(enemyType ==="big"){
            enemySize = opts.enemyBigSize;
            enemySpeed = enemySpeed * 0.6;
            enemyLive = 10; //生命值
            enemyIcon = resourceHelper.getImage('enemyBigIcon');
            enemyBoomIcon = resourceHelper.getImage('enemyBigBoomIcon');
        }
        // 初始化的战机
        var initOpt = {
            x:Math.floor(Math.random() * (canvasWidth-enemySize.width)),
            y:-enemySize.height,
            enemyType:enemyType,
            live:enemyLive,
            width:enemySize.width,
            height:enemySize.height,
            speed:enemySpeed,
            icon: enemyIcon,
	    boomIcon: enemyBoomIcon
        }
        //当屏幕上敌机数量不够是，马上生产
        if(enemys.length < opts.enemyMaxNum){
            enemys.push(new Enemy(initOpt));	
        }

    },

    //游戏结束
    end:function () {
        alert('游戏结束');
    },
    //游戏绘制
    draw:function () {
        this.enemys.forEach(function (enemy) {
            enemy.draw();
        });
        this.plane.draw();
    }
}

//页面入口
function  init() {
    //加载资源
    resourceHelper.load(CONFIG.resources,function (resources) {
   
    Game.init();
    // 绑定手指事件
    Game.bindKeyBroadAction();
    bindEvent();
 });
}
init();