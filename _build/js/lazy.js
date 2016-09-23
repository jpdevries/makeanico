require('./detect');

const helpers = require('./helpers'),
inputColorByTextColor = document.getElementById('input_color_by__text__color'),
CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RebeccaPurple","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

let datalist = document.createElement('datalist'),
dataListSelect = document.createElement('select'),
cssNamesOptGroup = createOptGroup('Color Names', CSS_COLOR_NAMES);

datalist.setAttribute('id', 'input_color_by__text__datalist');
datalist.setAttribute('name', 'input_color_by__text__datalist');
dataListSelect.setAttribute('id', 'input_color_by__text__select');
dataListSelect.setAttribute('name', 'input_color_by__text__color');

cssNamesOptGroup.innerHTML = `<option value="">Hexadecimal</option>` + cssNamesOptGroup.innerHTML,
dataListSelect.appendChild(cssNamesOptGroup);

let colorLabel = (function(){
  let label = document.createElement('label');
  label.setAttribute('for', 'input_color_by__text__color');
  label.innerHTML = 'Color Name:';
  return label;
})();

datalist.appendChild(colorLabel);
datalist.appendChild(dataListSelect);
datalist.appendChild(createOptGroup('Swatches', ['#FF0000', '#00FF00', '#0000FF'], false));

dataListSelect.addEventListener('change', function(event) {
  inputColorByTextColor.value = event.target.value;
  inputColorByTextColor.dispatchEvent(new Event('change'));
});



inputColorByTextColor.setAttribute('list', datalist.getAttribute('id'));
inputColorByTextColor.parentNode.appendChild(datalist);

function createOptGroup(label, colors, toHex = true) {
  let optGroup = document.createElement('optgroup');

  optGroup.setAttribute('label', label);

  colors.map(function(color){
    let opt = document.createElement('option');
    opt.innerHTML = color;
    if(toHex) {
      let rgb = helpers.cssColorNameToRGB(color, true);
      color = helpers.rgbToHex(rgb[0], rgb[1], rgb[2]);
    }
    opt.setAttribute('value', color);
    optGroup.appendChild(opt);
  });

  return optGroup;
}
