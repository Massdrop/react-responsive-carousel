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
		showStatus: React.PropTypes.bool
	},

	getDefaultProps () {
		return {
			initialSelectedImage: 0,
			showControls: true,
			showStatus: true
		}
	}, 

	getInitialState () {
		return {
			currentImage: this.props.initialSelectedImage
		}
	},

	selectImage (selectedImage) {
		this.setState({
			currentImage: selectedImage
		});
	},

	render () {
		var { images, thumbnails } = this.props,
			{ current } = this.state,
			mainImage = (images && images[current] && images[current].url);

		if (typeof thumbnails === 'undefined') {
			thumbnails = images;
		}

		return (
			<div className="image-gallery">
				<Carousel type="slider" images={images} initialSelectedImage={this.state.currentImage} showControls={this.props.showControls} showStatus={this.props.showStatus} onChange={this.selectImage} onSelectImage={this.selectImage} />
				<Carousel images={thumbnails} initialSelectedImage={this.state.currentImage} onSelectImage={this.selectImage} />
			</div>
		);
	}
});

