/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

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

	'use strict';

	__webpack_require__(4);

	var helpers = __webpack_require__(3);

	var inputColorByTextColor = document.getElementById('input_color_by__text__color');

	var datalist = document.createElement('datalist');
	var dataListSelect = document.createElement('select');

	datalist.setAttribute('id', 'input_color_by__text__datalist');
	datalist.setAttribute('name', 'input_color_by__text__datalist');
	dataListSelect.setAttribute('id', 'input_color_by__text__select');
	dataListSelect.setAttribute('name', 'input_color_by__text__color');

	var CSS_COLOR_NAMES = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RebeccaPurple", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];

	var cssNamesOptGroup = createOptGroup('Color Names', CSS_COLOR_NAMES);
	cssNamesOptGroup.innerHTML = '<option value="">Hexadecimal</option>' + cssNamesOptGroup.innerHTML;
	var swatchOptGroup = createOptGroup('Swatches', ['#FF0000', '#00FF00', '#0000FF'], false);
	dataListSelect.appendChild(cssNamesOptGroup);
	console.log('optGroup', cssNamesOptGroup);

	/*let otherOptGroup = document.createElement('optgroup');
	let opt = document.createElement('option');
	otherOptGroup.setAttribute('label', ' Other');
	opt.innerHTML = 'Other';
	otherOptGroup.appendChild(opt);
	*/

	//dataListSelect.appendChild(otherOptGroup);


	var colorLabel = function () {
	  var label = document.createElement('label');
	  label.setAttribute('for', 'input_color_by__text__color');
	  label.innerHTML = 'Color Name:';
	  return label;
	}();

	datalist.appendChild(colorLabel);
	datalist.appendChild(dataListSelect);
	datalist.appendChild(swatchOptGroup);

	document.querySelector('.widget.import .svg-preview__svg').addEventListener('click', function (e) {
	  document.getElementById('pic').click();
	});

	//inputColorByTextColor.parentNode.appendChild(dataListSelect);

	inputColorByTextColor.setAttribute('list', datalist.getAttribute('id'));
	inputColorByTextColor.parentNode.appendChild(datalist);

	function createOptGroup(label, colors) {
	  var toHex = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	  var optGroup = document.createElement('optgroup');

	  optGroup.setAttribute('label', label);

	  colors.map(function (color) {
	    var opt = document.createElement('option');
	    opt.innerHTML = color;
	    if (toHex) {
	      var rgb = helpers.cssColorNameToRGB(color, true);
	      color = helpers.rgbToHex(rgb[0], rgb[1], rgb[2]);
	    }
	    opt.setAttribute('value', color);
	    optGroup.appendChild(opt);
	  });

	  return optGroup;
	}

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	'use strict';

	/*var invertColor = function (hexTripletColor) { // http://jsfiddle.net/salman/f9Re3/
	    var color = hexTripletColor;
	    color = color.substring(1); // remove #
	    color = parseInt(color, 16); // convert to integer
	    color = 0xFFFFFF ^ color; // invert three bytes
	    color = color.toString(16); // convert to hex
	    color = ("000000" + color).slice(-6); // pad with leading zeros
	    color = "#" + color; // prepend #
	    return color;
	}*/

	var cssColorNameToRGB = function cssColorNameToRGB(colorName) {
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

	var hexToRGB = function hexToRGB(hexo) {
	  if (!hexo) return undefined;
	  var hex = hexo.toString();
	  if (!hex.includes('0x')) return hexo;
	  var rgb = parseInt(hex, 16); // value is 1675421

	  var red = rgb >> 16 & 0xFF; // returns 255
	  var green = rgb >> 8 & 0xFF; // 170
	  var blue = rgb & 0xFF; // 221

	  return 'rgb(' + [red, green, blue].join(',') + ')';
	};

	var componentToHex = function componentToHex(c) {
	  var hex = c.toString(16);
	  return hex.length === 1 ? '0' + hex : hex;
	};

	var rgbToHex = function rgbToHex(r, g, b) {
	  return '#' + [r, g, b].map(componentToHex).join('');
	}; // http://stackoverflow.com/a/5624139/4671250

	module.exports = {
	  //invertColor: invertColor,
	  cssColorNameToRGB: cssColorNameToRGB,
	  hexToRGB: hexToRGB,
	  rgbToHex: rgbToHex
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*! modernizr 3.3.1 (Custom Build) | MIT *
	 * https://modernizr.com/download/?-datalistelem-setclasses !*/
	!function (e, n, t) {
	  function s(e, n) {
	    return (typeof e === "undefined" ? "undefined" : _typeof(e)) === n;
	  }function a() {
	    var e, n, t, a, o, i, f;for (var u in r) {
	      if (r.hasOwnProperty(u)) {
	        if (e = [], n = r[u], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length)) for (t = 0; t < n.options.aliases.length; t++) {
	          e.push(n.options.aliases[t].toLowerCase());
	        }for (a = s(n.fn, "function") ? n.fn() : n.fn, o = 0; o < e.length; o++) {
	          i = e[o], f = i.split("."), 1 === f.length ? Modernizr[f[0]] = a : (!Modernizr[f[0]] || Modernizr[f[0]] instanceof Boolean || (Modernizr[f[0]] = new Boolean(Modernizr[f[0]])), Modernizr[f[0]][f[1]] = a), l.push((a ? "" : "no-") + f.join("-"));
	        }
	      }
	    }
	  }function o(e) {
	    var n = u.className,
	        t = Modernizr._config.classPrefix || "";if (c && (n = n.baseVal), Modernizr._config.enableJSClass) {
	      var s = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");n = n.replace(s, "$1" + t + "js$2");
	    }Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t), c ? u.className.baseVal = n : u.className = n);
	  }function i() {
	    return "function" != typeof n.createElement ? n.createElement(arguments[0]) : c ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments);
	  }var l = [],
	      r = [],
	      f = { _version: "3.3.1", _config: { classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0 }, _q: [], on: function on(e, n) {
	      var t = this;setTimeout(function () {
	        n(t[e]);
	      }, 0);
	    }, addTest: function addTest(e, n, t) {
	      r.push({ name: e, fn: n, options: t });
	    }, addAsyncTest: function addAsyncTest(e) {
	      r.push({ name: null, fn: e });
	    } },
	      Modernizr = function Modernizr() {};Modernizr.prototype = f, Modernizr = new Modernizr();var u = n.documentElement,
	      c = "svg" === u.nodeName.toLowerCase(),
	      p = i("input"),
	      m = "autocomplete autofocus list placeholder max min multiple pattern required step".split(" "),
	      d = {};Modernizr.input = function (n) {
	    for (var t = 0, s = n.length; s > t; t++) {
	      d[n[t]] = !!(n[t] in p);
	    }return d.list && (d.list = !(!i("datalist") || !e.HTMLDataListElement)), d;
	  }(m), Modernizr.addTest("datalistelem", Modernizr.input.list), a(), o(l), delete f.addTest, delete f.addAsyncTest;for (var g = 0; g < Modernizr._q.length; g++) {
	    Modernizr._q[g]();
	  }e.Modernizr = Modernizr;
	}(window, document);

/***/ }
/******/ ]);