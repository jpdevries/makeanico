var form = makeanico,
ranges = document.querySelectorAll('input[type="range"]'),
cellInputs = document.querySelectorAll('#stage input[type="checkbox"]'),
cellGridContainer = $('cell-grid__container'),
inputColorByRGBRadio = $('input_color_by__rgb'),
//inputColorByColorpicker = $('input_color_by__colorpicker'),
fillCellsOnClick = $('fill-cells-on-click'),
fillSelectedCells = $('fill-selected-cells'),
rgbaSlider = $('rgb_slider_a'),
stage = $('stage'),
startOver = $('start-over'),
makeanico = $('makeanico'),
sKeyDown = false,
lastClickedCellInput;

function elementToHex(element) {
  return helpers.rgbaToHex(parseInt(element.getAttribute('data-r')), parseInt(element.getAttribute('data-g')), parseInt(element.getAttribute('data-b')), Number(element.getAttribute('data-a'))).replace('#','0x')
}
