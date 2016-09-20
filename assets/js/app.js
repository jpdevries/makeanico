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
	      fillCellsOnClick = document.getElementById('fill-cells-on-click'),
	      rgbASlider = document.getElementById('rgb_slider_a');

	  var sKeyDown = false;

	  document.getElementById('stage').addEventListener('keydown', function (e) {
	    sKeyDown = e.key == 's' || false;
	  });

	  document.getElementById('stage').addEventListener('keyup', function (e) {
	    sKeyDown = false;
	  });

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

	  var lastClickedCellInput = void 0;

	  (function () {
	    var trs = document.querySelectorAll("#stage tbody tr");
	    for (var i = 0; i < trs.length; i++) {
	      var tds = trs[i].querySelectorAll('td');
	      for (var j = 1; j < tds.length; j++) {
	        tds[j].setAttribute('data-row', i);
	        tds[j].setAttribute('data-col', j - 1);
	      }
	    }
	  })();

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

	  var fillColor = [255, 255, 255, 100];
	  if (localStorage.getItem('fillColor')) {
	    updateColor(localStorage.getItem('fillColor'));
	  }

	  function updateColor(color) {
	    var updateTextField = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	    var doUpdateColorGrid = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	    fillColor = helpers.hexToRGBA(color);
	    var wasHex = color.charAt(0) == '#';
	    var wasBlack = wasHex ? color == '#000000' || color == '#000' : color.toLowerCase() == 'black';

	    if (!wasHex && !wasBlack && color == '#000000') return;

	    cellGridContainer.classList.add('dirty');
	    cellGridContainer.style.borderColor = "rgba(" + fillColor[0] + "," + fillColor[1] + "," + fillColor[2] + "," + (fillColor[3] == undefined ? 1 : fillColor[3]) + ")";

	    if (updateTextField) inputColorByTextColor.value = color;

	    for (var _i2 = 0; _i2 < 3; _i2++) {
	      //console.log('setting ' + i + ' to ' + fillColor[i], ranges[i]);
	      ranges[_i2].value = fillColor[_i2];
	    }

	    try {
	      inputColorByColorpicker.value = color;
	    } catch (e) {}

	    if (doUpdateColorGrid) updateColorGrid(color);
	    //updateFavicon();
	    updateView();

	    localStorage.setItem('fillColor', color);

	    document.getElementById('start-over').removeAttribute('hidden');
	  }

	  function setRGBAttributes(element) {
	    var color = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

	    var alpha = rgb_slider_a.value;

	    if (color) {
	      color = helpers.hexToRGBA(color);
	      color[3] = color[3] == undefined ? 1 : color[3];
	    } else {
	      color = fillColor;
	    }

	    element.setAttribute('data-dirty', 'true');
	    element.setAttribute('data-r', color[0]);
	    element.setAttribute('data-g', color[1]);
	    element.setAttribute('data-b', color[2]);
	    element.setAttribute('data-a', rgb_slider_a.value);
	    element.style.backgroundColor = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + alpha + ")";
	  }

	  function updateColorGrid(color) {
	    var checkedCells = document.querySelectorAll('#stage input[type="checkbox"]:checked'),
	        alphaArray = helpers.hexToRGBA(color);

	    for (var _i3 = 0; _i3 < checkedCells.length; _i3++) {
	      var key = checkedCells[_i3].getAttribute('id').replace('cell__', 'c');

	      fillBack[key] = helpers.rgbaToHex(alphaArray[0], alphaArray[1], alphaArray[2], Number(rgbASlider.value)).replace('#', '0x');

	      try {
	        checkedCells[_i3].parentNode.querySelector('input[type="hidden"]').setAttribute('value', fillBack[key]);
	      } catch (e) {}

	      setRGBAttributes(checkedCells[_i3].parentNode);
	      setCellBorderFilterColor(checkedCells[_i3].parentNode.querySelector('label'), helpers.invertColor(color));
	    }
	  }

	  function setCellBorderFilterColor(label, color) {
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
	    });
	  } catch (e) {
	    console.log(e);
	  }

	  document.querySelector('[no-js]').remove();

	  document.querySelector('#cell-grid__container header').innerHTML += "<h3>Select Cells</h3><div class=\"async-btns flexible unaligned fieldset\">\n    <button id=\"select_all_cells\">Select all Cells</button>\n    <button id=\"unselect_all_cells\">Unselect all Cells</button>\n    <button id=\"inverse_selection\">Inverse Selection</button>\n  </div>";

	  var _loop3 = function _loop3(_i9) {
	    var cell = cellInputs[_i9];

	    cell.addEventListener('click', function (e) {
	      if ((e.altKey || sKeyDown) && lastClickedCellInput) {
	        var rows = document.querySelectorAll('#stage tbody tr');
	        var start = Math.min(lastClickedCellInput.parentNode.getAttribute('data-row'), e.target.parentNode.getAttribute('data-row'));

	        for (_i9 = start; _i9 <= start + Math.abs(parseInt(lastClickedCellInput.parentNode.getAttribute('data-row')) - parseInt(e.target.parentNode.getAttribute('data-row'))); _i9++) {
	          var tr = rows[_i9];
	          var tds = tr.querySelectorAll('td');
	          for (var j = 1 + Math.min(lastClickedCellInput.parentNode.getAttribute('data-col'), e.target.parentNode.getAttribute('data-col')); j <= 1 + Math.max(lastClickedCellInput.parentNode.getAttribute('data-col'), e.target.parentNode.getAttribute('data-col')); j++) {
	            var td = tds[j];
	            var checkbox = td.querySelector('input[type="checkbox"]');

	            if (e.target.parentNode !== td && lastClickedCellInput.parentNode !== td) {
	              checkbox.checked = true;
	              if (fillCellsOnClick.checked) {
	                setRGBAttributes(td);
	              }
	            }
	          }
	        }
	      }

	      if (e.target.checked) {
	        var color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2], 1);

	        var key = cell.getAttribute('id').replace('cell__', 'c');
	        fillBack[key] = color.replace('#', '0x');

	        if (fillCellsOnClick.checked) {
	          setRGBAttributes(e.target.parentNode);
	          setCellBorderFilterColor(e.target.parentNode.querySelector('label'), helpers.invertColor(helpers.rgbToHex(parseInt(e.target.parentNode.getAttribute('data-r')), parseInt(e.target.parentNode.getAttribute('data-g')), parseInt(e.target.parentNode.getAttribute('data-b')))));
	        }

	        pushState();
	      }

	      updateView();
	      //updateFavicon();
	      //updateDownloadLinks();

	      lastClickedCellInput = e.target;
	    });
	    _i8 = _i9;
	  };

	  for (var _i8 = 0; _i8 < cellInputs.length; _i8++) {
	    _loop3(_i8);
	  }

	  /*                       __                                 __               __                     __                    __
	  /\ \                     /\ \                               /\ \             /\ \                   /\ \__                /\ \__
	  \ \ \/'\      __   __  __\ \ \____    ___      __     _ __  \_\ \        ____\ \ \___     ___   _ __\ \ ,_\   ___   __  __\ \ ,_\   ____
	  \ \ , <    /'__`\/\ \/\ \\ \ '__`\  / __`\  /'__`\  /\`'__\/'_` \      /',__\\ \  _ `\  / __`\/\`'__\ \ \/  /'___\/\ \/\ \\ \ \/  /',__\
	   \ \ \\`\ /\  __/\ \ \_\ \\ \ \L\ \/\ \L\ \/\ \L\.\_\ \ \//\ \L\ \    /\__, `\\ \ \ \ \/\ \L\ \ \ \/ \ \ \_/\ \__/\ \ \_\ \\ \ \_/\__, `\
	    \ \_\ \_\ \____\\/`____ \\ \_,__/\ \____/\ \__/.\_\\ \_\\ \___,_\   \/\____/ \ \_\ \_\ \____/\ \_\  \ \__\ \____\\ \____/ \ \__\/\____/
	     \/_/\/_/\/____/ `/___/> \\/___/  \/___/  \/__/\/_/ \/_/ \/__,_ /    \/___/   \/_/\/_/\/___/  \/_/   \/__/\/____/ \/___/   \/__/\/___/
	                        /\___/
	                        \/_*/

	  document.getElementById('select_all_cells').addEventListener('click', function (e) {
	    e.preventDefault();
	    for (var _i10 = 0; _i10 < cellInputs.length; _i10++) {
	      cellInputs[_i10].checked = true;
	    }
	  });

	  document.getElementById('unselect_all_cells').addEventListener('click', function (e) {
	    e.preventDefault();

	    for (var _i11 = 0; _i11 < cellInputs.length; _i11++) {
	      cellInputs[_i11].checked = false;
	    }unFocusTDCells();
	  });

	  document.getElementById('inverse_selection').addEventListener('click', function (e) {
	    e.preventDefault();
	    for (var _i12 = 0; _i12 < cellInputs.length; _i12++) {
	      cellInputs[_i12].checked = !cellInputs[_i12].checked;
	    }
	  });

	  document.addEventListener('keyup', function (event) {
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

	    /*if (event.ctrlKey && event.which === 8) { // ctrl + backspace
	        document.getElementById('inverse_selection').click();
	    }*/
	  });

	  function clearBoard() {
	    for (var _i13 = 0; _i13 < cellInputs.length; _i13++) {
	      var _cell = cellInputs[_i13];
	      _cell.checked = false;
	      _cell.parentNode.removeAttribute('style');
	    }
	  }

	  function updateDownloadLinks() {
	    var downloadAnchors = document.querySelectorAll('a[download]');
	    for (var _i14 = 0; _i14 < downloadAnchors.length; _i14++) {
	      var a = downloadAnchors[_i14];
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
	    for (var _i15 = 0; _i15 < filenames.length; _i15++) {
	      filenames[_i15].innerHTML = e.target.value ? e.target.value : 'favicon';
	    }

	    var anchors = document.querySelectorAll('nav.button-bar a');
	    for (var _i16 = 0; _i16 < anchors.length; _i16++) {
	      var anchor = anchors[_i16];
	      anchor.setAttribute('download', (e.target.value || 'favicon') + "." + anchor.getAttribute('data-format'));
	    }
	  });

	  var downloadBtns = document.querySelectorAll('input[name="download__as"]');
	  for (var _i17 = 0; _i17 < downloadBtns.length; _i17++) {
	    var downloadBtn = downloadBtns[_i17];

	    downloadBtn.addEventListener('change', function (e) {
	      var anchors = document.querySelectorAll('nav.button-bar a');

	      for (var _i18 = 0; _i18 < anchors.length; _i18++) {
	        var anchor = anchors[_i18];
	        e.target.value == anchor.getAttribute('data-format') ? anchor.removeAttribute('hidden') : anchor.setAttribute('hidden', 'true');
	        //console.log(`${event.target.value}.${anchor.getAttribute('data-format')}`);
	      }

	      var extensions = document.querySelectorAll('.extension');
	      for (var _i19 = 0; _i19 < extensions.length; _i19++) {
	        extensions[_i19].innerHTML = e.target.value;
	      }
	    });
	  }

	  document.getElementById('stage').addEventListener("change", function (event) {
	    console.log(event);
	    unFocusTDCells();
	    try {
	      event.target.parentNode.querySelector('input[type="checkbox"]').focus();
	    } catch (e) {}
	  });

	  /*document.getElementById("stage").addEventListener("keyup", function(event) {
	    console.log(event);
	  });*/

	  function unFocusTDCells() {
	    //console.log('unFocusTDCells');
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

	  function updateSwatchView() {
	    var comp = document.querySelector('.swatches').parentNode.parentNode.parentNode,
	        formButton = document.querySelector('#swatches-form button');
	    if (document.querySelectorAll('.swatch').length < 1) {
	      formButton.setAttribute('hidden', 'true');
	      comp.setAttribute('data-empty', 'true');
	    } else {
	      formButton.removeAttribute('hidden');
	      comp.removeAttribute('data-empty');
	    }
	  }

	  function elementToHex(element) {
	    return helpers.rgbaToHex(parseInt(element.getAttribute('data-r')), parseInt(element.getAttribute('data-g')), parseInt(element.getAttribute('data-b')), Number(element.getAttribute('data-a'))).replace('#', '0x');
	  }

	  /*           __                                           ___
	  /\ \__       /\ \                                         /\_ \
	  ____  __  __  __     __  \ \ ,_\   ___\ \ \___       _____      __      ___      __\//\ \
	  /',__\/\ \/\ \/\ \  /'__`\ \ \ \/  /'___\ \  _ `\    /\ '__`\  /'__`\  /' _ `\  /'__`\\ \ \
	  /\__, `\ \ \_/ \_/ \/\ \L\.\_\ \ \_/\ \__/\ \ \ \ \   \ \ \L\ \/\ \L\.\_/\ \/\ \/\  __/ \_\ \_
	  \/\____/\ \___x___/'\ \__/.\_\\ \__\ \____\\ \_\ \_\   \ \ ,__/\ \__/.\_\ \_\ \_\ \____\/\____\
	  \/___/  \/__//__/   \/__/\/_/ \/__/\/____/ \/_/\/_/    \ \ \/  \/__/\/_/\/_/\/_/\/____/\/____/
	                               \ \_\
	                                \/*/

	  document.getElementById('swatches-form').addEventListener('submit', function (e) {
	    e.preventDefault();

	    var swatches = e.target.querySelectorAll('.swatch input[type="radio"]'),
	        deletingSwatch = e.target.querySelector('.swatch input[type="radio"]:checked'),
	        hex = elementToHex(deletingSwatch),
	        swatchParents = document.querySelectorAll('.swatch');

	    try {
	      var previous = deletingSwatch.parentNode.previousElementSibling.querySelector('input[type="radio"]');
	      previous.checked = true;
	      previous.focus();
	    } catch (e) {}

	    deletingSwatch.parentNode.remove();

	    updateSwatchView();

	    var toSave = [];

	    swatchParents.forEach(function (element, index, array) {
	      toSave.push(elementToHex(element));
	    });

	    localStorage.setItem('swatchesStore', toSave.join(','));
	  });

	  document.querySelector('.swatches').addEventListener('change', function (e) {
	    updateColor(elementToHex(e.target.parentNode));
	    pushState(); // #janky
	  }, true);

	  var saveSwatchBtn = document.createElement('button');
	  saveSwatchBtn.innerHTML = 'Save Swatch';
	  document.querySelector('#cell-grid__container footer').appendChild(saveSwatchBtn);

	  saveSwatchBtn.addEventListener('click', function (e) {
	    e.preventDefault();
	    addSwatch([fillColor[0], fillColor[1], fillColor[2], Number(rgbASlider.value)]);
	  });

	  function getSwatchesStore() {
	    return function () {
	      try {
	        return localStorage.getItem('swatchesStore').split(',');
	      } catch (e) {
	        return [];
	      }
	    }().filter(function (value) {
	      return value.indexOf('0x') == 0;
	    });
	  }

	  var swatchesStore = getSwatchesStore();

	  function addSwatch(rgba) {
	    var doLocalStorage = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	    var swatches = document.querySelectorAll('.swatch');
	    document.querySelector('.swatches').innerHTML += "<li class=\"swatch\" data-r=\"" + rgba[0] + "\" data-g=\"" + rgba[1] + "\" data-b=\"" + rgba[2] + "\" data-a=\"" + rgba[3] + "\" style=\"background:rgba(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + "," + rgba[3] + ")\">\n      <input type=\"radio\" name=\"swatch\" id=\"swatch__" + swatches.length + "\" />\n      <label for=\"swatch__" + swatches.length + "\">\n        <span class=\"accessibly-hidden\">Red " + rgba[0] + ", Green " + rgba[1] + ", Blue " + rgba[2] + ", Alpha " + rgba[3] + "</span>\n      </label>\n    </li>";

	    if (doLocalStorage) {
	      var _swatchesStore = getSwatchesStore();
	      _swatchesStore.push(helpers.rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3] !== undefined ? rgba[3] : 1).replace('#', '0x'));
	      _swatchesStore.filter(function (el, i, arr) {
	        return arr.indexOf(el) === i;
	      });
	      localStorage.setItem('swatchesStore', _swatchesStore.join(','));
	    }

	    updateSwatchView();
	  }

	  swatchesStore.forEach(function (element, index, array) {
	    var rgba = helpers.hexToRGBA(element.replace('0x', '#'));
	    addSwatch(rgba, false);
	  });

	  var swatches = document.querySelectorAll('.swatch');
	  if (swatches.length) {
	    swatches[swatches.length - 1].querySelector('input[type="radio"]').checked = true;
	  }

	  updateSwatchView();

	  /*                   __
	  /\ \      __         /\ \__
	  \ \ \___ /\_\    ____\ \ ,_\   ___   _ __   __  __
	  \ \  _ `\/\ \  /',__\\ \ \/  / __`\/\`'__\/\ \/\ \
	   \ \ \ \ \ \ \/\__, `\\ \ \_/\ \L\ \ \ \/ \ \ \_\ \
	    \ \_\ \_\ \_\/\____/ \ \__\ \____/\ \_\  \/`____ \
	     \/_/\/_/\/_/\/___/   \/__/\/___/  \/_/   `/___/> \
	                                                 /\___/
	                                                 \/_*/

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

	  window.onpopstate = function (event) {
	    clearBoard(); // clear the art board

	    fillBack = event.state; // set the new state

	    Object.keys(fillBack).forEach(function (key) {
	      // draw the new state
	      setRGBAttributes(document.getElementById(key.replace('c', 'cell__')).parentNode, fillBack[key].replace('0x', '#'));
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