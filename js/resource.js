/**
 * Created by sx01 on 2017-10-30.
 */
var resourceHelper = {
    //加载图片
    imageLoader:function (src,callback) {
        var image = new Image;
        image.addEventListener('load',callback);
        image.addEventListener('error',function () {
            console.log('this is a error');
        });
        image.src = src;
        return image;
    },
    //根据资源名称返回资源
    getImage:function (imageName) {
        //通过键获取值
        return this.resources.images[imageName];
    },
    //资源加载
    load:function (resources,callback) {
        var images = resources.images;
        var sounds = resources.sounds;
        var total = images.length;
        var finish = 0;//击败敌机个数
        this.resources={
            images:{},
            sounds:{}
        };
        var self = this;

        //遍历加载资源文件
        for (var i=0;i<images.length;i++){
            var name = images[i].name;
            var src = images[i].src;
            self.resources.images[name] = self.imageLoader(src,function () {
                finish++;
                if(finish == total){
                    callback(self.resources);
                }
            });
        }
    }
}