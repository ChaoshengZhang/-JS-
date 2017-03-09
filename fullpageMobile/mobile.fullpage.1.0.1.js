// JavaScript Document
/*
	coder：章超胜
	QQ：1019779284
	time:2016-6-17 15:05:41
*/
(function($){

	$.fn.mobileFullpage = function(options){

		var defaults = {
			loop:false,
			animationWay:"linear",
			animateTime:400
		}

		var settings = $.extend(true,defaults,options);

		return this.each(function(){

			var $obj = $(this);
			var oListParent = $obj.find("ul");
			var oList = oListParent.find("li");
			var clientHeight = $(window).height();
			var noticeBtn = $obj.find(".btnShow");
			var downY = 0;
			var offsetTop = 0;
			var iNow = 0;
			var downTime = 0;
			
			function noticeBtnMove(){
				
				function MoveTop(){
					noticeBtn.stop().animate({"bottom":"+=10"},{
						easing: settings.animationWay,
			         	duration: settings.animateTime,
			         	complete:function(){
			         		MoveBottom();
			         	}
					})
				}
				
				function MoveBottom(){
					noticeBtn.stop().animate({"bottom":"-=10"},{
						easing: settings.animationWay,
			         	duration: settings.animateTime,
			         	complete:function(){
			         		MoveTop();
			         	}
					})
				}
				MoveTop()
			}
			noticeBtnMove();
			
			//取消默认事件
			$(document).bind("touchmove",function(ev){
				ev.preventDefault();
			})
			
			function init(){
				oList.css({
					"height":clientHeight
				});
				oListParent.css({
					"position":"relative",
					"top":"0px"
				})
			}
			init();
			
			function oDivAnimate(n){
				oListParent.stop(false,true).animate({"top":"-"+n*clientHeight},{
					easing: settings.animationWay,
		         	duration: settings.animateTime,
		         	complete:function(){
		         		oList.find(".people").removeClass("rubberBand").addClass("rotateInDownRight")
		         		//rotateInDownRight
		         		oList.eq(n).find(".people").removeClass("rotateInDownRight").addClass("rubberBand");
		         	}
				});
				if( n == oList.length-1 ){
					noticeBtn.hide()
				}else{
					noticeBtn.show()
				}
			}
			oDivAnimate(iNow)
			oListParent.bind("touchstart",function(ev){

				var touchs = ev.originalEvent.changedTouches[0];
				var bBtn = true;
				downY = touchs.pageY;
				offsetTop = $(this).offset().top;
				downTime = Date.now();

				oListParent.bind("touchmove",function(ev){

					var touchs = ev.originalEvent.changedTouches[0];
					if( $(this).offset().top >= 0 ){
						if(bBtn){
							bBtn = false;
							downY = touchs.pageY;
						}
						$(this).css({
							"top":(touchs.pageY-downY)/3
						})
					}else if( $(this).offset().top <= clientHeight-oListParent.height() ){
						if(bBtn){
							bBtn = false;
							downY = touchs.pageY;
						}
						$(this).css({
							"top":(touchs.pageY-downY)/3+clientHeight-oListParent.height()
						})
					}else{
						$(this).css({
							"top":offsetTop+touchs.pageY-downY
						})
					}

				});

				oListParent.bind("touchend",function(ev){

					var touchs = ev.originalEvent.changedTouches[0];
					if( touchs.pageY > downY ){
						if( iNow != 0 ){
							if( (touchs.pageY-downY)>clientHeight/3 || (touchs.pageY - downY>30 && Date.now()-downTime < 300) ){
								iNow--;
							}
						}	
						oDivAnimate(iNow)
					}else{
						if( iNow != oList.length-1 ){
							if( (downY-touchs.pageY) > clientHeight/3 || (downY-touchs.pageY>30 && Date.now()-downTime < 300) ){
								iNow++;
							}
						}
						oDivAnimate(iNow)
					}
					oListParent.unbind('touchmove');
					oListParent.unbind('touchend');
				})

			})

		})
		

	}

})(jQuery)