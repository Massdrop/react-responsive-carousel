'use strict';

/** @jsx React.DOM */
var React = require('react/addons');
var Carousel = require('./Carousel');

module.exports = React.createClass({
	propsTypes: {
		images: React.PropTypes.array.isRequired,
		thumnails: React.PropTypes.array,
		initialSelectedImage: React.PropTypes.integer,

		showControls: React.PropTypes.bool,
		showStatus: React.PropTypes.bool,
		enableKeyboardShortcuts: React.PropTypes.bool,

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
			currentImage: this.props.initialSelectedImage
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
	render: function() {
		var { images, thumbnails } = this.props,
			{ current } = this.state,
			mainImage = (images && images[current] && images[current].url);

		if (typeof thumbnails === 'undefined') {
			thumbnails = images;
		}

		return (
			<div className="image-gallery">
				<Carousel type="slider" images={images} initialSelectedImage={this.state.currentImage} showControls={this.props.showControls} showStatus={this.props.showStatus} onSelectImage={this.selectImage} />
				<Carousel images={thumbnails} initialSelectedImage={this.state.currentImage} onSelectImage={this.selectImage} />
			</div>
		);
	}
});

