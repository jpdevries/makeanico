/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		1:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({"0":"app","2":"components/swatches","3":"lazy"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hexToRgba = __webpack_require__(4).hexToRgba,
	    rgbaToHex = __webpack_require__(4).rgbaToHex,
	    invertColor = function invertColor(hexTripletColor) {
	    // http://jsfiddle.net/salman/f9Re3/
	    var color = hexTripletColor;
	    color = color.substring(1); // remove #
	    color = parseInt(color, 16); // convert to integer
	    color = 0xFFFFFF ^ color; // invert three bytes
	    color = color.toString(16); // convert to hex
	    color = ("000000" + color).slice(-6); // pad with leading zeros
	    color = "#" + color; // prepend #
	    return color;
	},
	    cssColorNameToRGB = function cssColorNameToRGB(colorName) {
	    var returnArray = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	    // http://stackoverflow.com/a/1573154/4671250
	    var d = document.createElement("div");
	    d.style.color = colorName;
	    d.style.display = 'none';
	    document.body.appendChild(d);
	    //Color in RGB

	    var rgb = window.getComputedStyle(d).color;
	    d.remove();
	    if (!returnArray) return rgb;

	    rgb = rgb.replace('rgb(', '');
	    rgb = rgb.replace(')', '');
	    return rgb.split(',').map(function (color) {
	        return parseInt(color);
	    });
	};

	module.exports = {
	    invertColor: invertColor,
	    cssColorNameToRGB: cssColorNameToRGB,
	    hexToRGB: hexToRgba,
	    hexToRGBA: hexToRgba,
	    rgbToHex: rgbaToHex,
	    rgbaToHex: rgbaToHex
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';


	module.exports.rgbaToHex = function rgbaToHex(rgba_params_here)
	{
	    var arraytoHex = function(args) {
	        return args.map(function(e){ var r = (+e).toString(16); r.length==1 && (r='0'+r); return r; }).join('');
	    }

	    var args = Array.prototype.slice.call(arguments);       // Arguments to Array conversion
	    
	    if (args.length == 4)                                   // is with optional alpha value
	        args[3] = Math.floor(255 * args[3]);                // opacity float to 255-based value

	    return '#' + arraytoHex(args);
	}


	module.exports.hexToRgba = function hexToRgba(hex)
	{
	    var valid = new RegExp(/^#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i);

	    if (! valid.test(hex))
	        return false;

	    var code = hex.match(valid)[1];

	    if (code.length == 3 || code.length == 4)               // fix 3 and 4 letter codes
	        code = code.match(/./g).reduce( function(i,e) { return i+e+e; }, '');

	    var codePairs = code.match(/.{1,2}/g).map( function(e) { return parseInt(e, 16); });

	    if (codePairs.length == 4)
	        codePairs[3] = codePairs[3] / 255;
	    else
	        codePairs[3] = 1.0;

	    return codePairs;
	}

/***/ }
/******/ ]);