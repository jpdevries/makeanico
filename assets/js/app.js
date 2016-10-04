webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var makeanico = __webpack_require__(2);

	var cf = new makeanico.MakeAnIco();

	/*(function(html){
	  html.classList.remove('no-js');
	  html.classList.add('js');
	})(document.querySelector('html'));*/

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var helpers = __webpack_require__(3);

	var MakeAnIco = function MakeAnIco() {
	  //console.log('helpers', helpers.hexToRGBA('bl'));
	  var inputColorSupport = function () {
	    var i = document.createElement("input");
	    i.setAttribute("type", "color");
	    return i.type !== "text";
	  }();

	  document.querySelectorAll('#stage tbody td[style]').forEach(function (element) {
	    try {
	      (function () {
	        var fill = element.querySelector('input[type="hidden"]') ? element.querySelector('input[type="hidden"]').value.replace('0x', '#') : function () {
	          var style = element.style.backgroundColor.trim();
	          if (style.indexOf('#') == '1') return style.replace('#', '0x');
	          style = style.replace('rgba(', '');
	          style = style.replace(')', '');
	          style = style.split(',').map(function (n) {
	            return n.trim();
	          });
	          return helpers.rgbaToHex(style[0], style[1], style[2], style[3]).replace('#', '0x');
	        }();
	        console.log(fill);
	        var hex = helpers.hexToRGBA(fill.replace('0x', '#'));
	        element.dataset.dirty = true;

	        //console.log(hex);

	        if (!element.querySelector('input[type="hidden"]')) {
	          (function () {
	            var index = element.querySelector('label').getAttribute('for').replace('c__', '');
	            //<input type="hidden" name="c${index}" value="${hex.replace('#','0x')}" >
	            var hidden = function () {
	              var h = document.createElement('input');
	              h.setAttribute('type', 'hidden');
	              h.setAttribute('name', "c" + index);
	              h.setAttribute('value', "" + fill);
	              return h;
	            }();
	            element.insertBefore(hidden, element.childNodes[0]);
	          })();
	        }

	        element.dataset.r = hex[0];
	        element.dataset.g = hex[1];
	        element.dataset.b = hex[2];
	        element.dataset.a = hex[3];
	      })();
	    } catch (e) {}
	  });

	  $('ps').outerHTML = "\n  <p>Using Adobe Photoshop?<br>Easily import a Photoshop document with our <a class=\"es\" download=\"makeanico.jsx\" href=\"/assets/js/extendscript/makeanico.jsx\">MakeanIco&nbsp;ExtendScript</a>.</p>\n  <p>Bookmark this page at anytime to save your&nbsp;proggress.</p>\n  ";

	  var icons = document.querySelectorAll('[data-icon]');
	  icons.forEach(function (icon) {
	    icon.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" class=\"svg-icon__svg\"><use xlink:href=\"assets/img/sprite" + min + ".svg#" + icon.getAttribute('data-icon') + "\"></use></svg>";
	    icon.removeAttribute('data-icon');
	  });

	  if (inputColorSupport) {
	    // only add colorpicker option if the browser supports <input type="color">, auto select colorpicker option if no others are selected
	    (function (fieldset) {
	      fieldset.innerHTML = "<label for=\"input_color_by__colorpicker\">Colorpicker:</label>\n      <input type=\"color\" id=\"input_color_by__colorpicker\" name=\"input_color_by__colorpicker\" value=\"#FFFFFF\" />";
	      fieldset.removeAttribute('hidden');
	    })(document.querySelector('.colorpicker.fieldset'));

	    (function (colorOption) {
	      colorOption.innerHTML = "<label for=\"input_color_by__text__colorpicker\">Colorpicker: </label>\n      <input type=\"radio\" id=\"input_color_by__text__colorpicker\" name=\"input_color_by\" value=\"colorpicker\" />";
	      colorOption.removeAttribute('hidden');
	    })(document.querySelector('.color.option'));

	    if (!(inputColorByTextRadio.checked || $('input_color_by__rgb').checked)) $('input_color_by__colorpicker').checked = true;

	    document.querySelector('.import p').innerHTML += "<br>Upload a PNG, JPG, GIF, or SVG image and we'll generate a favicon from your&nbsp;image.<br>Your image will be scaled down and cropped as a 16x16 square so square aspect ratios work best.";

	    try {
	      $('input_color_by__colorpicker').addEventListener('input', function (e) {
	        $('input_color_by__text__colorpicker').checked = true;
	        updateColor(e.target.value);
	        updateDownloadLinks();
	      });

	      $('input_color_by__colorpicker').addEventListener('change', function (e) {
	        pushState();
	      });
	    } catch (e) {}
	  }

	  fillCellsOnClick.removeAttribute('disabled');
	  fillCellsOnClick.setAttribute('checked', 'true');

	  stage.addEventListener('keydown', function (e) {
	    sKeyDown = e.key == 's' || false;
	  });

	  stage.addEventListener('keyup', function (e) {
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

	  function updateMetaTags() {
	    try {
	      document.querySelectorAll("head meta[data-fill]").forEach(function (meta) {
	        return meta.setAttribute('content', helpers.rgbaToHex(fillColor[0], fillColor[1], fillColor[2]));
	      });
	    } catch (e) {}
	  }

	  function updateView() {
	    //console.log('updateView');
	    updateFavicon();
	    updateDownloadLinks();
	    updateMetaTags();

	    var isBlank = !Object.keys(fillBack).length;
	    document.querySelectorAll('.data-dependent').forEach(function (element) {
	      element.setAttribute('href', "mailto:?subject=Check%20out%20this%20Favicon&body=" + encodeURIComponent(location.origin + location.pathname + location.search));
	      isBlank ? element.setAttribute('hidden', 'true') : element.removeAttribute('hidden');
	    });
	  }

	  if (supportsLocalStorage()) {
	    if (localStorage.getItem('fillColor') && !isNaN(localStorage.getItem('fillColor'))) updateColor(localStorage.getItem('fillColor').replace('0x', '#'), true, fillCellsOnClick.checked);else if (inputColorByTextColor.value) {
	      var rgb = helpers.cssColorNameToRGB(inputColorByTextColor.value, true);
	      updateColor(helpers.rgbaToHex(rgb[0], rgb[1], rgb[2], $('rgb_slider_a').value), false, fillCellsOnClick.checked);
	    } else updateColor(helpers.rgbaToHex($('rgb_slider_r').value, $('rgb_slider_g').value, $('rgb_slider_b').value, $('rgb_slider_a').value), false, fillCellsOnClick.checked);

	    if (localStorage.getItem('colorby')) $(localStorage.getItem('colorby')).checked = true;

	    document.querySelectorAll('input[name="input_color_by"]').forEach(function (element) {
	      return element.addEventListener('change', function (event) {
	        return localStorage.setItem('colorby', event.target.getAttribute('id'));
	      });
	    });
	  }

	  document.addEventListener('swatchselected', function (event) {
	    updateColor(event.detail, true, fillCellsOnClick.checked);
	    pushState();
	  });

	  function updateColor(color) {
	    var updateTextField = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    var doUpdateColorGrid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	    var h = helpers.hexToRGBA(color);
	    //console.log('updateColor', doUpdateColorGrid, h);

	    if (!h) return false;
	    fillColor = h;
	    //let wasHex = color.charAt(0) == '#',
	    //wasBlack = (wasHex) ? color == '#000000' || color == '#000' : color.toLowerCase() == 'black';

	    //if(!wasHex && !wasBlack && color == '#000000') return;

	    cellGridContainer.classList.add('dirty');
	    cellGridContainer.style.borderColor = "rgba(" + fillColor[0] + "," + fillColor[1] + "," + fillColor[2] + "," + (fillColor[3] == undefined ? 1 : fillColor[3]) + ")";

	    if (updateTextField) inputColorByTextColor.value = color;

	    for (var _i = 0; _i < 3; _i++) {
	      ranges[_i].value = fillColor[_i];
	    }try {
	      $('input_color_by__colorpicker').value = helpers.rgbaToHex(fillColor[0], fillColor[1], fillColor[2]);
	      rgbaSlider.value = fillColor[3];
	    } catch (e) {}

	    if (doUpdateColorGrid) updateColorGrid(color);
	    updateView();

	    localStorage.setItem('fillColor', helpers.rgbaToHex(fillColor[0], fillColor[1], fillColor[2], fillColor[3]).replace('#', '0x'));

	    startOver.removeAttribute('hidden');
	  }

	  function setRGBAttributes(element) {
	    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

	    //console.log('setRGBAttributes', element, color);
	    var alpha = rgbaSlider.value;

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
	    element.setAttribute('data-a', rgbaSlider.value);

	    element.querySelector('label span').innerHTML = "Cell " + String.fromCharCode(65 + parseInt(element.getAttribute('data-row'))) + element.getAttribute('data-col') + " is filled with Red " + color[0] + " Green " + color[1] + " Blue " + color[2] + " Alpha " + Math.round(color[3] * 100) / 100;

	    element.style.backgroundColor = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + alpha + ")";
	  }

	  function updateColorGrid(color) {
	    //console.log('updateColorGrid', color);
	    var alphaArray = helpers.hexToRGBA(color);

	    var checkedInputs = document.querySelectorAll('#stage input[type="checkbox"]:checked');
	    if (checkedInputs.length) checkedInputs.forEach(function (element, index, array) {
	      var key = element.getAttribute('id').replace('c__', 'c');

	      fillBack[key] = helpers.rgbaToHex(alphaArray[0], alphaArray[1], alphaArray[2], Number(rgbaSlider.value)).replace('#', '0x');

	      try {
	        element.parentNode.querySelector('input[type="hidden"]').setAttribute('value', fillBack[key]);
	      } catch (e) {}

	      setRGBAttributes(element.parentNode);
	      setCellBorderFilterColor(element.parentNode.querySelector('label'), helpers.invertColor(color));
	    });
	  }

	  function setCellBorderFilterColor(label, color) {
	    label.style.boxShadow = "0 0 5px " + color;
	    label.style.borderColor = "" + color;
	  }

	  function updateFaviconPreview() {
	    var rows = document.querySelectorAll('#stage tbody tr'),
	        svg = '';

	    document.querySelectorAll('#stage tbody tr').forEach(function (row, i) {
	      var rects = drawRow(row, i);
	      svg += rects.join('\n');

	      function drawRow(row, rowIndex) {
	        var rects = [];

	        row.querySelectorAll('td:not(.row-col)').forEach(function (cell, x) {
	          if (cell.getAttribute('data-dirty') == 'true') {
	            var _rgb = [cell.getAttribute('data-r'), cell.getAttribute('data-g'), cell.getAttribute('data-b')],
	                opacity = cell.getAttribute('data-a') ? " opacity=\"" + cell.getAttribute('data-a') + "\"" : '',
	                color = helpers.rgbToHex(_rgb[0], _rgb[1], _rgb[2]);

	            rects.push("<rect x=\"" + x + "\" y=\"" + rowIndex + "\" width=\"1\" height=\"1\" fill=\"" + color + "\"" + opacity + "></rect>");
	          }
	        });

	        return rects;
	      }
	    });

	    //document.querySelectorAll('.svg-preview__svg .art').forEach((element) => element.innerHTML = svg); // MS Edge has a bug :( http://codepen.io/jpdevries/pen/qaAwog
	    document.querySelectorAll('.svg-preview__svg').forEach(function (element) {
	      //element.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="svg-preview__svg" viewBox="0 0 16 16"><g class="art">${svg}</g></svg>`;
	      var prime = element.cloneNode(false);
	      prime.innerHTML = "<g class=\"art\">" + svg + "</g>";
	      element.outerHTML = prime.outerHTML;
	    });
	  }

	  function updateFavicon() {
	    updateFaviconPreview();

	    var canvas = document.createElement('canvas'),
	        ctx = void 0,
	        img = document.createElement('img'),
	        link = $('favicon'),
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

	  ranges.forEach(function (range, index) {
	    //console.log(fillColor, range);
	    fillColor[index] = parseInt(range.value);

	    range.addEventListener('input', function (e) {
	      fillColor[index] = parseInt(e.target.value); // update the fill color
	      var color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2], rgbaSlider.value); //convert RGB values to hex
	      updateColor(color);

	      inputColorByRGBRadio.checked = true;
	    });

	    range.addEventListener('change', function (e) {
	      pushState();
	      updateView();
	    });
	  });

	  function handleInputColorByTextColorChange(e) {
	    var color = helpers.cssColorNameToRGB(e.target.value, true),
	        wasHex = e.target.value.charAt(0) == '#',
	        wasBlack = wasHex ? color == '#000000' || color == '#000' : e.target.value.toLowerCase() == 'black';

	    // detect if invalid color (black when it shouldn't be)
	    if (!wasHex && !wasBlack && color[0] == 0 && color[1] == 0 && color[2] == 0) return;

	    updateColor(helpers.rgbToHex(color[0], color[1], color[2]), false);
	    pushState();
	    updateDownloadLinks();
	  }

	  inputColorByTextColor.addEventListener('input', handleInputColorByTextColorChange);
	  inputColorByTextColor.addEventListener('change', handleInputColorByTextColorChange);

	  document.querySelector('#cell-grid__container header').innerHTML += "<h3>Select Cells</h3><div class=\"async-btns flexible unaligned fieldset\">\n    <button id=\"select_all_cells\">Select all Cells</button>\n    <button id=\"unselect_all_cells\">Unselect all Cells</button>\n    <button id=\"inverse_selection\">Inverse Selection</button>\n  </div>";

	  cellInputs.forEach(function (cell, index) {
	    cell.addEventListener('click', function (e) {
	      //console.log(e);
	      var color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2], rgbaSlider.value);
	      if ((e.altKey || sKeyDown) && lastClickedCellInput) {
	        var rows = document.querySelectorAll('#stage tbody tr'),
	            start = Math.min(lastClickedCellInput.parentNode.getAttribute('data-row'), e.target.parentNode.getAttribute('data-row'));

	        for (var _i2 = start; _i2 <= start + Math.abs(parseInt(lastClickedCellInput.parentNode.getAttribute('data-row')) - parseInt(e.target.parentNode.getAttribute('data-row'))); _i2++) {
	          var tr = rows[_i2],
	              tds = tr.querySelectorAll('td');
	          for (var j = 1 + Math.min(lastClickedCellInput.parentNode.getAttribute('data-col'), e.target.parentNode.getAttribute('data-col')); j <= 1 + Math.max(lastClickedCellInput.parentNode.getAttribute('data-col'), e.target.parentNode.getAttribute('data-col')); j++) {
	            var td = tds[j],
	                checkbox = td.querySelector('input[type="checkbox"]');
	            //key = checkbox.getAttribute('id').replace('c__','c');

	            if (e.target.parentNode !== td && lastClickedCellInput.parentNode !== td) {
	              checkbox.checked = true;
	              //if(fillCellsOnClick.checked) setRGBAttributes(td);
	            }
	          }
	        }

	        updateColorGrid(color);
	        pushState();
	        updateView();
	      }

	      if (e.target.checked) {
	        var key = cell.getAttribute('id').replace('c__', 'c');

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
	  });

	  $('select_all_cells').addEventListener('click', function (e) {
	    e.preventDefault();
	    fillSelectedCells.removeAttribute('disabled');
	    cellInputs.forEach(function (cellInput) {
	      cellInput.checked = true;
	    });
	  });

	  $('unselect_all_cells').addEventListener('click', function (e) {
	    e.preventDefault();
	    fillCellsOnClick.checked ? fillSelectedCells.setAttribute('disabled', 'true') : fillSelectedCells.removeAttribute('disabled');
	    cellInputs.forEach(function (cellInput) {
	      cellInput.checked = false;
	    });
	    unFocusTDCells();
	  });

	  function unFocusTDCells() {
	    //console.log('unFocusTDCells');
	    cellInputs.forEach(function (cellInput) {
	      if (!cellInput.checked) {
	        try {
	          var label = cellInput.parentNode.querySelector('label');
	          unFocusTDCell(label);
	        } catch (e) {}
	      }
	    });
	  }

	  $('inverse_selection').addEventListener('click', function (e) {
	    e.preventDefault();
	    cellInputs.forEach(function (cellInput) {
	      cellInput.checked = !cellInput.checked;
	    });
	  });

	  function clearBoard() {
	    cellInputs.forEach(function (cellInput) {
	      cellInput.checked = false;
	      cellInput.parentNode.removeAttribute('style');
	    });
	  }

	  function updateDownloadLinks() {
	    document.querySelectorAll('a[download]:not(.es)').forEach(function (a) {
	      a.setAttribute('href', a.getAttribute('data-base-url') + location.search + '&dl=1');
	    });
	  }

	  startOver.querySelector('a').addEventListener('click', function (e) {
	    try {
	      localStorage.removeItem('fillColor');
	      localStorage.removeItem('swatchesStore');
	    } catch (e) {}
	    /*e.preventDefault();
	     window.history.pushState({}, 'Makeanico', `/`);
	    clearBoard();
	     form.reset();
	    cellGridContainer.removeAttribute('style');
	    cellGridContainer.classList.remove('dirty');
	     window.scrollTo(0,0);*/
	  });

	  document.querySelector('.instructions').innerHTML = "Select cells above to fill them with the color chosen&nbsp;below.";

	  fillCellsOnClick.addEventListener('change', function (e) {
	    e.target.checked ? fillSelectedCells.setAttribute('disabled', 'true') : fillSelectedCells.removeAttribute('disabled');
	  });

	  fillCellsOnClick.checked ? fillSelectedCells.setAttribute('disabled', 'true') : fillSelectedCells.removeAttribute('disabled');

	  fillSelectedCells.addEventListener('click', function (event) {
	    event.preventDefault();
	    updateColorGrid(helpers.rgbaToHex(fillColor[0], fillColor[1], fillColor[2], fillColor[3]));
	    pushState();
	    updateView();
	    //updateFavicon();
	    //updateFaviconPreview();
	  });

	  stage.addEventListener("change", function (event) {
	    unFocusTDCells();
	    try {
	      event.target.parentNode.querySelector('input[type="checkbox"]').focus();
	    } catch (e) {}
	  });

	  /*$("stage").addEventListener("keyup", function(event) {
	    console.log(event);
	  });*/

	  function unFocusTDCell(cell) {
	    cell.style.removeProperty('box-shadow');
	    cell.style.removeProperty('border-color');
	  }

	  document.querySelector('.widget.import .svg-icon__svg').addEventListener('click', function (e) {
	    $('pic').click();
	  });

	  document.addEventListener('enhancementsloaded', function () {
	    updateColor(helpers.rgbaToHex($('rgb_slider_r').value, $('rgb_slider_g').value, $('rgb_slider_b').value, $('rgb_slider_a').value));
	  });

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
	    //console.log('popstate');
	    clearBoard(); // clear the art board

	    fillBack = event.state; // set the new state

	    Object.keys(fillBack).forEach(function (key) {
	      // draw the new state
	      setRGBAttributes($(key.replace('c', 'c__')).parentNode, fillBack[key].replace('0x', '#'));
	    });

	    updateView();

	    window.scrollTo(0, 0); // scroll to the top
	  };

	  ["theme-color", "msapplication-navbutton-color", "apple-mobile-web-app-capable", "apple-mobile-web-app-status-bar-style", "msapplication-TileColor"].forEach(function (name) {
	    console.log(name);
	    if (!document.querySelector("head meta[name=\"" + name + "\"]")) {
	      var m = document.createElement('meta');
	      m.setAttribute('name', name);
	      if (name !== 'apple-mobile-web-app-capable') m.setAttribute('data-fill', 'true');
	      m.setAttribute('content', name == 'apple-mobile-web-app-capable' ? 'yes' : helpers.rgbaToHex(fillColor[0], fillColor[1], fillColor[2], fillColor[3]));
	      document.querySelector('head').appendChild(m);
	    }
	  });
	};

	exports.MakeAnIco = MakeAnIco;

/***/ }
]);