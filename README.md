# CSS-Animation-and-Transition-Listeners

Add javascript event listeners for CSS animations and transitions.

Useful for transitioning elements between display block and none.


## Usage

Plugin works through normal HTML include or through NPM

### Include

    // HTML
    <script src="/pathto/transition.js"></script>

    // NPM
    var Transition = require('/pathto/transition.js');

### Call

    // Minimal
    Transition.trigger({
        el: element, // DOM element
        classes: ['transition-type-start', 'transition-type-end']
    });

    // Robust
    Transition.trigger({
        el: element, // DOM element
        animationEl: subElement, // Another DOM element
        classes: ['transition-type-start', 'transition-type-end'],
        callback: function() {
            // run callback
        }
    });


## Examples

Found in examples/transition.html