'use strict';

var classNames = require('classnames');

module.exports = {
	CAROUSEL (isSlider, animate) {
		return classNames({
			"carousel": true,
			"carousel-slider": isSlider,
			"carousel-animate": animate
		});
	}, 

	WRAPPER (isSlider) {
		return classNames({
			"thumbs-wrapper": !isSlider,
			"slider-wrapper": isSlider
		});
	},

	SLIDER (isSlider, isSwiping){
		return classNames({
			"thumbs": !isSlider,
			"slider": isSlider,
			"swiping": isSwiping
		});
	},

	ITEM (isSlider, index, selectedImage) {
		return classNames({
			"thumb": !isSlider,
			"slide": isSlider,
			"selected": index === selectedImage
		});
	},

	ARROW_LEFT (disabled) {
		return classNames({
			"control-arrow control-left icon-angle-left": true,
			"control-disabled": disabled
		});
	},

	ARROW_RIGHT (disabled) {
		return classNames({
			"control-arrow control-right icon-angle-right": true,
			"control-disabled": disabled
		})
	},

	DOT (selected) {
		return classNames({
			"dot": true,
			'selected': selected
		})
	}
}
