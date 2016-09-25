
                            /*           __                                           ___
                           /\ \__       /\ \                                         /\_ \
  ____  __  __  __     __  \ \ ,_\   ___\ \ \___       _____      __      ___      __\//\ \
 /',__\/\ \/\ \/\ \  /'__`\ \ \ \/  /'___\ \  _ `\    /\ '__`\  /'__`\  /' _ `\  /'__`\\ \ \
/\__, `\ \ \_/ \_/ \/\ \L\.\_\ \ \_/\ \__/\ \ \ \ \   \ \ \L\ \/\ \L\.\_/\ \/\ \/\  __/ \_\ \_
\/\____/\ \___x___/'\ \__/.\_\\ \__\ \____\\ \_\ \_\   \ \ ,__/\ \__/.\_\ \_\ \_\ \____\/\____\
 \/___/  \/__//__/   \/__/\/_/ \/__/\/____/ \/_/\/_/    \ \ \/  \/__/\/_/\/_/\/_/\/____/\/____/
                                                         \ \_\
                                                          \/*/

const helpers = require('./../helpers');

if(initSwatch) addSwatch([initSwatch[0],initSwatch[1],initSwatch[2],initSwatch[3]]);

function updateSwatchView() {
  const comp = document.querySelector('.swatches').parentNode.parentNode.parentNode,
  formButton = document.querySelector('#swatches-form button');
  if(document.querySelectorAll('.swatch').length < 1) {
    formButton.setAttribute('hidden','true');
    comp.setAttribute('data-empty','true');
  } else {
    formButton.removeAttribute('hidden');
    comp.removeAttribute('data-empty');
  }
}

document.getElementById('swatches-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const swatches = e.target.querySelectorAll('.swatch input[type="radio"]'),
  deletingSwatch = e.target.querySelector('.swatch input[type="radio"]:checked'),
  hex = elementToHex(deletingSwatch);

  try {
    const previous = deletingSwatch.parentNode.previousElementSibling.querySelector('input[type="radio"]');
    previous.checked = true;
    previous.focus();
  } catch(e) {}

  deletingSwatch.parentNode.remove();

  updateSwatchView();

  let toSave = [];

  document.querySelectorAll('.swatch').forEach(function(element, index, array) {
    toSave.push(elementToHex(element));
  });

  localStorage.setItem('swatchesStore', toSave.join(','));
});

document.querySelector('.swatches').addEventListener('change', function(e) {
  //updateColor(elementToHex(e.target.parentNode));
  //pushState(); // #janky
  document.dispatchEvent(new CustomEvent('swatchselected', { 'detail': elementToHex(e.target.parentNode).replace('0x','#') }));
}, true);

saveSwatchBtn.addEventListener('click', function(e) {
  e.preventDefault();
  addSwatch([fillColor[0],fillColor[1],fillColor[2],Number(rgbaSlider.value)]);
});

function getSwatchesStore() {
  return (function(){
    try {
      return localStorage.getItem('swatchesStore').split(',')
    } catch (e) {
      return []
    }
  })().filter((value) => (
    value.indexOf('0x') == 0
  ));
}

let swatchesStore = getSwatchesStore();

function addSwatch(rgba, setLocalStorage = true) {
  const swatches = document.querySelectorAll('.swatch');
  document.querySelector('.swatches').innerHTML +=
  `<li class="swatch" data-r="${rgba[0]}" data-g="${rgba[1]}" data-b="${rgba[2]}" data-a="${rgba[3]}" style="background:rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})">
    <input type="radio" name="swatch" id="swatch__${swatches.length}" />
    <label for="swatch__${swatches.length}">
      <span a11y-hidden>Red ${rgba[0]}, Green ${rgba[1]}, Blue ${rgba[2]}, Alpha ${rgba[3]}</span>
    </label>
  </li>`;

  if(setLocalStorage) {
    let swatchesStore = getSwatchesStore();
    swatchesStore.push(
      helpers.rgbaToHex(
        rgba[0],
        rgba[1],
        rgba[2],
        (rgba[3] !== undefined) ? rgba[3] : 1
      ).replace('#','0x')
    );
    swatchesStore.filter( (el, i, arr) => arr.indexOf(el) === i);
    localStorage.setItem('swatchesStore', swatchesStore.join(','));
  }

  updateSwatchView();
}

swatchesStore.forEach(function(element, index, array) {
  addSwatch(helpers.hexToRGBA(element.replace('0x','#')), false);
});

const swatches = document.querySelectorAll('.swatch');
if(swatches.length) {
  swatches[swatches.length-1].querySelector('input[type="radio"]').checked = true;
}

function elementToHex(element) {
  return helpers.rgbaToHex(parseInt(element.getAttribute('data-r')), parseInt(element.getAttribute('data-g')), parseInt(element.getAttribute('data-b')), Number(element.getAttribute('data-a'))).replace('#','0x')
}

updateSwatchView();
