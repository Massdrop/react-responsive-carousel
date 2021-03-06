'use strict';

var React = require('react'),
	klass = require('../cssClasses'),
	_ = require('lodash'),
	outerWidth = require('../dimensions').outerWidth,
	has3d = require('../has3d');

module.exports = React.createClass({displayName: "exports",
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
			this.refs['item' + index].onload = null;
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

    this.has3d = has3d();

		for (index; index >= 0; index -= 1) {
			image = this.refs['item' + index];

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
			this.setMaxImageWidth(maxImageWidth);
		}
	},
	isSlider: function() {
		return this.props.type === "slider";
	},
	isImageLoaded: function(index) {
		return this.state.loadedImages[index];
	},
	setMaxImageWidth: function(width) {
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
	},
	loadImage: function(index) {
		var image = _.get(this, 'refs[item' + index + ']'),
			loadedImages;

		if (image && !image.src) {
			image.src = this.props.images[index].src;

			if (index === this.state.selectedImage && this.isSlider()) {
				this.getImageDimensionsBeforeOnload(index); // for first image, we want to get height/width ASAP
			}

			loadedImages = this.state.loadedImages.slice();
			loadedImages[index] = true;
			this.setState({
				loadedImages: loadedImages
			});

			_.defer(this.loadImage, index + 1);
			_.defer(this.loadImage, index - 1);
		}
	},
	onImageLoad: function(e) {
		var width = outerWidth(e.target);
		if (width > this.state.maxImageWidth) {
			this.setMaxImageWidth(width);
		}
	},
	getImageDimensionsBeforeOnload: function(index) {
		var image,
			interval;

		if (!this.isSlider()) {
			return;
		}

		image = _.get(this, 'refs[item' + index + ']');

		if (image && image.src && !image.complete) {
			interval = window.setInterval(function() {
				if (image.offsetWidth) {
					this.setMaxImageWidth(outerWidth(image));
					window.clearInterval(interval);
				}
			}.bind(this), 20);

			// Give up after awhile so we don't drain user's battery
			window.setTimeout(function() { window.clearInterval(interval); }, 2000);
		}
	},
	resizeWrapper: function() {
		var index = this.props.images.length - 1,
			maxImageWidth = 0,
			image;

		for (index; index >= 0; index -= 1) {
			image = this.refs['item' + index];

			if (image.complete) { // image is loaded
				maxImageWidth = Math.max(outerWidth(image), maxImageWidth);
			}
		}

		if (this.isSlider()) {
			this.setMaxImageWidth(maxImageWidth);
		}
	},
	numVisibleItems: function() {
		return Math.floor(this.state.wrapperWidth / this.state.maxImageWidth);
	},
	triggerOnSelectImage:function (imageIndex) {
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
		if (e.touches.length === 1) {
			this.setState({
				// saving the initial touch
				touchStart: e.touches[0].pageX,
				// setting the swiping state
				swiping: true
			})
		}
	},

	onSwipeMove: function (e) {
		if (e.touches.length === 1) {
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

			var elementStyle = this.refs.itemList.style;

			// if 3d isn't available we will use left to move
			if (this.has3d) {
				[
					'WebkitTransform',
					'MozTransform',
					'MsTransform',
					'OTransform',
					'transform',
					'msTransform'
				].forEach(function(prop)  {return elementStyle[prop] = 'translate3d(' + position + 'px, 0, 0)';});
			} else {
				elementStyle.left = position + 'px';
			}

			e.preventDefault(); // Prevent page from scrolling while swiping carousel.
		}
	},

	onSwipeEnd: function (e) {
		if (this.state.swiping) {
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
		}
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
		return this.props.images.map(function(item, index)  {
			var itemClass = klass.ITEM(this.isSlider(), index, this.state.selectedImage),
				styles = this.isSlider() ? { width: this.state.maxImageWidth } : {},
				imageTag;

			if (this.isImageLoaded(index)) {
				imageTag = (
					React.createElement("img", Object.assign({key: index, ref: "item" + index},  item))
				);
			} else {
				imageTag = (
					React.createElement("img", Object.assign({key: index, ref: "item" + index},  _.omit(item, 'src')))
				);
			}

			return (
				React.createElement("li", {key: index, className: itemClass,
					style: styles,
					onClick: this.triggerOnSelectImage.bind(this, index)},
					imageTag
				)
			);
		}.bind(this));

	},

	renderDots: function() {
		if (!this.props.showDots) {
			return null
		}

		return (
			React.createElement("ul", {className: "control-dots"},
				this.props.images.map( function(item, index)  {
					return React.createElement("li", {className: klass.DOT(index === this.state.selectedImage), onClick: this.changeItem, value: index, key: index});
				}.bind(this))
			)
		);
	},

	renderStatus: function() {
		if (!this.props.showStatus) {
			return null
		}
		return React.createElement("p", {className: "carousel-status"}, this.state.selectedImage + 1, " of ", this.props.images.length);
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

		if (this.has3d) {
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
				React.createElement("button", {className: klass.ARROW_LEFT(false), onClick: this.slideRight})
			);
			nextArrow = (
				React.createElement("button", {className: klass.ARROW_RIGHT(false), onClick: this.slideLeft})
			);
		}

		return (
			React.createElement("div", {className: klass.CAROUSEL(this.isSlider(), this.state.animate)},
				prevArrow,

				React.createElement("div", {className: klass.WRAPPER(this.isSlider()), ref: "itemsWrapper", style: { width: this.state.wrapperWidth}},
					React.createElement("ul", {className: klass.SLIDER(this.isSlider(), this.state.swiping), style: itemListStyles, ref: "itemList", onTouchStart: this.onSwipeStart, onTouchMove: this.onSwipeMove, onTouchEnd: this.onSwipeEnd},
						 this.renderImages()
					)
				),

				nextArrow,

				 this.renderDots(),
				 this.renderStatus()
			)
		);

	}
});

