webpackJsonp([2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*           __                                           ___
	/\ \__       /\ \                                         /\_ \
	____  __  __  __     __  \ \ ,_\   ___\ \ \___       _____      __      ___      __\//\ \
	/',__\/\ \/\ \/\ \  /'__`\ \ \ \/  /'___\ \  _ `\    /\ '__`\  /'__`\  /' _ `\  /'__`\\ \ \
	/\__, `\ \ \_/ \_/ \/\ \L\.\_\ \ \_/\ \__/\ \ \ \ \   \ \ \L\ \/\ \L\.\_/\ \/\ \/\  __/ \_\ \_
	\/\____/\ \___x___/'\ \__/.\_\\ \__\ \____\\ \_\ \_\   \ \ ,__/\ \__/.\_\ \_\ \_\ \____\/\____\
	\/___/  \/__//__/   \/__/\/_/ \/__/\/____/ \/_/\/_/    \ \ \/  \/__/\/_/\/_/\/_/\/____/\/____/
	                             \ \_\
	                              \/*/

	var helpers = __webpack_require__(3);

	if (initSwatch) addSwatch([initSwatch[0], initSwatch[1], initSwatch[2], initSwatch[3]]);

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

	$('swatches-form').addEventListener('submit', function (e) {
	  e.preventDefault();

	  var swatches = e.target.querySelectorAll('.swatch input[type="radio"]'),
	      deletingSwatch = e.target.querySelector('.swatch input[type="radio"]:checked'),
	      hex = elementToHex(deletingSwatch);

	  try {
	    var previous = deletingSwatch.parentNode.previousElementSibling.querySelector('input[type="radio"]');
	    previous.checked = true;
	    previous.focus();
	  } catch (e) {}

	  deletingSwatch.parentNode.remove();

	  updateSwatchView();

	  var toSave = [];

	  document.querySelectorAll('.swatch').forEach(function (element, index, array) {
	    toSave.push(elementToHex(element));
	  });

	  localStorage.setItem('swatchesStore', toSave.join(','));
	});

	document.querySelector('.swatches').addEventListener('change', function (e) {
	  //updateColor(elementToHex(e.target.parentNode));
	  //pushState(); // #janky
	  document.dispatchEvent(new CustomEvent('swatchselected', { 'detail': elementToHex(e.target.parentNode).replace('0x', '#') }));
	}, true);

	saveSwatchBtn.addEventListener('click', function (e) {
	  e.preventDefault();
	  addSwatch([fillColor[0], fillColor[1], fillColor[2], Number(rgbaSlider.value)]);
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
	  var setLocalStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	  var swatches = document.querySelectorAll('.swatch');
	  document.querySelector('.swatches').innerHTML += '<li class="swatch" data-r="' + rgba[0] + '" data-g="' + rgba[1] + '" data-b="' + rgba[2] + '" data-a="' + rgba[3] + '" style="background:rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')">\n    <input type="radio" name="swatch" id="swatch__' + swatches.length + '" />\n    <label for="swatch__' + swatches.length + '">\n      <span a11y-hidden>Red ' + rgba[0] + ', Green ' + rgba[1] + ', Blue ' + rgba[2] + ', Alpha ' + rgba[3] + '</span>\n    </label>\n  </li>';

	  if (setLocalStorage) {
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
	  addSwatch(helpers.hexToRGBA(element.replace('0x', '#')), false);
	});

	var swatches = document.querySelectorAll('.swatch');
	if (swatches.length) {
	  swatches[swatches.length - 1].querySelector('input[type="radio"]').checked = true;
	}

	function elementToHex(element) {
	  return helpers.rgbaToHex(parseInt(element.getAttribute('data-r')), parseInt(element.getAttribute('data-g')), parseInt(element.getAttribute('data-b')), Number(element.getAttribute('data-a'))).replace('#', '0x');
	}

	updateSwatchView();

/***/ }
]);