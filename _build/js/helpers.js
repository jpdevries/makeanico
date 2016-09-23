const hexToRgba = require('hex-and-rgba').hexToRgba,
rgbaToHex = require('hex-and-rgba').rgbaToHex,

invertColor = function (hexTripletColor) { // http://jsfiddle.net/salman/f9Re3/
    var color = hexTripletColor;
    color = color.substring(1); // remove #
    color = parseInt(color, 16); // convert to integer
    color = 0xFFFFFF ^ color; // invert three bytes
    color = color.toString(16); // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color; // prepend #
    return color;
},
cssColorNameToRGB = function(colorName, returnArray = false) { // http://stackoverflow.com/a/1573154/4671250
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
};

module.exports = {
  invertColor: invertColor,
  cssColorNameToRGB: cssColorNameToRGB,
  hexToRGB: hexToRgba,
  hexToRGBA: hexToRgba,
  rgbToHex:rgbaToHex,
  rgbaToHex:rgbaToHex
};
