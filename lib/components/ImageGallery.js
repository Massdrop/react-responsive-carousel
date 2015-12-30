'use strict';

/** @jsx React.DOM */
var React = require('react/addons');
var Carousel = require('./Carousel');

module.exports = React.createClass({displayName: "exports",
	propsTypes: {
		images: React.PropTypes.array.isRequired,
		thumnails: React.PropTypes.array,
		initialSelectedImage: React.PropTypes.integer,

		showControls: React.PropTypes.bool,
		showStatus: React.PropTypes.bool,
		enableKeyboardShortcuts: React.PropTypes.bool,

		onChangeWidth: React.PropTypes.func,
		onSelectImage: React.PropTypes.func
	},
	getDefaultProps: function() {
		return {
			initialSelectedImage: 0,
			showControls: true,
			showStatus: true,
			enableKeyboardShortcuts: false
		}
	},
	getInitialState: function() {
		return {
			currentImage: this.props.initialSelectedImage,
      thumbnailCarouselWidth: 0
		}
	},
  componentWillMount: function() {
  	if (this.props.enableKeyboardShortcuts) {
	    window.addEventListener('keyup', this.onArrowKeyUp, false);
  	}
  },
  componentWillUnmount: function() {
  	if (this.props.enableKeyboardShortcuts) {
	    window.removeEventListener('keyup', this.onArrowKeyUp, false);
	  }
  },
  onArrowKeyUp: function(e) {
    if (e.keyCode === 37) { // Left
    	this.selectImage((this.state.currentImage - 1 + this.props.images.length) % this.props.images.length);
    } else if (e.keyCode === 39) { // Right
    	this.selectImage((this.state.currentImage + 1) % this.props.images.length);
    }
  },
	selectImage: function(imageIndex) {
		if (imageIndex !== this.state.currentImage) {
			this.setState({
				currentImage: imageIndex
			});

			if (typeof this.props.onSelectImage === 'function') {
				this.props.onSelectImage(imageIndex);
			}
		}
	},
  changeWidth: function(width) {
    if (width !== this.state.thumbnailCarouselWidth) {
      this.setState({
        thumbnailCarouselWidth: width
      });

      if (typeof this.props.onChangeWidth === 'function') {
      	this.props.onChangeWidth(width);
      }
    }
  },
  onTouchMove: function(e) {
    if (e.touches.length === 1) {
      e.preventDefault(); // Prevent page from scrolling while swiping gallery.
    }
  },
	render: function() {
		var $__0=     this.props,images=$__0.images,thumbnails=$__0.thumbnails,
			$__1=    this.state,current=$__1.current,
			mainImage = (images && images[current] && images[current].url);

		if (typeof thumbnails === 'undefined') {
			thumbnails = images;
		}

		return (
			React.createElement("div", {className: "image-gallery", onTouchMove: this.onTouchMove}, 
				React.createElement(Carousel, {type: "slider", images: images, initialSelectedImage: this.state.currentImage, showDots: this.props.showDots, showStatus: this.props.showStatus, onSelectImage: this.selectImage, onChangeWidth: this.changeWidth}), 
        React.createElement(Carousel, {images: thumbnails, carouselWidth: this.state.thumbnailCarouselWidth, initialSelectedImage: this.state.currentImage, showArrows: false, onSelectImage: this.selectImage})
			)
		);
	}
});

