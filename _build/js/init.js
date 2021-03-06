var alertBanner,
saveSwatchBtn = document.createElement('button'),
fillColor = [255, 255, 255, 100],
initSwatch,
inputColorByTextColor = $('input_color_by__text__color'),
inputColorByTextRadio = $('input_color_by__text');

NodeList.prototype.forEach = Array.prototype.forEach;

if(!(typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1)) document.write(`<script src="assets/js/polyfills/es6-promise${min}.js"><\/script>`);
window.fetch || document.write(`<script src="assets/js/polyfills/fetch${min}.js"><\/script>`);

document.querySelectorAll('[no-js]').forEach((element) => {element.remove()});
document.querySelectorAll('[js-hidden]').forEach((element) => {element.getAttribute('js-hidden') == 'false' ? element.removeAttribute('js-hidden') : element.setAttribute('hidden','true')});
$('fill-cells-on-click').removeAttribute('disabled');

if ('serviceWorker' in navigator) navigator.serviceWorker.register(`/serviceWorker${min}.js`);

fillCellsOnClick.checked = true;
fillSelectedCells.setAttribute('disabled','true');

if(supportsLocalStorage()) {
  saveSwatchBtn.innerHTML = 'Save Swatch';
  document.querySelector('#cell-grid__container footer').appendChild(saveSwatchBtn);
  if(localStorage.getItem('swatchesStore')) {
    addSwatches();
  } else {
    saveSwatchBtn.addEventListener('click', handleSaveSwatchBtnClicked);

    function handleSaveSwatchBtnClicked(event) {
      event.preventDefault();
      saveSwatchBtn.removeEventListener('click', handleSaveSwatchBtnClicked);

      initSwatch = fillColor;

      addSwatches();
    }
  }

  function addSwatches() {
    addComponent('swatches').then(() => (
      addScript(`/assets/js/common${min}.js`, 'common').then(() => (
        addScript(`/assets/js/components/swatches${min}.js`, 'swatches')
      ))
    ));
  }

}

function addComponent(slug) {
  return new Promise(function(resolve, reject) {
    if(!$(`lazy__${slug}`)) {
      reject();
      return;
    }
    fetch(`/api/components/${slug}`, {
      method: 'get'
    }).then(function(response) {
      response.text().then((text) => {
        try {
          $(`lazy__${slug}`).outerHTML = text;
        } catch(err) {}
        resolve(text);
      })
    })
  });
}

function addStyle(src, id = '') {
  if(id && document.getElementById('id')) {
    document.getElementById('id').remove();
  }
  document.querySelector('head').innerHTML += `<link rel="stylesheet"${id ? ' id=' + id : ''} href="assets/css/preferences${min}.css">`;
}

function addScript(src, id = undefined) {
  return new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.src = src;
    if(id) {
      script.setAttribute('id','scripts__' + id);
      if($('scripts__' + id)) {
        resolve();
        return;
      }
    }
    script.onload = function(event) {
      resolve();
    }
    script.onerror = function(event) {
      reject();
    }
    document.body.appendChild(script);
  });

}

inputColorByTextColor.addEventListener('focus', () => {
  inputColorByTextRadio.checked = true;
  addLazy();
});

$('input_color_by__text').addEventListener('change', function(e) {
  e.stopPropagation();
  addLazy();
});

function addLazy() {
  addScript(`/assets/js/common${min}.js`, 'common').then(() => (
    addScript(`/assets/js/lazylist${min}.js`, 'lazylist')
  ));
}

function doCellChange() {
  addScript(`/assets/js/globals${min}.js`, 'globals').then(() => (
    addScript(`/assets/js/common${min}.js`, 'common')
  )).then(() => (
    addScript(`/assets/js/app${min}.js`, 'app')
  )).then(() => {
    return Promise.all([
      addComponent('export'),
      addComponent('keyboard'),
      addComponent('alert')
    ])
  }).then(() => {
    alertBanner = $('alert-banner');
    return Promise.all([
      addScript(`/assets/js/components/export${min}.js`, 'export'),
      addScript(`/assets/js/components/shortcuts${min}.js`, 'shortcuts')
    ]);
  }).then(() => {
    alertBanner.removeAttribute('hidden');
    alertBanner.removeAttribute('aria-hidden');
    setTimeout(function() {
      alertBanner.setAttribute('hidden','true');
      alertBanner.setAttribute('aria-hidden','true');
    }, 5000)
  }).then(() => (
    document.dispatchEvent(new Event('enhancementsloaded'))
  ));
}

function handleCellChange() {
  makeanico.removeEventListener('change', handleCellChange);
  doCellChange();
}

if(!so) {
  makeanico.addEventListener('change', handleCellChange);

  try {
    if(localStorage.getItem('fillColor')) doCellChange();
  } catch(e) {}
}

if(supportsLocalStorage() && (localStorage.getItem('contrast') || localStorage.getItem('fontsize') || localStorage.getItem('typeface'))) addScript(`/assets/js/init_preferences${min}.js`,'init_preferences');
