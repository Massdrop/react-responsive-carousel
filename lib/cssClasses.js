'use strict';

var classNames = require('classnames');

module.exports = {
	CAROUSEL:function (isSlider, animate) {
		return classNames({
			"carousel": true,
			"carousel-slider": isSlider,
			"carousel-animate": animate
		});
	}, 

	WRAPPER:function (isSlider) {
		return classNames({
			"thumbs-wrapper": !isSlider,
			"slider-wrapper": isSlider
		});
	},

	SLIDER:function (isSlider, isSwiping){
		return classNames({
			"thumbs": !isSlider,
			"slider": isSlider,
			"swiping": isSwiping
		});
	},

	ITEM:function (isSlider, index, selectedImage) {
		return classNames({
			"thumb": !isSlider,
			"slide": isSlider,
			"selected": index === selectedImage
		});
	},

	ARROW_LEFT:function (disabled) {
		return classNames({
			"control-arrow control-left icon-angle-left": true,
			"control-disabled": disabled
		});
	},

	ARROW_RIGHT:function (disabled) {
		return classNames({
			"control-arrow control-right icon-angle-right": true,
			"control-disabled": disabled
		})
	},

	DOT:function (selected) {
		return classNames({
			"dot": true,
			'selected': selected
		})
	}
}
