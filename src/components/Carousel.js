'use strict';

/** @jsx React.DOM */
var React = require('react/addons'),
	klass = require('../cssClasses'),
	outerWidth = require('../dimensions').outerWidth,
	has3d = require('../has3d')();

module.exports = React.createClass({
	propsTypes: {
		images: React.PropTypes.array.isRequired,
		initialSelectedImage: React.PropTypes.integer,
		showControls: React.PropTypes.bool,
		showStatus: React.PropTypes.bool,
		onSelectImage: React.PropTypes.func
	},
	getDefaultProps () {
		return {
			initialSelectedImage: 0,
			// Carousel is the default type. It stands for a group of thumbs.
			// It also accepts 'slider', which will show a full width item 
			type: 'carousel'
		}
	},
	getInitialState () {
		return {
			selectedImage: this.props.initialSelectedImage, // index of the image to be shown.
			animate: false // we don't want the first image loaded to slide in
		}
	},
	statics: {
		// current position is needed to calculate the right delta
		currentPosition: 0,
		// touchPosition is a temporary var to decide what to do on touchEnd
		touchPosition: null
	},
	componentWillMount() {
		// as the widths are calculated, we need to resize 
		// the carousel when the window is resized
		window.addEventListener("resize", this.updateDimensions);
  },
	componentWillUnmount() {
		// removing listeners
		window.removeEventListener("resize", this.updateDimensions);
  },
	componentWillReceiveProps (props) {
		if (props.initialSelectedImage !== this.state.selectedImage) {
			this.setState({
				selectedImage: props.initialSelectedImage,
				animate: true
			});
		}
	},
	componentDidMount (nextProps) {
		// when the component is rendered we need to calculate 
		// the container size to adjust the responsive behaviour
		this.updateDimensions();

		// adding swipe events
		var el = this.refs.itemList.getDOMNode();
		el.addEventListener('touchstart', this.onSwipeStart);
		el.addEventListener('touchmove', this.onSwipeMove);
		el.addEventListener('touchend', this.onSwipeEnd);
	},
	_isSlider() {
		return this.props.type === "slider";
	},
	updateDimensions () {
		this.calculateSpace(this.props.images.length);
		// the component should be rerended after calculating space
		this.forceUpdate();
	},

	// Calculate positions for carousel
	calculateSpace (total) {
		this.wrapperWidth = this.refs.itemsWrapper.getDOMNode().clientWidth;
		this.imageWidth = this._isSlider() ? this.wrapperWidth : outerWidth(this.refs.item0.getDOMNode());
		this.visibleItems = Math.floor(this.wrapperWidth / this.imageWidth);	
		
		this.lastElementPosition = this.imageWidth * total;
		
		// exposing variables to other methods on this component
		this.showArrows = (this.visibleItems / 2) < total;
		
		// Index of the last visible element that can be the first of the carousel
		this.lastPosition = (total - this.visibleItems);
	}, 

	triggerOnSelectImage (imageIndex) {
		var handler = this.props.onSelectImage;

		if (typeof handler === 'function') {
			handler(imageIndex);
		}

		if (imageIndex !== this.state.selectedImage) {
			this.setState({
				selectedImage: imageIndex
			});
		}
	},

	// touch start
	onSwipeStart (e) {
		this.setState({
			// saving the initial touch 
			touchStart: e.touches[0].pageX,
			// setting the swiping state
			swiping: true
		})
	},

	onSwipeMove (e) {
		// getting the current delta
		var delta = e.touches[0].pageX - this.state.touchStart;
    var leftBoundry = 0;
    var lastLeftBoundry = - this.imageWidth * (this.props.images.length - 1);

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

	onSwipeEnd (e) {
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

	slideRight () {
		if (this._isSlider()) {
			this.moveTo(this.state.selectedImage - 1);
		} else {
			this.moveTo(Math.max(this.state.selectedImage - Math.ceil(this.visibleItems / 2), 0));
		}
	},

	slideLeft (){
		if (this._isSlider()) {
			this.moveTo(this.state.selectedImage + 1);
		} else {
			this.moveTo(Math.min(this.state.selectedImage + Math.ceil(this.visibleItems / 2), this.props.images.length - 1));
		}
	},

	moveTo (position) {
		position = (position + this.props.images.length) % this.props.images.length;
		
		this.setState({
			// if it's not a slider, we don't need to set position here
			selectedImage: this._isSlider() ? position : this.state.selectedImage
		});
		
		this.triggerOnSelectImage(position);
	},


	getTotalWidth () {
		return this.imageWidth * this.props.images.length || 'auto';
	},

	changeItem (e) {
		var newIndex = e.target.value;
		this.setState({
			selectedImage: newIndex
		})
	},

	renderImages () {
		return this.props.images.map((item, index) => {
			var itemClass = klass.ITEM(this._isSlider(), index, this.state.selectedImage);
			
			return (
				<li key={index} ref={"item" + index} className={itemClass}
					style={{width: this._isSlider() && this.imageWidth}} 
					onClick={this.triggerOnSelectImage.bind(this, index)}>
					{item}
				</li>
			);
		});
					
	},

	renderControls () {
		if (!this.props.showControls) {
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

	renderStatus () {
		if (!this.props.showStatus) {
			return null
		}
		return <p className="carousel-status">{this.state.selectedImage + 1} of {this.props.images.length}</p>;
	}, 

	render () {
		if (this.props.images.length === 0) {
			return null;
		}

		var showPrevArrow = this.showArrows && this.props.images.length > 1;
		var showNextArrow = this.showArrows && this.props.images.length > 1;

		// obj to hold the transformations and styles
		var itemListStyles = {};
		
		// hold the last position in the component context to calculate the delta on swiping
		this.currentPosition = (this.wrapperWidth - this.imageWidth) / 2 - (this.imageWidth * this.state.selectedImage);

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
				  	  'width': this.lastElementPosition
			}
		} else {
			// if 3d isn't available we will use left to move
			itemListStyles = {
				left: this.currentPosition,
				width: this.lastElementPosition
			}
		}

		return (
			<div className={klass.CAROUSEL(this._isSlider(), this.state.animate)}>
				<button className={klass.ARROW_LEFT(!showPrevArrow)} onClick={this.slideRight} />
				
				<div className={klass.WRAPPER(this._isSlider())} ref="itemsWrapper">
					<ul className={klass.SLIDER(this._isSlider(), this.state.swiping)} style={itemListStyles} ref="itemList">
						{ this.renderImages() }
					</ul>
				</div>

				<button className={klass.ARROW_RIGHT(!showNextArrow)} onClick={this.slideLeft} />
				
				{ this.renderControls() }
				{ this.renderStatus() }
			</div>
		);
		
	}
});

