// JavaScript Document
(function($){

	var autoFullscreen = function () {
	 	var supportsOrientationChange = "onorientationchange" in window,
	 		orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
	 	window.addEventListener(orientationEvent, function(){
			var ua = navigator.userAgent.toLowerCase();
	  		var deviceType = "";
		  	//determine device type
		  	if (ua.indexOf("ipad") > 0) {
		   		deviceType = "isIpad";
		  	} else if (ua.indexOf("android") > 0) {
		   		deviceType = "isAndroid";
		  	} else if (ua.indexOf("iphone") > 0) {
		   		deviceType = "isIphone";
		  	} else {
		   		return;
		  	}
		  	// 判断横竖屏  
		  	if ("isIpad" == deviceType) {
		   		if (Math.abs(window.orientation) == 90) {alert("我是ipad的横屏");  }
		  		else{alert("我是ipad的竖屏");  }
		  	}else if ("isAndroid" == deviceType) {
		   		//纵屏 90 or -90  横屏 0
		   		if (Math.abs(window.orientation) == 90){
		   			alert("我是Android的纵屏");
		   		}else {
		    		//document.webkitCancelFullScreen();
		    		alert("我是Android的横屏");  
		   		}
		  	} else if ("isIphone" == deviceType) {
		   		if (Math.abs(window.orientation) == 90) {

		   		}else{

		   		}
		  	}
		},false);
	}

})(jQuery)