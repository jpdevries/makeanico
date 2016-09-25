document.querySelectorAll('[no-js]').forEach((element) => (element.remove()));
document.getElementById('fill-cells-on-click').removeAttribute('disabled');

if ('serviceWorker' in navigator && false) navigator.serviceWorker.register('/serviceWorker.js');

function supportsLocalStorage() {
  const ico = 'icotecht';
  try {
      localStorage.setItem(ico, ico);
      localStorage.removeItem(ico);
      return true;
  } catch(e) {
      return false;
  }
}

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
    console.log('addSwatches');
    addComponent('swatches').then(() => (
      addScript(`/assets/js/common${min}.js`, 'common').then(() => (
        addScript(`/assets/js/components/swatches${min}.js`, 'swatches')
      ))
    ));
  }

}

function addComponent(slug) {
  return new Promise(function(resolve, reject) {
    if(!document.getElementById(`lazy__${slug}`)) {
      reject();
      return;
    }
    fetch(`/api/components/${slug}`, {
      method: 'get'
    }).then(function(response) {
      response.text().then((text) => {
        try {
          document.getElementById(`lazy__${slug}`).outerHTML = text;
        } catch(err) {}
        resolve(text);
      })
    })
  });
}

function addScript(src, id = undefined) {
  console.log('addScript', src, id);
  return new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.src = src;
    if(id) {
      script.setAttribute('id','scripts__' + id);
      if(document.getElementById('scripts__' + id)) {
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

document.getElementById('input_color_by__text').addEventListener('change', function(event) {
  event.stopPropagation();
  addLazy();
});

function addLazy() {
  addScript(`/assets/js/common${min}.js`, 'common').then(() => (
    addScript(`/assets/js/lazy${min}.js`, 'lazy')
  ));
}

function doCellChange() {
  console.log('doCellChange');
  addScript(`/assets/js/globals${min}.js`, 'globals').then(() => (
    addScript(`/assets/js/common${min}.js`, 'common')
  )).then(() => (
    addScript(`/assets/js/app${min}.js`, 'app')
  )).then(() => {
    return Promise.all([
      addComponent('export'),
      addComponent('keyboard')
    ])
  }).then(() => {
    return Promise.all([
      addScript(`/assets/js/components/export${min}.js`, 'export'),
      addScript(`/assets/js/components/shortcuts${min}.js`, 'shortcuts')//,
    ]);
  }).then(() => {
    alertBanner.innerHTML = '<p>Live Preview, Export, and Keyboard Shortcut enhancements loaded lazily</p>';
    alertBanner.removeAttribute('hidden');
    alertBanner.removeAttribute('aria-hidden');
    setTimeout(function(event) {
      alertBanner.setAttribute('hidden','true');
      alertBanner.setAttribute('aria-hidden','true');
    }, 5000)
  });
}

function handleCellChange(event) {
  makeanico.removeEventListener('change', handleCellChange);
  doCellChange();
}

if(!so) {
  makeanico.addEventListener('change', handleCellChange);

  try {
    if(localStorage.getItem('fillColor')) doCellChange();
  } catch(e) {}
}
