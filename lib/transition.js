function whichTransitionEvent(){
	var t;
	var el = document.createElement('fakeelement');
	var transitions = {
		'transition':'transitionend',
		'OTransition':'oTransitionEnd',
		'MozTransition':'transitionend',
		'WebkitTransition':'webkitTransitionEnd'
	}

	for(t in transitions){
		if( el.style[t] !== undefined ){
			return transitions[t];
		}
	}
}

var trigger = function(el, classes, callback){
	// add initial class - sets animation start styles
	el.classList.add(classes[0]);
	
	// listener to remove classes once done
	var transitionEvent = whichTransitionEvent();
	transitionEvent && el.addEventListener(transitionEvent, removeClass);

	// read some css property to force css render before adding next class
	var tmp = el.offsetLeft;

	// add final class - sets animation end styles
	el.classList.add(classes[1]);

	function removeClass() {
		transitionEvent && el.removeEventListener(transitionEvent, removeClass);
		el.classList.remove(classes[0], classes[1]);
		callback && callback();
	}
};

var detect = function(el, callback) {
	var _callback = function(e) {
		if(e.target.isEqualNode(el)) {
			transitionEvent && el.removeEventListener(transitionEvent, _callback);
			callback && callback();
		}
	}
	// listener to remove classes once done
	var transitionEvent = whichTransitionEvent();
	transitionEvent && el.addEventListener(transitionEvent, _callback);
}

module.exports = {
	trigger: trigger,
	detect: detect
};