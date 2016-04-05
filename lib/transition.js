/*
 * --- TRANSITION MODULE
 *         Module to hook into the transitionend event for CSS transitions
 *         Consists of:
 *         - trigger(
 *                    el, // DOM - element to add classes to
 *                    animationEl, // DOM - element to listen to event for
 *                    allowBubble, // BOOL - whether to detect on children elements
 *                    classes, // [String, String] - Set of classes for transition. First sets the beginning of transition (opacity: 0), second sets the end of the transition (opacity: 1)
 *                    callback // Func() - Callback once transition complete
 *                  ): 
 *         -  detect(
 *                    el, // DOM - element to listen to event for
 *                    callback // Func() - Callback once transition complete
 *                  ): 
 */

(function(window, factory) {
	// universal module definition

	/*global define: false, module: false, require: false */

	if ( typeof module == 'object' && module.exports ) {
		// CommonJS
		module.exports = factory(
			window
		);
	} else {
		// browser global
		window.buffer = factory(
			window
		);
	}
})(window, function factory(window) {

	var trigger = function(options){
		var el = options['el'];
		var animationEl = options['animationEl'] ? options['animationEl'] : options['el'];
		var allowBubble = options['allowBubble'] ? options['allowBubble'] : false;
		var classes = options['classes'];
		var callback = options['callback'];

		if(!isElement(el)) {
			console.log('transition - no element selected');
			return false;
		}

		// add initial class - sets animation start styles
		el.classList.add(classes[0]);
		
		// add listener
		detect({
			el: animationEl,
			allowBubble: allowBubble,
			callback: removeClass
		});

		// read some css property to force css render before adding next class
		var tmp = el.offsetLeft;

		// add final class - sets animation end styles
		el.classList.add(classes[1]);

		function removeClass() {
			el.classList.remove(classes[0], classes[1]);
			el.dispatchEvent(new CustomEvent('transitioncomplete'));
			callback && callback();
		}
	};

	var detect = function(options) {
		var el = options['el'];
		var allowBubble = options['allowBubble'] ? options['allowBubble'] : false;
		var callback = options['callback'];
		
		if(!isElement(el)) {
			console.log('transition - no element selected');
			return false;
		}

		var _callback = function(e) {
			// check if transitionend node is the element we want
			if(e.target.isEqualNode(el) || allowBubble) {
				transitionEvent && el && el.removeEventListener(transitionEvent, _callback);
				callback && callback();
			}
		}
		var transitionEvent = whichTransitionEvent();
		// if display: none element will not transition
		var display = getStyle(el, 'display');
		if(typeof transitionEvent === 'undefined' || display === 'none') {
			callback && callback();
		}
		transitionEvent && el && el.addEventListener(transitionEvent, _callback);
	}


	/*
	 * --- UTILITY FUNCTIONS
	 */

	// Determine which transition event the browser supports
	// Credit: https://davidwalsh.name/css-animation-callback
	function whichTransitionEvent() {
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

	// Get CSS style property
	// Credit: http://stackoverflow.com/a/16112771
	function getStyle(el, styleProp) {
		var value, defaultView = el.ownerDocument.defaultView;
		// W3C standard way:
		if (defaultView && defaultView.getComputedStyle) {
			// sanitize property name to css notation (hypen separated words eg. font-Size)
			styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
			return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
		} else if (el.currentStyle) { // IE
			// sanitize property name to camelCase
			styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
				return letter.toUpperCase();
			});
			value = el.currentStyle[styleProp];
			// convert other units to pixels on IE
			if (/^\d+(em|pt|%|ex)?$/i.test(value)) { 
				return (function(value) {
					var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
					el.runtimeStyle.left = el.currentStyle.left;
					el.style.left = value || 0;
					value = el.style.pixelLeft + "px";
					el.style.left = oldLeft;
					el.runtimeStyle.left = oldRsLeft;
					return value;
				})(value);
			}
			return value;
		}
	}

	// Returns true if it is a DOM element
	// Credit: http://stackoverflow.com/a/384380
	function isElement(o){
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
		);
	}

	/*
	 * --- EXPORT
	 */

	return Transition = {
		trigger: trigger,
		detect: detect
	}
});