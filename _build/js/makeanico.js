const helpers = require('./helpers');


const MakeAnIco = function() {
  //console.log('helpers', helpers.hexToRGBA('bl'));
  const inputColorSupport = (function(){
    const i = document.createElement("input");
    i.setAttribute("type", "color");
    return i.type !== "text";
  })();

  $('ps').outerHTML = `
  <p>Using Adobe Photoshop?<br>Easily import a Photoshop document with our <a download="makeanico.jsx" href="/assets/js/extendscript/makeanico.jsx">MakeanIco&nbsp;ExtendScript</a>.</p>
  <p>Bookmark this page at anytime to save your&nbsp;proggress.</p>
  `;

  const icons = document.querySelectorAll('[data-icon]');
  icons.forEach((icon) => {
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="svg-preview__svg"><use xlink:href="assets/img/sprite${min}.svg#${icon.getAttribute('data-icon')}"></use></svg>`;
    icon.removeAttribute('data-icon');
  })


  if(inputColorSupport) { // only add colorpicker option if the browser supports <input type="color">, auto select colorpicker option if no others are selected
    (function(fieldset){
      fieldset.innerHTML = `<label for="input_color_by__colorpicker">Colorpicker:</label>
      <input type="color" id="input_color_by__colorpicker" name="input_color_by__colorpicker" value="#FFFFFF" />`;
      fieldset.removeAttribute('hidden');
    })(document.querySelector('.colorpicker.fieldset'));

    (function(colorOption){
      colorOption.innerHTML = `<label for="input_color_by__text__colorpicker">Colorpicker: </label>
      <input type="radio" id="input_color_by__text__colorpicker" name="input_color_by" value="colorpicker" />`;
      colorOption.removeAttribute('hidden');
    })(document.querySelector('.color.option'));

    if(!(inputColorByTextRadio.checked || $('input_color_by__rgb').checked)) $('input_color_by__colorpicker').checked = true;

    document.querySelector('.import p').innerHTML += "<br>Upload a PNG, JPG, GIF, or SVG image and we'll generate a favicon from your&nbsp;image.<br>Your image will be scaled down and cropped as a 16x16 square so square aspect ratios work best.";

    try {
      $('input_color_by__colorpicker').addEventListener('input',function(e){
        $('input_color_by__text__colorpicker').checked = true;
        updateColor(e.target.value);
        updateDownloadLinks();
      });

      $('input_color_by__colorpicker').addEventListener('change',function(e){
        pushState();
      });
    } catch (e) {}
  }

  fillCellsOnClick.removeAttribute('disabled');
  fillCellsOnClick.setAttribute('checked', 'true');

  stage.addEventListener('keydown', function(e){
    sKeyDown = (e.key == 's') || false;
  });

  stage.addEventListener('keyup', function(e){
    sKeyDown = false;
  });

  // pull the initial URL params out and store them in a Object
  var fillBack = {};
  const origLocationSearch = (location.search.charAt(0) == '?') ? location.search.substring(1) : '';
  if(location.search.charAt(0) == '?') {
    let params = origLocationSearch.split('&');

    for(let i = 0; i < params.length; i++) {
      const keyValue = params[i].split('=');
      fillBack[keyValue[0]] = keyValue[1];
    }

    if(params.length) {
      updateView();
    }
  }

  (function(){
    let trs = document.querySelectorAll("#stage tbody tr");
    for(var i = 0; i < trs.length; i++) {
      let tds = trs[i].querySelectorAll('td');
      for(let j = 1; j < tds.length; j++) {
        tds[j].setAttribute('data-row', i);
        tds[j].setAttribute('data-col', j-1);
      }
    }
  })();

  function updateView() {
    //console.log('updateView');
    updateFavicon();
    updateDownloadLinks();

    const isBlank = !Object.keys(fillBack).length;
    document.querySelectorAll('.data-dependent').forEach((element) => {
      (isBlank) ? element.setAttribute('hidden', 'true') : element.removeAttribute('hidden')
    })
  }

  if(inputColorByTextColor.value) {
    let rgb = helpers.cssColorNameToRGB(inputColorByTextColor.value, true);
    updateColor(helpers.rgbaToHex(rgb[0], rgb[1], rgb[2]), false, fillCellsOnClick.checked);
  } else if(localStorage.getItem('fillColor') && !isNaN(localStorage.getItem('fillColor'))) updateColor(localStorage.getItem('fillColor').replace('0x','#'), true, fillCellsOnClick.checked);

  document.addEventListener('swatchselected', function(event) {
    updateColor(event.detail);
    pushState();
  });

  function updateColor(color, updateTextField = true, doUpdateColorGrid = true) {
    let h = helpers.hexToRGBA(color);
    //console.log('updateColor', doUpdateColorGrid, h);

    if(!h) return false;
    fillColor = h;
    //let wasHex = color.charAt(0) == '#',
    //wasBlack = (wasHex) ? color == '#000000' || color == '#000' : color.toLowerCase() == 'black';

    //if(!wasHex && !wasBlack && color == '#000000') return;

    cellGridContainer.classList.add('dirty');
    cellGridContainer.style.borderColor = `rgba(${fillColor[0]},${fillColor[1]},${fillColor[2]},${fillColor[3] == undefined ? 1 : fillColor[3]})`;

    if(updateTextField) inputColorByTextColor.value = color;

    for(let i = 0; i < 3; i++) ranges[i].value = fillColor[i];

    try {
      $('input_color_by__colorpicker').value = helpers.rgbaToHex(fillColor[0], fillColor[1], fillColor[2]);
      rgbaSlider.value = fillColor[3];
    } catch (e) {}

    if(doUpdateColorGrid) updateColorGrid(color);
    updateView();

    localStorage.setItem('fillColor', helpers.rgbaToHex(fillColor[0], fillColor[1], fillColor[2], fillColor[3]).replace('#','0x'));

    startOver.removeAttribute('hidden');
  }

  function setRGBAttributes(element, color = undefined) {
    //console.log('setRGBAttributes', element, color);
    let alpha = rgbaSlider.value;

    if(color) {
      color = helpers.hexToRGBA(color);
      color[3] = (color[3] == undefined) ? 1 : color[3];
    } else {
      color = fillColor;
    }

    element.setAttribute('data-dirty', 'true');
    element.setAttribute('data-r', color[0]);
    element.setAttribute('data-g', color[1]);
    element.setAttribute('data-b', color[2]);
    element.setAttribute('data-a', rgbaSlider.value);

    element.querySelector('label span').innerHTML = `Cell ${String.fromCharCode(65+parseInt(element.getAttribute('data-row')))}${element.getAttribute('data-col')} is filled with Red ${color[0]} Green ${color[1]} Blue ${color[2]} Alpha ${Math.round(color[3] * 100) / 100}`;

    element.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
  }

  function updateColorGrid(color) {
    //console.log('updateColorGrid', color);
    let alphaArray = helpers.hexToRGBA(color);

    const checkedInputs = document.querySelectorAll('#stage input[type="checkbox"]:checked');
    if(checkedInputs.length) checkedInputs.forEach((element, index, array) => {
      let key = element.getAttribute('id').replace('c__','c');

      fillBack[key] = helpers.rgbaToHex(alphaArray[0], alphaArray[1], alphaArray[2], Number(rgbaSlider.value)).replace('#','0x');

      try {
        element.parentNode.querySelector('input[type="hidden"]').setAttribute('value', fillBack[key]);
      } catch(e) {}

      setRGBAttributes(element.parentNode);
      setCellBorderFilterColor(element.parentNode.querySelector('label'), helpers.invertColor(color));
    });
  }

  function setCellBorderFilterColor(label, color) {
    label.style.boxShadow = `0 0 5px ${color}`;
    label.style.borderColor = `${color}`;
  }

  function updateFaviconPreview() {
    let rows = document.querySelectorAll('#stage tbody tr'),
    svg = '';

    document.querySelectorAll('#stage tbody tr').forEach((row, i) => {
      let rects = drawRow(row, i);
      svg += rects.join('\n');

      function drawRow(row, rowIndex) {
        let rects = [];

        row.querySelectorAll('td:not(.row-col)').forEach((cell, x) => {
          if(cell.getAttribute('data-dirty') == 'true') {
            let rgb = [cell.getAttribute('data-r'), cell.getAttribute('data-g'), cell.getAttribute('data-b')],
            opacity = cell.getAttribute('data-a') ? ` opacity="${cell.getAttribute('data-a')}"` : '',
            color = helpers.rgbToHex(rgb[0], rgb[1], rgb[2]);

            rects.push(`<rect x="${x}" y="${rowIndex}" width="1" height="1" fill="${color}"${opacity}></rect>`);
          }
        });

        return rects;
      }
    });

    //document.querySelectorAll('.svg-preview__svg .art').forEach((element) => element.innerHTML = svg); // MS Edge has a bug :( http://codepen.io/jpdevries/pen/qaAwog
    document.querySelectorAll('.svg-preview__svg').forEach((element) => {
      //element.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="svg-preview__svg" viewBox="0 0 16 16"><g class="art">${svg}</g></svg>`;
      var prime = element.cloneNode(false);
      prime.innerHTML = `<g class="art">${svg}</g>`;
      element.outerHTML = prime.outerHTML;
    });
  }

  function updateFavicon() {
    updateFaviconPreview();

    let canvas = document.createElement('canvas'),
    ctx,
    img = document.createElement('img'),
    link = $('favicon'),
    svgHTML = encodeURIComponent(document.querySelector('.svg-preview__svg').outerHTML);

     if (canvas.getContext) {
       canvas.height = canvas.width = 16; // set the size
       ctx = canvas.getContext('2d');

       img.onload = function () { // once the image has loaded
         ctx.drawImage(this, 0, 0);
         link.href = canvas.toDataURL('image/png');
       };
       img.src = `data:image/svg+xml,${svgHTML}`;
     }
  }

  ranges.forEach((range, index) => {
    //console.log(fillColor, range);
    fillColor[index] = parseInt(range.value);

    range.addEventListener('input',function(e){
      fillColor[index] = parseInt(e.target.value); // update the fill color
      let color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2], rgbaSlider.value); //convert RGB values to hex
      updateColor(color);

      inputColorByRGBRadio.checked = true;
    });

    range.addEventListener('change',function(e){
      pushState();
      updateDownloadLinks();
    })
  });

  function handleInputColorByTextColorChange(e) {
    let color = helpers.cssColorNameToRGB(e.target.value, true),
    wasHex = e.target.value.charAt(0) == '#',
    wasBlack = (wasHex) ? color == '#000000' || color == '#000' : e.target.value.toLowerCase() == 'black';

    // detect if invalid color (black when it shouldn't be)
    if(!wasHex && !wasBlack && color[0] == 0 && color[1] == 0 && color[2] == 0) return;

    updateColor(helpers.rgbToHex(color[0],color[1],color[2]), false);
    pushState();
    updateDownloadLinks();
  }

  inputColorByTextColor.addEventListener('input', handleInputColorByTextColorChange);
  inputColorByTextColor.addEventListener('change', handleInputColorByTextColorChange);

  document.querySelector('#cell-grid__container header').innerHTML += `<h3>Select Cells</h3><div class="async-btns flexible unaligned fieldset">
    <button id="select_all_cells">Select all Cells</button>
    <button id="unselect_all_cells">Unselect all Cells</button>
    <button id="inverse_selection">Inverse Selection</button>
  </div>`;

  cellInputs.forEach((cell, index) => {
    cell.addEventListener('click', (e) => {
      //console.log(e);
      if((e.altKey || sKeyDown) && lastClickedCellInput) {
        let rows = document.querySelectorAll('#stage tbody tr'),
        start = Math.min(lastClickedCellInput.parentNode.getAttribute('data-row'), e.target.parentNode.getAttribute('data-row'));

        for(let i = start; i <= start + Math.abs(parseInt(lastClickedCellInput.parentNode.getAttribute('data-row')) - parseInt(e.target.parentNode.getAttribute('data-row'))); i++) {
          let tr = element,
          tds = tr.querySelectorAll('td');
          for(let j = 1 + Math.min(lastClickedCellInput.parentNode.getAttribute('data-col'), e.target.parentNode.getAttribute('data-col')); j <= 1 + Math.max(lastClickedCellInput.parentNode.getAttribute('data-col'), e.target.parentNode.getAttribute('data-col')); j++) {
            let td = tds[j],
            checkbox = td.querySelector('input[type="checkbox"]');

            if(e.target.parentNode !== td && lastClickedCellInput.parentNode !== td) {
              checkbox.checked = true;
              if(fillCellsOnClick.checked) {
                setRGBAttributes(td);
              }
            }
          }
        }
      }

      if(e.target.checked) {
        let color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2], 1),
        key = cell.getAttribute('id').replace('c__','c');

        fillBack[key] = color.replace('#','0x');

        if(fillCellsOnClick.checked) {
          setRGBAttributes(e.target.parentNode);
          setCellBorderFilterColor( e.target.parentNode.querySelector('label'), helpers.invertColor(helpers.rgbToHex(parseInt(e.target.parentNode.getAttribute('data-r')), parseInt(e.target.parentNode.getAttribute('data-g')), parseInt(e.target.parentNode.getAttribute('data-b')))) );
        }

        pushState();
      }

      updateView();

      //updateFavicon();
      //updateDownloadLinks();

      lastClickedCellInput = e.target;
    });
  });

  $('select_all_cells').addEventListener('click', function(e){
    e.preventDefault();
    fillSelectedCells.removeAttribute('disabled');
    cellInputs.forEach((cellInput) => {
      cellInput.checked = true
    });

  });

  $('unselect_all_cells').addEventListener('click', function(e){
    e.preventDefault();
    fillCellsOnClick.checked ? fillSelectedCells.setAttribute('disabled','true') : fillSelectedCells.removeAttribute('disabled');
    cellInputs.forEach((cellInput) => {
      cellInput.checked = false
    });
    unFocusTDCells();
  });

  function unFocusTDCells() {
    //console.log('unFocusTDCells');
    cellInputs.forEach((cellInput) => {
      if(!cellInput.checked) {
        try {
          let label = cellInput.parentNode.querySelector('label');
          unFocusTDCell(label);

        } catch(e) {}
      }
    });
  }

  $('inverse_selection').addEventListener('click', function(e){
    e.preventDefault();
    cellInputs.forEach((cellInput) => {
      cellInput.checked = !cellInput.checked
    });
  });

  function clearBoard() {
    cellInputs.forEach((cellInput) => {
      cellInput.checked = false;
      cellInput.parentNode.removeAttribute('style');
    });
  }

  function updateDownloadLinks() {
    document.querySelectorAll('a[download]').forEach((a) => {
      a.setAttribute('href', a.getAttribute('data-base-url') + location.search + '&dl=1')
    });
  }

  startOver.querySelector('a').addEventListener('click', function(e) {
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

  document.querySelector('.instructions').innerHTML = `Select cells above to fill them with the color chosen&nbsp;below.`;

  fillCellsOnClick.addEventListener('change', function(e) {
    (e.target.checked) ? fillSelectedCells.setAttribute('disabled','true') : fillSelectedCells.removeAttribute('disabled');
  });

  fillCellsOnClick.checked ? fillSelectedCells.setAttribute('disabled', 'true') : fillSelectedCells.removeAttribute('disabled');

  fillSelectedCells.addEventListener('click', function(event) {
    event.preventDefault();
    updateColorGrid(helpers.rgbaToHex(fillColor[0],fillColor[1],fillColor[2],fillColor[3]));
  });

  stage.addEventListener("change", function(event) {
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

  document.querySelector('.widget.import .svg-preview__svg').addEventListener('click', function(e) {
    $('pic').click();
  });

  document.addEventListener('enhancementsloaded', () => {
    updateColor(helpers.rgbaToHex($('rgb_slider_r').value, $('rgb_slider_g').value, $('rgb_slider_b').value, $('rgb_slider_a').value))
  })



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
    let newURL = (function(){
      let a = [];

      Object.keys(fillBack).forEach(function(key) {
        a.push(`${key}=${fillBack[key]}`);
      });

      return a.join('&');
    })();

    window.history.pushState(fillBack, 'Makeanico', `/?${newURL}`);
  }

  window.onpopstate = function(event) {
    //console.log('popstate');
    clearBoard(); // clear the art board

    fillBack = event.state; // set the new state

    Object.keys(fillBack).forEach(function(key) { // draw the new state
      setRGBAttributes($(key.replace('c','c__')).parentNode, fillBack[key].replace('0x', '#'));
    });

    window.scrollTo(0,0); // scroll to the top
  };
};

exports.MakeAnIco = MakeAnIco;
