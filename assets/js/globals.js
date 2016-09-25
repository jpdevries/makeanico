var form = makeanico,
ranges = document.querySelectorAll('input[type="range"]'),
cellInputs = document.querySelectorAll('#stage input[type="checkbox"]'),
cellGridContainer = document.getElementById('cell-grid__container'),
inputColorByRGBRadio = document.getElementById('input_color_by__rgb'),
//inputColorByColorpicker = document.getElementById('input_color_by__colorpicker'),
fillCellsOnClick = document.getElementById('fill-cells-on-click'),
fillSelectedCells = document.getElementById('fill-selected-cells'),
rgbaSlider = document.getElementById('rgb_slider_a'),
stage = document.getElementById('stage'),
startOver = document.getElementById('start-over'),
makeanico = document.getElementById('makeanico'),
sKeyDown = false,
lastClickedCellInput;

function elementToHex(element) {
  return helpers.rgbaToHex(parseInt(element.getAttribute('data-r')), parseInt(element.getAttribute('data-g')), parseInt(element.getAttribute('data-b')), Number(element.getAttribute('data-a'))).replace('#','0x')
}
