/** @jsx React.DOM */
var React = require('react');
var ImageGallery = require('./components/ImageGallery');
var Carousel = require('./components/Carousel');

window.React = React;

var galleryImages = [
	React.createElement("img", {src: "http://lorempixel.com/700/250/sports/1", key: "1"}),
	React.createElement("img", {src: "http://lorempixel.com/700/250/sports/2", key: "2"}),
	React.createElement("img", {src: "http://lorempixel.com/700/250/sports/3", key: "3"}),
	React.createElement("img", {src: "http://lorempixel.com/700/250/sports/4", key: "4"}),
	React.createElement("img", {src: "http://lorempixel.com/700/250/sports/5", key: "5"}),
	React.createElement("img", {src: "http://lorempixel.com/700/250/sports/6", key: "6"}),
	React.createElement("img", {src: "http://lorempixel.com/700/250/sports/7", key: "7"})
	// ,
	// <img src="http://lorempixel.com/700/250/sports/2" key="8" />,
	// <img src="http://lorempixel.com/700/250/sports/3" key="9" />,
	// <img src="http://lorempixel.com/700/250/sports/4" key="10" />,
	// <img src="http://lorempixel.com/700/250/sports/5" key="11" />,
	// <img src="http://lorempixel.com/700/250/sports/6" key="11" />,
	// <img src="http://lorempixel.com/700/250/sports/7" key="12" />,
	// <img src="http://lorempixel.com/700/250/sports/2" key="13" />,
	// <img src="http://lorempixel.com/700/250/sports/3" key="14" />,
	// <img src="http://lorempixel.com/700/250/sports/4" key="15" />,
	// <img src="http://lorempixel.com/700/250/sports/5" key="16" />,
	// <img src="http://lorempixel.com/700/250/sports/6" key="17" />,
	// <img src="http://lorempixel.com/700/250/sports/7" key="18" />,
	// <img src="http://lorempixel.com/700/250/sports/2" key="19" />,
	// <img src="http://lorempixel.com/700/250/sports/3" key="20" />,
	// <img src="http://lorempixel.com/700/250/sports/4" key="21" />,
	// <img src="http://lorempixel.com/700/250/sports/5" key="22" />,
	// <img src="http://lorempixel.com/700/250/sports/6" key="23" />,
	// <img src="http://lorempixel.com/700/250/sports/7" key="24" />
];

var sliderImages = [
	React.createElement("img", {src: "http://lorempixel.com/960/400/nature/1", key: "1"}),
	React.createElement("img", {src: "http://lorempixel.com/960/400/nature/2", key: "2"}),
	React.createElement("img", {src: "http://lorempixel.com/960/400/nature/3", key: "3"}),
	React.createElement("img", {src: "http://lorempixel.com/960/400/nature/4", key: "4"}),
	React.createElement("img", {src: "http://lorempixel.com/960/400/nature/5", key: "5"}),
	React.createElement("img", {src: "http://lorempixel.com/960/400/nature/6", key: "6"}),
	React.createElement("img", {src: "http://lorempixel.com/960/400/nature/7", key: "7"})
];

var carouselImages = [
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/1", key: "1"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/2", key: "2"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/3", key: "3"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/4", key: "4"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/5", key: "5"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/6", key: "6"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/7", key: "7"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/8", key: "8"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/9", key: "9"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/10", key: "10"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/11", key: "11"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/12", key: "12"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/13", key: "13"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/14", key: "14"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/15", key: "15"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/16", key: "16"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/17", key: "17"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/18", key: "18"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/19", key: "19"}),
	React.createElement("img", {src: "http://lorempixel.com/70/70/animals/20", key: "20"})
];

var DemoGallery = React.createClass({displayName: "DemoGallery",
	render:function() {
		return (
			React.createElement("div", {className: "demo-image-gallery"}, 
				React.createElement(ImageGallery, {images: galleryImages, initialSelectedImage: 5})
			)
		);
	}
});

var DemoSliderControls = React.createClass({displayName: "DemoSliderControls",
	render:function() {
		return (
			React.createElement("div", {className: "demo-slider"}, 
				React.createElement(Carousel, {type: "slider", images: sliderImages, showControls: true, showStatus: true})
			)
		);
	}
});

var DemoCarousel = React.createClass({displayName: "DemoCarousel",
	render:function() {
		return (
			React.createElement("div", {className: "demo-carousel"}, 
				React.createElement(Carousel, {images: carouselImages })
			)
		);
	}
});

React.render(React.createElement(DemoGallery, null), document.querySelector('.demo-gallery'));
React.render(React.createElement(DemoSliderControls, null), document.querySelector('.demo-slider-controls'));
React.render(React.createElement(DemoCarousel, null), document.querySelector('.demo-carousel'));

