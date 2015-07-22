'use strict';

module.exports = {
	outerWidth: (el) => {
		var width = el.offsetWidth,
		  style = getComputedStyle(el);

    if (style.boxSizing === 'content-box') {
      width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    }

		return width;
	}	
} 
