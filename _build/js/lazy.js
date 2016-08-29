require('./detect');

const inputColorByTextColor = document.getElementById('input_color_by__text__color');

let datalist = document.createElement('datalist');
let dataListSelect = document.createElement('select');

datalist.setAttribute('id', 'input_color_by__text__datalist');
datalist.setAttribute('name', 'input_color_by__text__datalist');
dataListSelect.setAttribute('id', 'input_color_by__text__select');

const CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RebeccaPurple","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

let cssNamesOptGroup = createOptGroup('Color Names', CSS_COLOR_NAMES);
let swatchOptGroup = createOptGroup('Swatches', ['#FF0000', '#00FF00', '#0000FF'], false);
dataListSelect.appendChild(cssNamesOptGroup);
console.log('optGroup',cssNamesOptGroup);

/*let otherOptGroup = document.createElement('optgroup');
let opt = document.createElement('option');
otherOptGroup.setAttribute('label', ' Other');
opt.innerHTML = 'Other';
otherOptGroup.appendChild(opt);
*/

//dataListSelect.appendChild(otherOptGroup);


let colorLabel = (function(){
  let label = document.createElement('label');
  label.setAttribute('for', 'input_color_by__text__color');
  label.innerHTML = 'Color Name:';
  return label;
})();

datalist.appendChild(colorLabel);
datalist.appendChild(dataListSelect);
datalist.appendChild(swatchOptGroup);

//inputColorByTextColor.parentNode.appendChild(dataListSelect);

inputColorByTextColor.setAttribute('list', datalist.getAttribute('id'));
inputColorByTextColor.parentNode.appendChild(datalist);

function createOptGroup(label, colors, lowercase = true) {
  let optGroup = document.createElement('optgroup');

  optGroup.setAttribute('label', label);

  colors.map(function(color){
    let opt = document.createElement('option');
    opt.setAttribute('value', lowercase ? color.toLowerCase() : color);
    opt.innerHTML = color;
    optGroup.appendChild(opt);
  });

  return optGroup;
}
