// JavaScript Document
// 移动端滑动插件开发
/*
	作者：老汉推车
	时间：2016-6-15 16:33:29
	版本：1.0.2
*/
(function($){

	$.fn.mobileSwipe = function(options){

		var defaults = {
			animateTime:300,	//运动时间
			arrowBtn:true,	//是否有按钮
			animationWay:"easeInExpo",	// 运动方式
			bottomCircleNav:true,	//底部小按钮
			loop:false,		// 循环
			autoPlay:true,// 自动轮播
			autoTime:6000
		};

		var settings = $.extend(true,defaults,options);

		return this.each(function(){
			
			$obj = $(this);
			var clientWidth = $(window).width();
			var imgListParent = $obj.find("ul");
			var imgList = imgListParent.find("li");
			var downX = 0;
			var downLeft = 0;
			var iNow = 0;
			var downTime = 0;
			var timer = null;
			
			if( settings.loop ){
				$(imgListParent).prepend(imgList.eq(imgList.length-1).clone());
				$(imgList.eq(0).clone()).appendTo(imgListParent);
				iNow = 1;
			}

			var imgListNew = $("li",imgListParent);

			//样式设置
			function init(){
				imgListNew.css({
					"float":"left",
					"width":clientWidth
				});
				imgListParent.css({
					"position":"relative",
					"overflow":"hidden",
					"width":clientWidth*imgListNew.length,
					"left":"0px"
				});
			}
			init();
			
			function autoPlay(){
				timer = setInterval(function(){
					if(iNow != imgListNew.length-1){
						iNow++;
					}else{
						iNow = 0;
					}
					oDivAnimate(iNow);
				},settings.autoTime)
			}
			
			//滚动函数
			function oDivAnimate(n){
				if(settings.loop){
					imgListParent.stop().animate({"left":-n*clientWidth},{
						easing: settings.animationWay,
			         	duration: settings.animateTime,
			         	complete:function(){
			         		if( n == imgListNew.length-1 ){
			         			iNow = 1;
			         			imgListParent.css({
			         				"left":"-"+clientWidth*iNow+"px"
			         			})
			         		}else if( n == 0 ){
			         			iNow = imgListNew.length-2;
			         			imgListParent.css({
			         				"left":"-"+clientWidth*iNow+"px"
			         			})
			         		}
			         		bottomCircleNavChange(iNow)
			         	}
					});
				}else{
					imgListParent.stop().animate({"left":-n*clientWidth},{
						easing: settings.animationWay,
			         	duration: settings.animateTime,
			         	complete:function(){
			         		if(settings.bottomCircleNav){
								bottomCircleNavChange(iNow)
							}
			         	}
					});
				}
				
				function bottomCircleNavChange(n){
					if(settings.loop){
						$(".bottomCircleNav a").eq(n-1).addClass('active').siblings('a').removeClass('active')
					}else{
						$(".bottomCircleNav a").eq(n).addClass('active').siblings('a').removeClass('active')
					}
					
				}
				
				autoPlay()
			}

			if( settings.arrowBtn ){
				$obj.append('<span class="swipeBtn swipePrev">&lt;</span><span class="swipeBtn swipeNext">&gt;</span>');
				$(".swipeNext").on("click",function(){
					clearInterval(timer);
					if(iNow != imgListNew.length-1){
						iNow++;
					}
					oDivAnimate(iNow);
				});
				$(".swipePrev").on("click",function(){
					clearInterval(timer);
					if(iNow != 0){
						iNow--;
					}
					oDivAnimate(iNow);
				})
			}

			if(settings.bottomCircleNav){
				$obj.append('<div class="bottomCircleNav" style="position:absolute; left:0px; right:0px; bottom:20px; text-align:center;"></div>');
				for(var i=0; i<imgList.length; i++){
					$(".bottomCircleNav").append('<a href="javascript:;" style="display:inline-block; width:20px; height:20px; margin:0 6px; background:rgba(0,0,0,0.4); border-radius:20px;"></a>')
				};

			}
			oDivAnimate(iNow);
			//取消默认事件
			$(document).bind("touchmove",function(ev){
				ev.preventDefault();
			})

			imgListParent.bind("touchstart",function(ev){
				
				clearInterval(timer);
				var touchs = ev.originalEvent.changedTouches[0]; //获取屏幕上的第一个手指
				downX = touchs.pageX; // 第一个手指距离左边的距离
				downLeft = $(this).offset().left;  //容易左边距离屏幕左边的距离
				var bBtn = true; 
				downTime = Date.now();

				imgListParent.bind("touchmove",function(ev){

					var touchs = ev.originalEvent.changedTouches[0];

					if( $(this).offset().left >= 0 ){
						if( bBtn ){
							bBtn = false;
							downX = touchs.pageX;
						}
						$(this).css({
							"left":(touchs.pageX - downX)/3 // 除以3是为了距离有种缩小的感觉
						})
					}else if( $(this).offset().left <= $obj.width() - imgListParent.width() ){
				
						if(bBtn){
							bBtn = false;
							downX = touchs.pageX;
						}
						$(this).css({
							"left":(touchs.pageX - downX)/3 + ( $obj.width() - imgListParent.width() )
						})
					}else{
						$(this).css({
							"left":touchs.pageX - downX + downLeft
						})
					}

				});
				imgListParent.bind("touchend",function(ev){

					var touchs = ev.originalEvent.changedTouches[0];
					if( touchs.pageX < downX ){   
						if(iNow != imgListNew.length-1){
							if( downX - touchs.pageX > imgList.width()/3 || (Date.now() - downTime < 300 && downX - touchs.pageX > 30 ) ){
								iNow++;
							}
						}
						oDivAnimate(iNow);
					}else{  
						if(iNow != 0){
							if( touchs.pageX - downX > imgList.width()/3 || (Date.now() - downTime < 300 && touchs.pageX - downX > 30 ) ){
								iNow--;
							}
						}
						oDivAnimate(iNow);
					}
					imgListParent.unbind('touchmove');
					imgListParent.unbind('touchend');

				})
			})
			
		})
		
	}

})(jQuery)