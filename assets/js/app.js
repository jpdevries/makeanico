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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var makeanico = __webpack_require__(2);

	document.addEventListener('DOMContentLoaded', function () {
	    var cf = new makeanico.MakeAnIco();

	    var lazy = document.createElement('script');
	    lazy.setAttribute('src', 'assets/js/lazy' + (production ? '.min' : '') + '.js');
	    document.body.appendChild(lazy);

	    (function (html) {
	        html.classList.remove('no-js');
	        html.classList.add('js');
	    })(document.querySelector('html'));
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var helpers = __webpack_require__(3);

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
	      cellInputs = document.querySelectorAll('#stage input[type="checkbox"]'),
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

	    if (params.length) {
	      updateView();
	    }
	  }

	  function addListenerMulti(el, s, fn) {
	    s.split().forEach(function (e) {
	      return el.addEventListener(e, fn, false);
	    });
	  }

	  function updateView() {
	    updateFavicon();
	    updateDownloadLinks();

	    var isBlank = !Object.keys(fillBack).length;
	    var dataDependents = document.querySelectorAll('.data-dependent');
	    for (var _i = 0; _i < dataDependents.length; _i++) {
	      isBlank ? dataDependents[_i].setAttribute('hidden', 'true') : dataDependents[_i].removeAttribute('hidden');
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

	  var fillColor = [255, 255, 255, 100];
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

	    for (var _i2 = 0; _i2 < 3; _i2++) {
	      //console.log('setting ' + i + ' to ' + fillColor[i], ranges[i]);
	      ranges[_i2].value = fillColor[_i2];
	    }

	    try {
	      inputColorByColorpicker.value = color;
	    } catch (e) {}

	    updateColorGrid(color);
	    //updateFavicon();
	    updateView();

	    localStorage.setItem('fillColor', color);

	    document.getElementById('start-over').removeAttribute('hidden');
	  }

	  function setRGBAttributes(element) {
	    element.setAttribute('data-dirty', 'true');
	    element.setAttribute('data-r', fillColor[0]);
	    element.setAttribute('data-g', fillColor[1]);
	    element.setAttribute('data-b', fillColor[2]);
	    element.setAttribute('data-a', rgb_slider_a.value);
	    element.style.backgroundColor = "rgba(" + fillColor[0] + ", " + fillColor[1] + ", " + fillColor[2] + ", " + rgb_slider_a.value + ")";
	    //element.style.opacity = rgb_slider_a.value;
	  }

	  function updateColorGrid(color) {
	    //console.log('updateColorGrid',color);
	    var checkedCells = document.querySelectorAll('#stage input[type="checkbox"]:checked'),
	        rgbASlider = document.getElementById('rgb_slider_a');

	    var alphaArray = helpers.hexToRGBA(color);
	    //console.log('yolo',alphaArray,helpers.rgbaToHex(alphaArray[0],alphaArray[1],alphaArray[2],Number(rgbASlider.value)), Number(rgbASlider.value));

	    for (var _i3 = 0; _i3 < checkedCells.length; _i3++) {
	      var key = checkedCells[_i3].getAttribute('id').replace('cell__', 'c');
	      //console.log(key,color.replace('#','0x'));

	      fillBack[key] = helpers.rgbaToHex(alphaArray[0], alphaArray[1], alphaArray[2], Number(rgbASlider.value)).replace('#', '0x');

	      var inputCheckbox = document.getElementById(checkedCells[_i3].for);
	      var invert = helpers.invertColor(color);

	      checkedCells[_i3].parentNode.style.backgroundColor = color;
	      checkedCells[_i3].parentNode.setAttribute('data-dirty', 'true');

	      setCellBorderFilterColor(checkedCells[_i3].parentNode.querySelector('label'), invert);

	      setRGBAttributes(checkedCells[_i3].parentNode);
	    }
	  }

	  function setCellBorderFilterColor(label, color) {
	    console.log('setCellBorderFilterColor', color);
	    label.style.boxShadow = "0 0 5px " + color;
	    label.style.outlineColor = "" + color;
	  }

	  function updateFaviconPreview() {
	    var rows = document.querySelectorAll('#stage tbody tr'),
	        svg = '';

	    var _loop = function _loop(_i4) {
	      var row = rows[_i4];
	      var rects = drawRow(row, _i4);

	      svg += rects.join('\n');

	      function drawRow(row, rowIndex) {
	        var rects = [];
	        var cells = row.querySelectorAll('td:not(.row-col)');
	        for (var _i6 = 0; _i6 < cells.length; _i6++) {
	          var cell = cells[_i6];
	          if (cell.getAttribute('data-dirty') == 'true') {
	            var rgb = [cell.getAttribute('data-r'), cell.getAttribute('data-g'), cell.getAttribute('data-b')];
	            var opacity = cell.getAttribute('data-a') ? " opacity=\"" + cell.getAttribute('data-a') + "\"" : '';
	            var color = helpers.rgbToHex(rgb[0], rgb[1], rgb[2]);

	            rects.push("<rect x=\"" + _i6 + "\" y=\"" + rowIndex + "\" width=\"1\" height=\"1\" fill=\"" + color + "\"" + opacity + "></rect>");
	          }
	        }
	        return rects;
	      }
	    };

	    for (var _i4 = 0; _i4 < rows.length; _i4++) {
	      _loop(_i4);
	    }

	    //document.querySelector('#svg-preview__svg #art').innerHTML = svg;
	    var svgs = document.querySelectorAll('.svg-preview__svg .art');
	    for (var _i5 = 0; _i5 < svgs.length; _i5++) {
	      svgs[_i5].innerHTML = svg;
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

	  var _loop2 = function _loop2(_i7) {
	    var range = ranges[_i7];
	    var index = _i7;
	    fillColor[_i7] = parseInt(range.value);

	    range.addEventListener('input', function (e) {
	      fillColor[index] = parseInt(e.target.value); // update the fill color
	      var color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2]); //convert RGB values to hex
	      updateColor(color);

	      inputColorByRGBRadio.checked = true;
	    });

	    range.addEventListener('change', function (e) {
	      pushState();
	      updateDownloadLinks();
	    });
	  };

	  for (var _i7 = 0; _i7 < ranges.length; _i7++) {
	    _loop2(_i7);
	  }

	  function handleInputColorByTextColorChange(e) {
	    document.getElementById('input_color_by__text').checked = true;
	    updateColor(e.target.value, false);
	    pushState();
	    updateDownloadLinks();
	  }

	  inputColorByTextColor.addEventListener('input', handleInputColorByTextColorChange);

	  inputColorByTextColor.addEventListener('change', handleInputColorByTextColorChange);

	  try {
	    inputColorByColorpicker.addEventListener('input', function (e) {
	      document.getElementById('input_color_by__text__colorpicker').checked = true;
	      updateColor(e.target.value);
	      updateDownloadLinks();
	    });

	    inputColorByColorpicker.addEventListener('change', function (e) {
	      pushState();
	      //console.log(event.target.value);
	    });
	  } catch (e) {
	    console.log(e);
	  }

	  document.querySelector('[no-js]').remove();
	  //document.querySelector('button[type="reset"]').remove();

	  document.querySelector('#cell-grid__container header').innerHTML += "<h3>Select Cells</h3><div class=\"async-btns flexible unaligned fieldset\">\n\n    <button id=\"select_all_cells\">Select all Cells</button>\n    <button id=\"unselect_all_cells\">Unselect all Cells</button>\n    <button id=\"inverse_selection\">Inverse Selection</button>\n  </div>";

	  var _loop3 = function _loop3(_i8) {
	    var cell = cellInputs[_i8];
	    //console.log(cell);
	    cell.addEventListener('click', function (e) {
	      if (e.target.checked) {
	        var color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2], 1);

	        var key = cell.getAttribute('id').replace('cell__', 'c');
	        fillBack[key] = color.replace('#', '0x');

	        if (fillCellsOnClick.checked) {
	          //e.target.parentNode.style.backgroundColor = `rgba(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]}, ${rgb_slider_a.value})`;
	          //e.target.parentNode.style.opacity = rgb_slider_a.value;
	          setRGBAttributes(e.target.parentNode);
	          setCellBorderFilterColor(e.target.parentNode.querySelector('label'), helpers.invertColor(helpers.rgbToHex(parseInt(e.target.parentNode.getAttribute('data-r')), parseInt(e.target.parentNode.getAttribute('data-g')), parseInt(e.target.parentNode.getAttribute('data-b')))));
	        }

	        pushState();
	      }

	      updateView();
	      //updateFavicon();
	      //updateDownloadLinks();
	    });
	  };

	  for (var _i8 = 0; _i8 < cellInputs.length; _i8++) {
	    _loop3(_i8);
	  }

	  document.getElementById('select_all_cells').addEventListener('click', function (e) {
	    e.preventDefault();
	    for (var _i9 = 0; _i9 < cellInputs.length; _i9++) {
	      cellInputs[_i9].checked = true;
	    }
	  });

	  document.getElementById('unselect_all_cells').addEventListener('click', function (e) {
	    e.preventDefault();

	    for (var _i10 = 0; _i10 < cellInputs.length; _i10++) {
	      cellInputs[_i10].checked = false;
	    }unFocusTDCells();
	  });

	  document.getElementById('inverse_selection').addEventListener('click', function (e) {
	    e.preventDefault();
	    for (var _i11 = 0; _i11 < cellInputs.length; _i11++) {
	      cellInputs[_i11].checked = !cellInputs[_i11].checked;
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
	    for (var _i12 = 0; _i12 < cellInputs.length; _i12++) {
	      var _cell = cellInputs[_i12];
	      _cell.checked = false;
	      _cell.parentNode.removeAttribute('style');
	    }
	  }

	  function updateDownloadLinks() {
	    //console.log('updateDownloadLinks', location.search);
	    var downloadAnchors = document.querySelectorAll('a[download]');
	    for (var _i13 = 0; _i13 < downloadAnchors.length; _i13++) {
	      var a = downloadAnchors[_i13];
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
	    //console.log(document.getElementById('fill-selected-cells'), e.target.checked);
	    e.target.checked ? document.getElementById('fill-selected-cells').setAttribute('disabled', 'true') : document.getElementById('fill-selected-cells').removeAttribute('disabled');
	  });

	  document.getElementById('filename__text').addEventListener('input', function (e) {
	    var filenames = document.querySelectorAll('.filename');
	    for (var _i14 = 0; _i14 < filenames.length; _i14++) {
	      filenames[_i14].innerHTML = e.target.value ? e.target.value : 'favicon';
	    }

	    var anchors = document.querySelectorAll('nav.button-bar a');
	    for (var _i15 = 0; _i15 < anchors.length; _i15++) {
	      var anchor = anchors[_i15];
	      anchor.setAttribute('download', (e.target.value || 'favicon') + "." + anchor.getAttribute('data-format'));
	    }
	  });

	  var downloadBtns = document.querySelectorAll('input[name="download__as"]');
	  for (var _i16 = 0; _i16 < downloadBtns.length; _i16++) {
	    var downloadBtn = downloadBtns[_i16];

	    downloadBtn.addEventListener('change', function (e) {
	      var anchors = document.querySelectorAll('nav.button-bar a');

	      for (var _i17 = 0; _i17 < anchors.length; _i17++) {
	        var anchor = anchors[_i17];
	        e.target.value == anchor.getAttribute('data-format') ? anchor.removeAttribute('hidden') : anchor.setAttribute('hidden', 'true');
	        //console.log(`${event.target.value}.${anchor.getAttribute('data-format')}`);
	      }

	      var extensions = document.querySelectorAll('.extension');
	      for (var _i18 = 0; _i18 < extensions.length; _i18++) {
	        extensions[_i18].innerHTML = e.target.value;
	      }
	    });
	  }

	  var tds = document.querySelectorAll('#stage td');
	  for (var _i19 = 0; _i19 < tds.length; _i19++) {
	    var td = tds[_i19];
	    /*td.addEventListener('change', function(event){
	      if(!event.target.checked) {
	        let label = document.querySelector(`label[for="${event.target.getAttribute('id')}"]`);
	        label.style.removeProperty('boxShadow');
	        label.style.removeProperty('borderColor');
	      } else {
	        //console.log(event.target.parentNode.style.backgroundColor);
	      }
	    });*/

	    // td.querySelector('input[type="checkbox"]').addEventListener('change', function(event) {
	    //   console.log(event);
	    // });
	  }

	  // document.getElementById('makeanico').addEventListener("blur", function(event) {
	  //   console.log('blur');
	  // }, true);

	  document.getElementById('stage').addEventListener("change", function (event) {
	    console.log(event);
	    unFocusTDCells();
	  });

	  function unFocusTDCells() {
	    console.log('unFocusTDCells');
	    for (var _i20 = 0; _i20 < cellInputs.length; _i20++) {
	      if (!cellInputs[_i20].checked) {
	        try {
	          var label = cellInputs[_i20].parentNode.querySelector('label');
	          unFocusTDCell(label);
	        } catch (e) {}
	      }
	    }
	  }

	  function unFocusTDCell(cell) {
	    cell.style.removeProperty('box-shadow');
	    cell.style.removeProperty('border-color');
	  }

	  window.onpopstate = function (event) {
	    clearBoard(); // clear the art board

	    fillBack = event.state; // set the new state

	    Object.keys(fillBack).forEach(function (key) {
	      // draw the new state
	      setRGBAttributes(document.getElementById(key.replace('c', 'cell__')).parentNode);
	    });

	    window.scrollTo(0, 0); // scroll to the top
	  };
	};

	exports.MakeAnIco = MakeAnIco;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var invertColor = function invertColor(hexTripletColor) {
	  // http://jsfiddle.net/salman/f9Re3/
	  var color = hexTripletColor;
	  color = color.substring(1); // remove #
	  color = parseInt(color, 16); // convert to integer
	  color = 0xFFFFFF ^ color; // invert three bytes
	  color = color.toString(16); // convert to hex
	  color = ("000000" + color).slice(-6); // pad with leading zeros
	  color = "#" + color; // prepend #
	  return color;
	};

	var hexToRgba = __webpack_require__(4).hexToRgba;
	var rgbaToHex = __webpack_require__(4).rgbaToHex;

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

	/*var hexToRGB = function(hexo, returnArray = false) {
	  if(!hexo) return undefined;
	  var hex = hexo.toString();
	  if(!hex.includes('0x')) return hexo;
	  var rgb = parseInt(hex, 16); // value is 1675421

	  var red   = (rgb >> 16) & 0xFF; // returns 255
	  var green = (rgb >> 8) & 0xFF;  // 170
	  var blue  = rgb & 0xFF;     // 221

	  if(returnArray) return [red,green,blue];

	  return `rgb(${[red,green,blue].join(',')})`;
	}*/

	/*
	const rgbToHex = (r, g, b) => '#' + [r, g, b].map((c) => {
	  const hex = c.toString(16);
	  return hex.length === 1 ? '0' + hex : hex;
	}).join(''); // http://stackoverflow.com/a/5624139/4671250
	*/

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