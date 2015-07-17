/** @jsx React.DOM */
var React = require('react/addons');
var Carousel = require('./Carousel');

module.exports = React.createClass({
	
	propsTypes: {
		images: React.PropTypes.array.isRequired,
		initialSelectedImage: React.PropTypes.integer
	},

	getDefaultProps () {
		return {
			initialSelectedImage: 0
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
		var { images } = this.props;
		var { current } = this.state;
		var mainImage = (images && images[current] && images[current].url);

		return (
			<div className="image-gallery">
				<Carousel type="slider" images={images} initialSelectedImage={this.state.currentImage} onChange={this.selectImage} onSelectImage={this.selectImage} />
				<Carousel images={images} initialSelectedImage={this.state.currentImage} onSelectImage={this.selectImage} />
			</div>
		);
	}
});

