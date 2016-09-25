webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(5);

	var helpers = __webpack_require__(3),
	    inputColorByTextColor = $('input_color_by__text__color'),
	    CSS_COLOR_NAMES = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RebeccaPurple", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];

	var datalist = document.createElement('datalist'),
	    dataListSelect = document.createElement('select'),
	    cssNamesOptGroup = createOptGroup('Color Names', CSS_COLOR_NAMES);

	datalist.setAttribute('id', 'input_color_by__text__datalist');
	datalist.setAttribute('name', 'input_color_by__text__datalist');
	dataListSelect.setAttribute('id', 'input_color_by__text__select');
	dataListSelect.setAttribute('name', 'input_color_by__text__color');

	cssNamesOptGroup.innerHTML = '<option value="">Hexadecimal</option>' + cssNamesOptGroup.innerHTML, dataListSelect.appendChild(cssNamesOptGroup);

	var colorLabel = function () {
	  var label = document.createElement('label');
	  label.setAttribute('for', 'input_color_by__text__color');
	  label.innerHTML = 'Color Name:';
	  return label;
	}();

	datalist.appendChild(colorLabel);
	datalist.appendChild(dataListSelect);
	datalist.appendChild(createOptGroup('Swatches', ['#FF0000', '#00FF00', '#0000FF'], false));

	dataListSelect.addEventListener('change', function (event) {
	  inputColorByTextColor.value = event.target.value;
	  inputColorByTextColor.dispatchEvent(new Event('change'));
	});

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

/***/ 5:
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

});