function whichAnimationEvent(){
	var t;
	var el = document.createElement('fakeelement');
	var animations = {
		'animation':'animationend',
		'OAnimation':'oAnimationEnd',
		'MozAnimation':'animationend',
		'WebkitAnimation':'webkitAnimationEnd'
	}

	for(t in animations){
		if( el.style[t] !== undefined ){
			return animations[t];
		}
	}
}

var trigger = function(el, className, callback){
	// add initial class - sets animation start styles
	el.classList.add(className);
	
	// listener to remove className once done
	var animationEvent = whichAnimationEvent();
	animationEvent && el.addEventListener(animationEvent, removeClass);

	function removeClass() {
		animationEvent && el.removeEventListener(animationEvent, removeClass);
		el.classList.remove(className);
		callback && callback();
	}
};

var detect = function(el, callback) {
	var _callback = function(e) {
		if(e.target.isEqualNode(el)) {
			animationEvent && el.removeEventListener(animationEvent, _callback);
			callback && callback();
		}
	}
	// listener to remove classes once done
	var animationEvent = whichAnimationEvent();
	animationEvent && el.addEventListener(animationEvent, _callback);
}

module.exports = {
	trigger: trigger,
	detect: detect
};