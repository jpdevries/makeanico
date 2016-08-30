const helpers = require('./helpers');

const MakeAnIco = function() {
  const inputColorSupport = (function(){
    const i = document.createElement("input");
    i.setAttribute("type", "color");
    return i.type !== "text";
  })();

  if(inputColorSupport) { // only add colorpicker option if the browser supports <input type="color">, auto select colorpicker option if no others are selected
    (function(fieldset){
      fieldset.innerHTML = `<label for="input_color_by__colorpicker">Colorpicker:</label>
      <input type="color" id="input_color_by__colorpicker" name="input_color_by__colorpicker" value="" />`;
      fieldset.removeAttribute('hidden');
    })(document.querySelector('.colorpicker.fieldset'));

    (function(colorOption){
      colorOption.innerHTML = `<label for="input_color_by__text__colorpicker">Colorpicker: </label>
      <input type="radio" id="input_color_by__text__colorpicker" name="input_color_by" value="colorpicker" />`;
      colorOption.removeAttribute('hidden');
    })(document.querySelector('.color.option'));

    if(!(document.getElementById('input_color_by__text').checked || document.getElementById('input_color_by__rgb').checked)) inputColorByColorpicker.checked = true;
  }

  const form = document.getElementById('makeanico'),
  ranges = document.querySelectorAll('input[type="range"]'),
  cellInputs = document.querySelectorAll('#stage input'),
  cellGridContainer = document.getElementById('cell-grid__container'),
  inputColorByRGBRadio = document.getElementById('input_color_by__rgb'),
  inputColorByTextColor = document.getElementById('input_color_by__text__color'),
  inputColorByColorpicker = document.getElementById('input_color_by__colorpicker'),
  fillCellsOnClick = document.getElementById('fill-cells-on-click');

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

  function updateView() {
    updateFavicon();
    updateDownloadLinks();

    const isBlank = !Object.keys(fillBack).length;
    let dataDependents = document.querySelectorAll('.data-dependent');
    for(let i = 0; i < dataDependents.length; i++) (isBlank) ? dataDependents[i].setAttribute('hidden', 'true') : dataDependents[i].removeAttribute('hidden');
  }

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

  let fillColor = [255, 255, 255, 100];
  if(localStorage.getItem('fillColor')) {
    updateColor(localStorage.getItem('fillColor'));
  }

  function updateColor(color, updateTextField = true) {
    fillColor = helpers.cssColorNameToRGB(color.replace('0x', '#'), true);
    let wasHex = color.charCodeAt(0) == '#';
    let wasBlack = (wasHex) ? color == '#000000' || color == '#000' : color.toLowerCase() == 'black';
    color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2]);

    if(!wasHex && !wasBlack && color == '#000000') return;

    cellGridContainer.classList.add('dirty');
    cellGridContainer.style.borderColor = color;

    if(updateTextField) inputColorByTextColor.value = color;

    for(let i = 0; i < 3; i++) {
      //console.log('setting ' + i + ' to ' + fillColor[i], ranges[i]);
      ranges[i].value = fillColor[i];
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

  function updateColorGrid(color) {
    let checkedCells = document.querySelectorAll('#stage input[type="checkbox"]:checked');
    for(let i = 0; i < checkedCells.length; i++) {
      let key = checkedCells[i].getAttribute('id').replace('cell__','c');
      //console.log(key,color.replace('#','0x'));
      fillBack[key] = color.replace('#','0x');
      checkedCells[i].parentNode.style.backgroundColor = color;
      checkedCells[i].parentNode.setAttribute('data-dirty','true');
    }
  }

  function updateFaviconPreview() {
    let rows = document.querySelectorAll('#stage tbody tr'),
    svg = '';
    for(let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let rects = drawRow(row, i);

      svg += rects.join('\n');

      function drawRow(row, rowIndex) {
        let rects = [];
        let cells = row.querySelectorAll('td:not(.row-col)');
        for(let i = 0; i < cells.length; i++) {
          let cell = cells[i];
          if(cell.getAttribute('data-dirty') == 'true') {
            let rgb = helpers.cssColorNameToRGB(cell.style.backgroundColor, true);
            let color = helpers.rgbToHex(rgb[0], rgb[1], rgb[2]);

            rects.push(`<rect x="${i}" y="${rowIndex}" width="1" height="1" fill="${color}"></rect>`);
          }
        }
        return rects;
      }
    }

    //document.querySelector('#svg-preview__svg #art').innerHTML = svg;
    let svgs = document.querySelectorAll('.svg-preview__svg .art');
    for(let i = 0; i < svgs.length; i++) svgs[i].innerHTML = svg;
  }

  function updateFavicon() {
    updateFaviconPreview();

    let canvas = document.createElement('canvas'),
    ctx,
    img = document.createElement('img'),
    link = document.getElementById('favicon'),
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

  for(let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const index = i;
    fillColor[i] = parseInt(range.value);

    range.addEventListener('input',function(e){
      fillColor[index] = parseInt(e.target.value); // update the fill color
      console.log(fillColor);
      let color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2]); //convert RGB values to hex
      updateColor(color);

      inputColorByRGBRadio.checked = true;
    });

    range.addEventListener('change',function(e){
      pushState();
      updateDownloadLinks();
    })
  }

  inputColorByTextColor.addEventListener('input',function(e){
    document.getElementById('input_color_by__text').checked = true;
    updateColor(e.target.value, false);
    pushState();
    updateDownloadLinks();
  });

  try {
    inputColorByColorpicker.addEventListener('input',function(e){
      document.getElementById('input_color_by__text__colorpicker').checked = true;
      updateColor(e.target.value);
      updateDownloadLinks();
    });

    inputColorByColorpicker.addEventListener('change',function(e){
      pushState();
      console.log(event.target.value);
    });
  } catch (e) { console.log(e) }

  document.querySelector('[no-js]').remove();
  //document.querySelector('button[type="reset"]').remove();

  document.querySelector('#cell-grid__container header').innerHTML += `<h3>Select Cells</h3><div class="async-btns flexible unaligned fieldset">

    <button id="select_all_cells">Select all Cells</button>
    <button id="unselect_all_cells">Unselect all Cells</button>
    <button id="inverse_selection">Inverse Selection</button>
  </div>`;

  for(let i = 0; i < cellInputs.length; i++) {
    let cell = cellInputs[i];
    //console.log(cell);
    cell.addEventListener('click', function(e) {
      if(e.target.checked) {
        let color = helpers.rgbToHex(fillColor[0], fillColor[1], fillColor[2]);

        let key = cell.getAttribute('id').replace('cell__','c');
        fillBack[key] = color.replace('#','0x');

        if(fillCellsOnClick.checked) {
          e.target.parentNode.style.backgroundColor = color;
          e.target.parentNode.setAttribute('data-dirty','true');
        }

        pushState();
      }

      updateView();
      //updateFavicon();
      //updateDownloadLinks();
    });
  }

  document.getElementById('select_all_cells').addEventListener('click', function(e){
    e.preventDefault();
    for(let i = 0; i < cellInputs.length; i++) cellInputs[i].checked = true;
  });

  document.getElementById('unselect_all_cells').addEventListener('click', function(e){
    e.preventDefault();
    for(let i = 0; i < cellInputs.length; i++) cellInputs[i].checked = false;
  });

  document.getElementById('inverse_selection').addEventListener('click', function(e){
    e.preventDefault();
    for(let i = 0; i < cellInputs.length; i++) cellInputs[i].checked = !cellInputs[i].checked;
  });

  document.addEventListener('keydown', function(event) {
    //console.log(event);
    if (event.ctrlKey && event.which === 65) { // ctrl + a
        document.getElementById('select_all_cells').click();
    }

    if (event.ctrlKey && event.which === 68) { // ctrl + d
        document.getElementById('unselect_all_cells').click();
    }

    if (event.ctrlKey && event.which === 73) { // ctrl + i
        document.getElementById('inverse_selection').click();
    }

    if (event.ctrlKey && event.which === 8) { // ctrl + backspace
        document.getElementById('inverse_selection').click();
    }
  });

  function clearBoard() {
    for(let i = 0; i < cellInputs.length; i++) {
      let cell = cellInputs[i];
      cell.checked = false;
      cell.parentNode.removeAttribute('style');
    }
  }

  function updateDownloadLinks() {
    console.log('updateDownloadLinks', location.search);
    let downloadAnchors = document.querySelectorAll('a[download]');
    for(let i = 0; i < downloadAnchors.length; i++) {
      let a = downloadAnchors[i];
      a.setAttribute('href', a.getAttribute('data-base-url') + location.search + '&dl=1');
    }
  }

  document.querySelector('#start-over a').addEventListener('click', function(e){
    e.preventDefault();

    window.history.pushState({}, 'Makeanico', `/`);
    clearBoard();

    form.reset();
    cellGridContainer.removeAttribute('style');
    cellGridContainer.classList.remove('dirty');

    window.scrollTo(0,0);
  });

  document.querySelector('.instructions').innerHTML = `Select cells above to fill them with the color chosen&nbsp;below.`;

  fillCellsOnClick.addEventListener('change', function(e) {
    (e.target.checked) ? document.getElementById('fill-selected-cells').setAttribute('disabled','true') : document.getElementById('fill-selected-cells').removeAttribute('disabled');
  });

  document.getElementById('filename__text').addEventListener('input', function(e) {
    let filenames = document.querySelectorAll('.filename');
    for(let i = 0; i < filenames.length; i++) {
      filenames[i].innerHTML = e.target.value ? e.target.value : 'favicon';
    }

    let anchors = document.querySelectorAll('nav.button-bar a');
    for(let i = 0; i < anchors.length; i++) {
      let anchor = anchors[i];
      anchor.setAttribute('download', `${e.target.value || 'favicon'}.${anchor.getAttribute('data-format')}`);
    }
  });

  const downloadBtns = document.querySelectorAll('input[name="download__as"]');
  for(let i = 0; i < downloadBtns.length; i++) {
    let downloadBtn = downloadBtns[i];

    downloadBtn.addEventListener('change', function(e) {
      let anchors = document.querySelectorAll('nav.button-bar a');

      for(let i = 0; i < anchors.length; i++) {
        let anchor = anchors[i];
        (e.target.value == anchor.getAttribute('data-format')) ? anchor.removeAttribute('hidden') : anchor.setAttribute('hidden', 'true');
        console.log(`${event.target.value}.${anchor.getAttribute('data-format')}`);
      }

      let extensions = document.querySelectorAll('.extension');
      for(let i = 0; i < extensions.length; i++) {
        extensions[i].innerHTML = e.target.value;
      }
    });
  }

  window.onpopstate = function(event) {
    clearBoard(); // clear the art board

    fillBack = event.state; // set the new state

    Object.keys(fillBack).forEach(function(key) { // draw the new state
      document.getElementById(key.replace('c','cell__')).parentNode.style.backgroundColor = fillBack[key].replace('0x','#');
    });

    window.scrollTo(0,0); // scroll to the top
  };
};

exports.MakeAnIco = MakeAnIco;
