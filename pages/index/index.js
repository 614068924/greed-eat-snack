//index.js
//获取应用实例
var startX = 0;  //他们的坐标
var startY = 0;
var moveX = 0;
var moveY =0;
var shift = true
//窗口的宽高
  var windowWidth = 0;
  var windowHeight = 0;
//开始位置和最后位置的差值
var X =  0;
var Y =  0;
//蛇头的坐标
var snakeHead = {
  x:0,
  y:0,
  w:20,
  h:20,
  color:"#ff0000"
}
//身体的对象  
var snakeBodys = [
];
var  foods =  [];
var direction = null;//手指的方向
var snakeDirection = "right"  //蛇移动的方向
Page({
  canvasStart:function(e){
  startX = e.touches[0].x;
  startY = e.touches[0].y;
  },
canvasMove:function(e){
  moveX = e.touches[0].x;
  moveY = e.touches[0].y;
  X=moveX-startX;
  Y=moveY-startY;
  if (Math.abs(X) > Math.abs(Y) && X > 0)
    direction="right";
  else if (Math.abs(X) > Math.abs(Y) && X < 0)
    direction="left"
  else if (Math.abs(X) < Math.abs(Y) && Y > 0)
    direction = "bottom"
  else if (Math.abs(X) < Math.abs(Y) && Y < 0)
    direction = "top"
},
canvasEnd:function(){
snakeDirection = direction;
},


onReady:function(){

//获取画布的上下文
var context = wx.createContext();
var time = 0;//帧数
function draw(obj) {
  context.setFillStyle(obj.color);  //绘制蛇头
  context.beginPath();               //开始绘制
  context.rect(obj.x, obj.y, obj.w, obj.h)                   //绘制路径
  context.closePath();  //g关闭路径
  context.fill()    //填充
}
//碰撞函数
function collide(obj1,obj2){
  var l1 = obj1.x;
  var r1 = obj1.x+obj1.w;
  var t1 = obj1.y;
  var b1 = obj1.y+obj1.h

  var l2 = obj2.x;
  var r2 = obj2.x + obj2.w;
  var t2 = obj2.y;
  var b2 = obj2.y + obj2.h
  if(r1>l2&&l1<r2&&t1<b2&&b1>t2)
  return true;
  else
  return false;
}


function animate(){
  time++;
  if (time % 10 == 0) {
    snakeBodys.push({
      x: snakeHead.x,
      y: snakeHead.y,
      w: 20,
      h: 20,
      color: "#00ff00"
    });
    if (snakeBodys.length > 6) {
      if(shift)
          snakeBodys.shift()
          else
          shift= true
    }
    switch (snakeDirection) {
      case "right":
        snakeHead.x += snakeHead.w;
        break;
      case "left":
        snakeHead.x -= snakeHead.w;
        break;
      case "bottom":
        snakeHead.y += snakeHead.h;
        break;
      case "top":
        snakeHead.y -= snakeHead.h;
        break;
    }
    //每次像蛇的身体添加上一个一个身体对象
 
  }
 draw(snakeHead);
  //绘制身体
  for(var i =0;i<snakeBodys.length;i++){
    var snakeBody = snakeBodys[i];
    draw(snakeBody)
  }



  //绘制食物
for(var i = 0;i<foods.length;i++){
  var foodObj = foods[i];
  draw(foodObj)
  if(collide(snakeHead,foodObj)){
   shift=false;
   console.log("zsl")
   foodObj.reset();
  }
}

  wx.drawCanvas({
    canvasId:"snakeCanvas",
    actions:context.getActions()
  });

  requestAnimationFrame(animate)
}
function rand(min,max){
  return parseInt(Math.random()*(max-min))+min;
}
//构造食物对象  弄一个构造函数
  function Food() {
    this.x = rand(0,windowWidth)
    this.y = rand(0,windowHeight)
    var  wh = rand(10,20)
    this.w = wh;
    this.h = wh;
    this.color = "rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")"
    this.reset = function resetFood() {
      this.x = rand(0, windowWidth)
      this.y = rand(0, windowHeight)
      this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")"
    }
}
wx.getSystemInfo({
  success: function(res) {
    windowWidth = res.windowWidth;
    windowHeight = res.windowHeight;
//将构造函数里面的值放到foods里面
   for(var i= 0;i<20 ;i++){
   var foodObj=new Food();
   foods.push(foodObj);
   }

    animate();
  },
})


}
})
