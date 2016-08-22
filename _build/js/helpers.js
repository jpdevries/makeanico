/*var invertColor = function (hexTripletColor) { // http://jsfiddle.net/salman/f9Re3/
    var color = hexTripletColor;
    color = color.substring(1); // remove #
    color = parseInt(color, 16); // convert to integer
    color = 0xFFFFFF ^ color; // invert three bytes
    color = color.toString(16); // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color; // prepend #
    return color;
}*/

var cssColorNameToRGB = function(colorName, returnArray = false) { // http://stackoverflow.com/a/1573154/4671250
    var d = document.createElement("div");
    d.style.color = colorName;
    d.style.display = 'none';
    document.body.appendChild(d);
    //Color in RGB

    var rgb = window.getComputedStyle(d).color;
    d.remove();
    if(!returnArray) return rgb;

    rgb = rgb.replace('rgb(','');
    rgb = rgb.replace(')','');
    return rgb.split(',').map((color) => (
      parseInt(color)
    ));
}

var hexToRGB = function(hexo) {
  if(!hexo) return undefined;
  var hex = hexo.toString();
  if(!hex.includes('0x')) return hexo;
  var rgb = parseInt(hex, 16); // value is 1675421

  var red   = (rgb >> 16) & 0xFF; // returns 255
  var green = (rgb >> 8) & 0xFF;  // 170
  var blue  = rgb & 0xFF;     // 221

  return `rgb(${[red,green,blue].join(',')})`;
}

const componentToHex = c => {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(componentToHex).join(''); // http://stackoverflow.com/a/5624139/4671250

module.exports = {
  //invertColor: invertColor,
  cssColorNameToRGB: cssColorNameToRGB,
  hexToRGB: hexToRGB,
  rgbToHex:rgbToHex
};
