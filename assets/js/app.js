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

	var makeanico = __webpack_require__(1);

	document.addEventListener('DOMContentLoaded', function () {
	    var cf = new makeanico.MakeAnIco();

	    var lazy = document.createElement('script');
	    lazy.setAttribute('src', 'assets/js/lazy.min.js');
	    document.body.appendChild(lazy);

	    (function (html) {
	        html.classList.remove('no-js');
	        html.classList.add('js');
	    })(document.querySelector('html'));
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var helpers = __webpack_require__(2);

	var MakeAnIco = function MakeAnIco() {
	  var inputColorSupport = function () {
	    var i = document.createElement("input");
	    i.setAttribute("type", "color");
	    return i.type !== "text";
	  }();

	  if (inputColorSupport) {
	    // only add colorpicker option if the browser supports <input type="color">, auto select colorpicker option if no others are selected
	    (function (fieldset) {
	      fieldset.innerHTML = "<label for=\"input_color_by__colorpicker\">Colorpicker:</label>\n      <input type=\"color\" id=\"input_color_by__colorpicker\" name=\"input_color_by__colorpicker\" value=\"\" />";
	      fieldset.removeAttribute('hidden');
	    })(document.querySelector('.colorpicker.fieldset'));

	    (function (colorOption) {
	      colorOption.innerHTML = "<label for=\"input_color_by__text__colorpicker\">Colorpicker: </label>\n      <input type=\"radio\" id=\"input_color_by__text__colorpicker\" name=\"input_color_by\" value=\"colorpicker\" />";
	      colorOption.removeAttribute('hidden');
	    })(document.querySelector('.color.option'));

	    if (!(document.getElementById('input_color_by__text').checked || document.getElementById('input_color_by__rgb').checked)) inputColorByColorpicker.checked = true;
	  }

	  var form = document.getElementById('makeanico'),
	      ranges = document.querySelectorAll('input[type="range"]'),
	      cellInputs = document.querySelectorAll('#stage input'),
	      cellGridContainer = document.getElementById('cell-grid__container'),
	      inputColorByRGBRadio = document.getElementById('input_color_by__rgb'),
	      inputColorByTextColor = document.getElementById('input_color_by__text__color'),
	      inputColorByColorpicker = document.getElementById('input_color_by__colorpicker'),
	      fillCellsOnClick = document.getElementById('fill-cells-on-click');

	  // pull the initial URL params out and store them in a Object
	  var fillBack = {};
	  var origLocationSearch = location.search.charAt(0) == '?' ? location.search.substring(1) : '';
	  if (location.search.charAt(0) == '?') {
	    var params = origLocationSearch.split('&');

	    for (var i = 0; i < params.length; i++) {
	      var keyValue = params[i].split('=');
	      fillBack[keyValue[0]] = keyValue[1];
	    }
	  }

	  function pushState() {
	    var newURL = function () {
	      var a = [];

	      Object.keys(fillBack).forEach(function (key) {
	        a.push(key + "=" + fillBack[key]);
	      });

	      return a.join('&');
	    }();

	    window.history.pushState(fillBack, 'Makeanico', "/?" + newURL);
	  }

	  var fillColor = [255, 255, 255];
	  if (localStorage.getItem('fillColor')) {
	    updateColor(localStorage.getItem('fillColor'));
	  }

	  function updateColor(color) {
	    var updateTextField = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	    fillColor = helpers.cssColorNameToRGB(color.replace('0x', '#'), true);
	    var wasHex = color.charCodeAt(0) == '#';
	    var wasBlack = wasHex ? color == '#000000' || color == '#000' : color.toLowerCase() == 'black';
	    color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2]);

	    if (!wasHex && !wasBlack && color == '#000000') return;

	    cellGridContainer.classList.add('dirty');
	    cellGridContainer.style.borderColor = color;

	    if (updateTextField) inputColorByTextColor.value = color;

	    for (var _i = 0; _i < ranges.length; _i++) {
	      ranges[_i].value = fillColor[_i];
	    }try {
	      inputColorByColorpicker.value = color;
	    } catch (e) {}

	    updateColorGrid(color);
	    updateFavicon();

	    localStorage.setItem('fillColor', color);

	    document.getElementById('start-over').removeAttribute('hidden');
	  }

	  function updateColorGrid(color) {
	    var checkedCells = document.querySelectorAll('#stage input[type="checkbox"]:checked');
	    for (var _i2 = 0; _i2 < checkedCells.length; _i2++) {
	      var key = checkedCells[_i2].getAttribute('id').replace('cell__', 'c');
	      //console.log(key,color.replace('#','0x'));
	      fillBack[key] = color.replace('#', '0x');
	      checkedCells[_i2].parentNode.style.backgroundColor = color;
	      checkedCells[_i2].parentNode.setAttribute('data-dirty', 'true');
	    }
	  }

	  function updateFaviconPreview() {
	    var rows = document.querySelectorAll('#stage tbody tr'),
	        svg = '';

	    var _loop = function _loop(_i3) {
	      var row = rows[_i3];
	      var rects = drawRow(row, _i3);

	      svg += rects.join('\n');

	      function drawRow(row, rowIndex) {
	        var rects = [];
	        var cells = row.querySelectorAll('td:not(.row-col)');
	        for (var _i5 = 0; _i5 < cells.length; _i5++) {
	          var cell = cells[_i5];
	          if (cell.getAttribute('data-dirty') == 'true') {
	            var rgb = helpers.cssColorNameToRGB(cell.style.backgroundColor, true);
	            var color = helpers.rgbToHex(rgb[0], rgb[1], rgb[2]);

	            rects.push("<rect x=\"" + _i5 + "\" y=\"" + rowIndex + "\" width=\"1\" height=\"1\" fill=\"" + color + "\"></rect>");
	          }
	        }
	        return rects;
	      }
	    };

	    for (var _i3 = 0; _i3 < rows.length; _i3++) {
	      _loop(_i3);
	    }

	    //document.querySelector('#svg-preview__svg #art').innerHTML = svg;
	    var svgs = document.querySelectorAll('.svg-preview__svg');
	    for (var _i4 = 0; _i4 < svgs.length; _i4++) {
	      svgs[_i4].querySelector('.art').innerHTML = svg;
	    }
	  }

	  function updateFavicon() {
	    updateFaviconPreview();

	    var canvas = document.createElement('canvas'),
	        ctx = void 0,
	        img = document.createElement('img'),
	        link = document.getElementById('favicon'),
	        svgHTML = encodeURIComponent(document.querySelector('.svg-preview__svg').outerHTML);

	    if (canvas.getContext) {
	      canvas.height = canvas.width = 16; // set the size
	      ctx = canvas.getContext('2d');

	      img.onload = function () {
	        // once the image has loaded
	        ctx.drawImage(this, 0, 0);
	        link.href = canvas.toDataURL('image/png');
	      };
	      img.src = "data:image/svg+xml," + svgHTML;
	    }
	  }

	  var _loop2 = function _loop2(_i6) {
	    var range = ranges[_i6];
	    var index = _i6;
	    fillColor[_i6] = parseInt(range.value);

	    range.addEventListener('input', function (e) {
	      fillColor[index] = parseInt(e.target.value); // update the fill color
	      console.log(fillColor);
	      var color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2]); //convert RGB values to hex
	      updateColor(color);

	      inputColorByRGBRadio.checked = true;
	    });

	    range.addEventListener('change', function (e) {
	      pushState();
	      updateDownloadLinks();
	    });
	  };

	  for (var _i6 = 0; _i6 < ranges.length; _i6++) {
	    _loop2(_i6);
	  }

	  inputColorByTextColor.addEventListener('input', function (e) {
	    document.getElementById('input_color_by__text').checked = true;
	    updateColor(e.target.value, false);
	    pushState();
	    updateDownloadLinks();
	  });

	  try {
	    inputColorByColorpicker.addEventListener('input', function (e) {
	      document.getElementById('input_color_by__text__colorpicker').checked = true;
	      updateColor(e.target.value);
	      updateDownloadLinks();
	    });

	    inputColorByColorpicker.addEventListener('change', function (e) {
	      pushState();
	      console.log(event.target.value);
	    });
	  } catch (e) {
	    console.log(e);
	  }

	  document.querySelector('button[type="submit"]').remove();
	  document.querySelector('button[type="reset"]').remove();

	  document.querySelector('#cell-grid__container header').innerHTML += "<h3>Select Cells</h3><div class=\"async-btns flexible unaligned fieldset\">\n\n    <button id=\"select_all_cells\">Select all Cells</button>\n    <button id=\"unselect_all_cells\">Unselect all Cells</button>\n    <button id=\"inverse_selection\">Inverse Selection</button>\n  </div>";

	  var _loop3 = function _loop3(_i7) {
	    var cell = cellInputs[_i7];
	    //console.log(cell);
	    cell.addEventListener('click', function (e) {
	      if (e.target.checked) {
	        var color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2]);

	        var key = cell.getAttribute('id').replace('cell__', 'c');
	        fillBack[key] = color.replace('#', '0x');

	        if (fillCellsOnClick.checked) {
	          e.target.parentNode.style.backgroundColor = color;
	          e.target.parentNode.setAttribute('data-dirty', 'true');
	        }

	        pushState();
	      }

	      updateFavicon();
	      updateDownloadLinks();
	    });
	  };

	  for (var _i7 = 0; _i7 < cellInputs.length; _i7++) {
	    _loop3(_i7);
	  }

	  document.getElementById('select_all_cells').addEventListener('click', function (e) {
	    e.preventDefault();
	    for (var _i8 = 0; _i8 < cellInputs.length; _i8++) {
	      cellInputs[_i8].checked = true;
	    }
	  });

	  document.getElementById('unselect_all_cells').addEventListener('click', function (e) {
	    e.preventDefault();
	    for (var _i9 = 0; _i9 < cellInputs.length; _i9++) {
	      cellInputs[_i9].checked = false;
	    }
	  });

	  document.getElementById('inverse_selection').addEventListener('click', function (e) {
	    e.preventDefault();
	    for (var _i10 = 0; _i10 < cellInputs.length; _i10++) {
	      cellInputs[_i10].checked = !cellInputs[_i10].checked;
	    }
	  });

	  document.addEventListener('keydown', function (event) {
	    //console.log(event);
	    if (event.ctrlKey && event.which === 65) {
	      // ctrl + a
	      document.getElementById('select_all_cells').click();
	    }

	    if (event.ctrlKey && event.which === 68) {
	      // ctrl + d
	      document.getElementById('unselect_all_cells').click();
	    }

	    if (event.ctrlKey && event.which === 73) {
	      // ctrl + i
	      document.getElementById('inverse_selection').click();
	    }

	    if (event.ctrlKey && event.which === 8) {
	      // ctrl + backspace
	      document.getElementById('inverse_selection').click();
	    }
	  });

	  function clearBoard() {
	    for (var _i11 = 0; _i11 < cellInputs.length; _i11++) {
	      var _cell = cellInputs[_i11];
	      _cell.checked = false;
	      _cell.parentNode.removeAttribute('style');
	    }
	  }

	  function updateDownloadLinks() {
	    console.log('updateDownloadLinks', location.search);
	    var downloadAnchors = document.querySelectorAll('a[download]');
	    for (var _i12 = 0; _i12 < downloadAnchors.length; _i12++) {
	      var a = downloadAnchors[_i12];
	      a.setAttribute('href', a.getAttribute('data-base-url') + location.search + '&dl=1');
	    }
	  }

	  document.querySelector('#start-over a').addEventListener('click', function (e) {
	    e.preventDefault();

	    window.history.pushState({}, 'Makeanico', "/");
	    clearBoard();

	    form.reset();
	    cellGridContainer.removeAttribute('style');
	    cellGridContainer.classList.remove('dirty');

	    window.scrollTo(0, 0);
	  });

	  document.querySelector('.instructions').innerHTML = "Select cells above to fill them with the color chosen&nbsp;below.";

	  fillCellsOnClick.addEventListener('change', function (e) {
	    e.target.checked ? document.getElementById('fill-selected-cells').setAttribute('disabled', 'true') : document.getElementById('fill-selected-cells').removeAttribute('disabled');
	  });

	  document.getElementById('filename__text').addEventListener('input', function (e) {
	    var filenames = document.querySelectorAll('.filename');
	    for (var _i13 = 0; _i13 < filenames.length; _i13++) {
	      filenames[_i13].innerHTML = e.target.value ? e.target.value : 'favicon';
	    }

	    var anchors = document.querySelectorAll('nav.button-bar a');
	    for (var _i14 = 0; _i14 < anchors.length; _i14++) {
	      var anchor = anchors[_i14];
	      anchor.setAttribute('download', (e.target.value || 'favicon') + "." + anchor.getAttribute('data-format'));
	    }
	  });

	  var downloadBtns = document.querySelectorAll('input[name="download__as"]');
	  for (var _i15 = 0; _i15 < downloadBtns.length; _i15++) {
	    var downloadBtn = downloadBtns[_i15];

	    downloadBtn.addEventListener('change', function (e) {
	      var anchors = document.querySelectorAll('nav.button-bar a');

	      for (var _i16 = 0; _i16 < anchors.length; _i16++) {
	        var anchor = anchors[_i16];
	        e.target.value == anchor.getAttribute('data-format') ? anchor.removeAttribute('hidden') : anchor.setAttribute('hidden', 'true');
	        console.log(event.target.value + "." + anchor.getAttribute('data-format'));
	      }

	      var extensions = document.querySelectorAll('.extension');
	      for (var _i17 = 0; _i17 < extensions.length; _i17++) {
	        extensions[_i17].innerHTML = e.target.value;
	      }
	    });
	  }

	  window.onpopstate = function (event) {
	    clearBoard(); // clear the art board

	    fillBack = event.state; // set the new state

	    Object.keys(fillBack).forEach(function (key) {
	      // draw the new state
	      document.getElementById(key.replace('c', 'cell__')).parentNode.style.backgroundColor = fillBack[key].replace('0x', '#');
	    });

	    window.scrollTo(0, 0); // scroll to the top
	  };
	};

	exports.MakeAnIco = MakeAnIco;

/***/ },
/* 2 */
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
	  console.log('rgb', rgb);
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

/***/ }
/******/ ]);