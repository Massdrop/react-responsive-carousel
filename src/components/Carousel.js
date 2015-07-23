'use strict';

/** @jsx React.DOM */
var React = require('react/addons'),
	klass = require('../cssClasses'),
	_ = require('lodash'),
	outerWidth = require('../dimensions').outerWidth,
	has3d = require('../has3d')();

module.exports = React.createClass({
	propsTypes: {
		images: React.PropTypes.array.isRequired,
		initialSelectedImage: React.PropTypes.number,
		showArrows: React.PropTypes.bool,
		showDots: React.PropTypes.bool,
		showStatus: React.PropTypes.bool,
		carouselWidth: React.PropTypes.number,
		onChangeWidth: React.PropTypes.func,
		onSelectImage: React.PropTypes.func
	},
	getDefaultProps: function() {
		return {
			initialSelectedImage: 0,
			showArrows: true,
			carouselWidth: 0,
			// Carousel is the default type. It stands for a group of thumbs.
			// It also accepts 'slider', which will show a full width item 
			type: 'carousel'
		}
	},
	getInitialState: function() {
		return {
			selectedImage: this.props.initialSelectedImage, // index of the image to be shown.
			wrapperWidth: this.props.carouselWidth,
			maxImageWidth: 0,
			loadedImages: new Array(this.props.images.length),
			animate: false // we don't want the first image loaded to slide in
		}
	},
	statics: {
		// current position is needed to calculate the right delta
		currentPosition: 0,
		// touchPosition is a temporary var to decide what to do on touchEnd
		touchPosition: null
	},
	componentWillMount: function() {
		if (typeof window !== 'undefined') {
			// as the widths are calculated, we need to resize 
			// the carousel when the window is resized
			window.addEventListener("resize", this.resizeWrapper);
		}
  },
	componentWillUnmount: function() {
		var index = this.props.images.length - 1;

		window.removeEventListener("resize", this.resizeWrapper);
		for (index; index >= 0; index -= 1) {
			this.refs['item' + index].getDOMNode().onload = null;
		}
  },
	componentWillReceiveProps: function(props) {
		if (props.initialSelectedImage !== this.state.selectedImage) {
			this.setState({
				selectedImage: props.initialSelectedImage,
				animate: true
			});
		}

		if (props.carouselWidth && props.carouselWidth !== this.state.wrapperWidth) {
			this.setState({
				wrapperWidth: props.carouselWidth
			});
		}
	},
	componentDidMount: function() {
		var index = this.props.images.length - 1,
			maxImageWidth = this.state.maxImageWidth,
			image;

		for (index; index >= 0; index -= 1) {
			image = this.refs['item' + index].getDOMNode();

			if (!!image.src && image.complete) { // image is loaded
				maxImageWidth = Math.max(outerWidth(image), maxImageWidth);
			} else {
				image.onload = this.onImageLoad;

				if (!image.src && index === this.state.selectedImage) {
					this.loadImage(index);
				}
			}
		}

		if (maxImageWidth > this.state.maxImageWidth) {
			if (this.isSlider()) {
				this.setState({
					maxImageWidth: maxImageWidth,
					wrapperWidth: maxImageWidth
				});

				if (typeof this.props.onChangeWidth === 'function') {
					this.props.onChangeWidth(maxImageWidth);
				}
			} else {
				this.setState({
					maxImageWidth: maxImageWidth
				});
			}
		}

		// adding swipe events
		var el = this.refs.itemList.getDOMNode();
		el.addEventListener('touchstart', this.onSwipeStart);
		el.addEventListener('touchmove', this.onSwipeMove);
		el.addEventListener('touchend', this.onSwipeEnd);
	},
	isSlider: function() {
		return this.props.type === "slider";
	},
	isImageLoaded: function(index) {
		return this.state.loadedImages[index];
	},
	loadImage: function(index) {
		var imageReactElement = _.get(this, 'refs[item' + index + ']'),
			loadedImages,
			image;

		if (imageReactElement) {
			image = imageReactElement.getDOMNode();

			if (!image.src) {
				image.src = this.props.images[index].src;

				loadedImages = this.state.loadedImages.slice();
				loadedImages[index] = true;
				this.setState({
					loadedImages: loadedImages
				});

				_.defer(this.loadImage, index + 1);
				_.defer(this.loadImage, index - 1);
			}
		}
	},
	onImageLoad: function(e) {
		var width = outerWidth(e.target);
		if (width > this.state.maxImageWidth) {
			if (this.isSlider()) {
				this.setState({
					maxImageWidth: width,
					wrapperWidth: width
				});

				if (typeof this.props.onChangeWidth === 'function') {
					this.props.onChangeWidth(width);
				}
			} else {
				this.setState({
					maxImageWidth: width
				});
			}
		}
	},
	resizeWrapper: function() {
		var index = this.props.images.length - 1,
			maxImageWidth = 0,
			image;

		for (index; index >= 0; index -= 1) {
			image = this.refs['item' + index].getDOMNode();

			if (image.complete) { // image is loaded
				maxImageWidth = Math.max(outerWidth(image), maxImageWidth);
			}
		}

		if (this.isSlider()) {
			this.setState({
				maxImageWidth: maxImageWidth,
				wrapperWidth: maxImageWidth
			});

			if (typeof this.props.onChangeWidth === 'function') {
				this.props.onChangeWidth(maxImageWidth);
			}
		}
	},
	numVisibleItems: function() {
		return Math.floor(this.state.wrapperWidth / this.state.maxImageWidth);
	},
	triggerOnSelectImage (imageIndex) {
		if (typeof this.props.onSelectImage === 'function') {
			this.props.onSelectImage(imageIndex);
		}

		if (imageIndex !== this.state.selectedImage) {
			this.setState({
				selectedImage: imageIndex
			});
		}
	},

	// touch start
	onSwipeStart: function (e) {
		this.setState({
			// saving the initial touch 
			touchStart: e.touches[0].pageX,
			// setting the swiping state
			swiping: true
		})
	},

	onSwipeMove: function (e) {
		// getting the current delta
		var delta = e.touches[0].pageX - this.state.touchStart;
    var leftBoundry = 0;
    var lastLeftBoundry = - this.state.maxImageWidth * (this.props.images.length - 1);

    //if the first image meets the left boundry, prevent user from swiping left
    if (this.currentPosition === leftBoundry && delta > 0) {
      delta = 0;
    }
    //if the last image meets the left boundry, prevent user from swiping right
    if (this.currentPosition === lastLeftBoundry && delta < 0) {
      delta = 0;
    }
		// real position
		var position = this.currentPosition + delta;
		// adding it to the last position and saving the position
		this.touchPosition = delta;

		var elementStyle = this.refs.itemList.getDOMNode().style;

		// if 3d isn't available we will use left to move
		if (has3d) {
			[
				'WebkitTransform',
				'MozTransform',
				'MsTransform',
				'OTransform',
				'transform',
				'msTransform'
			].forEach((prop) => elementStyle[prop] = 'translate3d(' + position + 'px, 0, 0)');
		} else {
			elementStyle.left = position + 'px';
		}
	},

	onSwipeEnd: function (e) {
		this.setState({
			// reset touchStart position
			touchStart: null,
			// finish the swiping state
			swiping: false
		}, 
			// this function is the callback of setState because we need to wait for the
			// state to be setted, so the swiping class will be removed and the 
			// transition to the next slide will be smooth
			function () {
        if (this.touchPosition === 0) {
          /* prevent users from swipe right on the first image
             but it goes to the opposite direction, as the delta is alwsys 0
             when swipe right on the first image.
             also prevent users from swipe left on the last image from the same reason.
          */
        } else if (this.touchPosition < 0) {
          // less than 0 means that it's going left
          this.slideLeft();
        } else if (this.touchPosition > 0) {
          this.slideRight();
        }
				// discard the position
				this.touchPosition = null;	
			}.bind(this)
		);	
	},

	slideRight: function() {
		if (this.isSlider()) {
			this.moveTo(this.state.selectedImage - 1);
		} else {
			this.moveTo(Math.max(this.state.selectedImage - Math.ceil(this.numVisibleItems() / 2), 0));
		}
	},

	slideLeft: function() {
		if (this.isSlider()) {
			this.moveTo(this.state.selectedImage + 1);
		} else {
			this.moveTo(Math.min(this.state.selectedImage + Math.ceil(this.numVisibleItems() / 2), this.props.images.length - 1));
		}
	},

	moveTo: function(position) {
		position = (position + this.props.images.length) % this.props.images.length;
		
		this.setState({
			// if it's not a slider, we don't need to set position here
			selectedImage: this.isSlider() ? position : this.state.selectedImage
		});
		
		this.triggerOnSelectImage(position);
	},


	getTotalWidth: function() {
		return this.state.maxImageWidth * this.props.images.length || 'auto';
	},

	changeItem: function(e) {
		var newIndex = e.target.value;
		this.setState({
			selectedImage: newIndex
		})
	},

	renderImages: function() {
		return this.props.images.map((item, index) => {
			var itemClass = klass.ITEM(this.isSlider(), index, this.state.selectedImage),
				styles = this.isSlider() ? { width: this.state.maxImageWidth } : {},
				imageTag;
			
			if (this.isImageLoaded(index)) {
				imageTag = (
					<img key={index} ref={"item" + index} {...item} />
				);
			} else {
				imageTag = (
					<img key={index} ref={"item" + index} {..._.omit(item, 'src')} />
				);
			}

			return (
				<li key={index} className={itemClass} 
					style={styles}
					onClick={this.triggerOnSelectImage.bind(this, index)}>
					{imageTag}
				</li>
			);
		});
					
	},

	renderDots: function() {
		if (!this.props.showDots) {
			return null
		}
		
		return (
			<ul className="control-dots">
				{this.props.images.map( (item, index) => {
					return <li className={klass.DOT(index === this.state.selectedImage)} onClick={this.changeItem} value={index} key={index} />;
				})}
			</ul>
		);
	},

	renderStatus: function() {
		if (!this.props.showStatus) {
			return null
		}
		return <p className="carousel-status">{this.state.selectedImage + 1} of {this.props.images.length}</p>;
	}, 

	render: function() {
		var showArrows = this.props.showArrows && (this.numVisibleItems() / 2) < this.props.images.length,
			showPrevArrow = showArrows && this.props.images.length > 1,
			showNextArrow = showPrevArrow,
			itemListStyles = {},
			carouselWidth = this.state.maxImageWidth * this.props.images.length,
			nextArrow = '',
			prevArrow = '';

		if (this.props.images.length === 0) {
			return null;
		}
		
		// hold the last position in the component context to calculate the delta on swiping
		this.currentPosition = (this.state.wrapperWidth - this.state.maxImageWidth) / 2 - (this.state.maxImageWidth * this.state.selectedImage);

		if (has3d) {
			// if 3d is available, let's take advantage of the performance of transform
			var transformProp = 'translate3d(' + this.currentPosition + 'px, 0, 0)';
			itemListStyles = {
				'WebkitTransform': transformProp,
				   'MozTransform': transformProp,
				  'MsTransform': transformProp,
				   'OTransform': transformProp,
				    'transform': transformProp,
				  'msTransform': transformProp,
				  	  'width': carouselWidth
			}
		} else {
			// if 3d isn't available we will use left to move
			itemListStyles = {
				left: this.currentPosition,
				width: carouselWidth
			}
		}

		if (showArrows) {
			prevArrow = (
				<button className={klass.ARROW_LEFT(false)} onClick={this.slideRight} />
			);
			nextArrow = (
				<button className={klass.ARROW_RIGHT(false)} onClick={this.slideLeft} />
			);
		}

		return (
			<div className={klass.CAROUSEL(this.isSlider(), this.state.animate)}>
				{prevArrow}
				
				<div className={klass.WRAPPER(this.isSlider())} ref="itemsWrapper" style={{ width: this.state.wrapperWidth }}>
					<ul className={klass.SLIDER(this.isSlider(), this.state.swiping)} style={itemListStyles} ref="itemList">
						{ this.renderImages() }
					</ul>
				</div>

				{nextArrow}
				
				{ this.renderDots() }
				{ this.renderStatus() }
			</div>
		);
		
	}
});

