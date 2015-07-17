/** @jsx React.DOM */
var React = require('react');
var ImageGallery = require('./components/ImageGallery');
var Carousel = require('./components/Carousel');

var galleryImages = [
	<img src="http://lorempixel.com/700/250/sports/1" key="1" />,
	<img src="http://lorempixel.com/700/250/sports/2" key="2" />,
	<img src="http://lorempixel.com/700/250/sports/3" key="3" />,
	<img src="http://lorempixel.com/700/250/sports/4" key="4" />,
	<img src="http://lorempixel.com/700/250/sports/5" key="5" />,
	<img src="http://lorempixel.com/700/250/sports/6" key="6" />,
	<img src="http://lorempixel.com/700/250/sports/7" key="7" />
];

var sliderImages = [
	<img src="http://lorempixel.com/960/400/nature/1" key="1" />,
	<img src="http://lorempixel.com/960/400/nature/2" key="2" />,
	<img src="http://lorempixel.com/960/400/nature/3" key="3" />,
	<img src="http://lorempixel.com/960/400/nature/4" key="4" />,
	<img src="http://lorempixel.com/960/400/nature/5" key="5" />,
	<img src="http://lorempixel.com/960/400/nature/6" key="6" />,
	<img src="http://lorempixel.com/960/400/nature/7" key="7" />
];

var carouselImages = [
	<img src="http://lorempixel.com/70/70/animals/1" key="1" />,
	<img src="http://lorempixel.com/70/70/animals/2" key="2" />,
	<img src="http://lorempixel.com/70/70/animals/3" key="3" />,
	<img src="http://lorempixel.com/70/70/animals/4" key="4" />,
	<img src="http://lorempixel.com/70/70/animals/5" key="5" />,
	<img src="http://lorempixel.com/70/70/animals/6" key="6" />,
	<img src="http://lorempixel.com/70/70/animals/7" key="7" />,
	<img src="http://lorempixel.com/70/70/animals/8" key="8" />,
	<img src="http://lorempixel.com/70/70/animals/9" key="9" />,
	<img src="http://lorempixel.com/70/70/animals/10" key="10" />,
	<img src="http://lorempixel.com/70/70/animals/11" key="11" />,
	<img src="http://lorempixel.com/70/70/animals/12" key="12" />,
	<img src="http://lorempixel.com/70/70/animals/13" key="13" />,
	<img src="http://lorempixel.com/70/70/animals/14" key="14" />,
	<img src="http://lorempixel.com/70/70/animals/15" key="15" />,
	<img src="http://lorempixel.com/70/70/animals/16" key="16" />,
	<img src="http://lorempixel.com/70/70/animals/17" key="17" />,
	<img src="http://lorempixel.com/70/70/animals/18" key="18" />,
	<img src="http://lorempixel.com/70/70/animals/19" key="19" />,
	<img src="http://lorempixel.com/70/70/animals/20" key="20" />
];

var DemoGallery = React.createClass({
	render() {
		return (
			<div className="demo-image-gallery">
				<ImageGallery images={ galleryImages } />
			</div>
		);
	}
});

var DemoSliderControls = React.createClass({
	render() {
		return (
			<div className="demo-slider">
				<Carousel type="slider" items={ sliderImages } showControls={true} showStatus={true} />
			</div>
		);
	}
});

var DemoCarousel = React.createClass({
	render() {
		return (
			<div className="demo-carousel">
				<Carousel items={ carouselImages } />
			</div>
		);
	}
});

React.render(<DemoGallery />, document.querySelector('.demo-gallery'));
React.render(<DemoSliderControls />, document.querySelector('.demo-slider-controls'));
React.render(<DemoCarousel />, document.querySelector('.demo-carousel'));

