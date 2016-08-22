require('babel-core/register')({
    presets: ['es2015']
});

const http = require('http'),
fs = require('fs'),
Twig = require("twig"),
express = require('express'),
formidable = require("formidable"),
helpers = require('./_build/js/helpers'),
color = require('onecolor'),
compression = require('compression'),
contentDisposition = require('content-disposition'),
minifyHTML = require('express-minify-html'),
//endpoints = require('./_build/js/model/endpoints'),
app = express();

if(process.env.NODE_ENV) {
  app.use(minifyHTML({
    override: true,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  }));

  app.use(compression({ level: 9, threshold: 0 }));  
}

app.use(express.static(__dirname));

var CellDTO = function(index = 0, row = 0, column = 0, checked = false, fill = undefined) {

  return {
    index:index,
    row:row,
    column:column,
    checked:checked,
    fill:(fill) ? color(fill.toString().replace('0x','#')).hex() : fill
  };
}

function getFilledCells(fields) {
  var filledCells = [];
  for(let key in fields) {
    let value = fields[key];

    if(key.match(/c\d/i)) {
      let index = parseInt(key.substring(1));
      filledCells[index] = value;
    }
  }
  return filledCells;
}

function getSelectedCells(fields) {
  var filledCells = [];
  for(let key in fields) {
    let value = fields[key];

    if(key.includes('cell__')) {
      let index = parseInt(key.replace('cell__',''));
      filledCells.push(index);
    }
  }
  return filledCells;
}

function getCellURLString(fields) {
  let a = [];
  for(let key in fields) {
    let value = fields[key];

    if(key.match(/c\d/i)) {
      a.push(`${key}=${value}`);
    }
  }

  return a.join('&');
}

function getCells(filledCells) {
  const a = [];
  for(let row = 0; row < 16; row++) {
    a.push(createRow(row));

    function createRow(row) {
      const a = [];
      for(let col = 0; col < 16; col++) {
        const index = col + (row * 16);
        a.push(CellDTO(index, row, col, false, filledCells[index]))
      }
      return a;
    }
  }
  return a;
}

app.get('/', function(req, res) {
  //res.set('Content-Encoding', 'gzip');
  var filledCells = getFilledCells(req.query);
  let cells = getCells(filledCells);

  res.render('index.twig',{
    cells: cells,
    startOver: filledCells.length > 0,
    cellURL: getCellURLString(req.query)
  });
});

app.post('/', function(req, res) {
  const form = new formidable.IncomingForm();



  form.parse(req, function(err, fields, files){
    let targetColor = '#FFFFFF';
    if(fields['input_color_by'] == 'text' && fields['input_color_by__text__color']) {
      targetColor = fields['input_color_by__text__color'].replace('0x','#');
    } else if(fields['input_color_by'] == 'colorpicker' && fields['input_color_by__colorpicker']) {
      targetColor = fields['input_color_by__colorpicker'].replace('0x','#');
    } else {
      targetColor = `rgb(${[fields['rgb_slider_r'],fields['rgb_slider_g'],fields['rgb_slider_b']].join(',')})`;
    }

    console.log(targetColor);
    console.log(fields);
    var filledCells = getFilledCells(fields);
    var selectedCells = getSelectedCells(fields);
    selectedCells.map(function(value){
      filledCells[value] = color(targetColor).hex().replace('#','0x');
    });

    let redirect = filledCells.map((value,index) => (
      `c${index}=${value}`
    )).filter((value) => (value)).join('&');

    res.redirect(`/?${redirect}`);
    res.end();

    /*res.json({
      fields:fields,
      filledCells:filledCells,
      selectedCells:selectedCells,
      redirect:redirect
    });*/
  });
});

app.get('/favicon.svg', function(req, res){
  var filledCells = getFilledCells(req.query);
  let cells = getCells(filledCells);

  res.setHeader('Content-Type', 'image/svg+xml');

  if(req.query['dl']) res.setHeader('Content-Disposition', contentDisposition(undefined,{
    type:'attachment'
  }));

  res.render('svg-preview.twig',{
    cells: cells
  });
});

/*app.get('*.min.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.get('*.min.css', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});*/
       /*             __
      /\ \__         /\ \__  __
  ____\ \ ,_\    __  \ \ ,_\/\_\    ___         ____     __   _ __   __  __     __   _ __
 /',__\\ \ \/  /'__`\ \ \ \/\/\ \  /'___\      /',__\  /'__`\/\`'__\/\ \/\ \  /'__`\/\`'__\
/\__, `\\ \ \_/\ \L\.\_\ \ \_\ \ \/\ \__/     /\__, `\/\  __/\ \ \/ \ \ \_/ |/\  __/\ \ \/
\/\____/ \ \__\ \__/.\_\\ \__\\ \_\ \____\    \/\____/\ \____\\ \_\  \ \___/ \ \____\\ \_\
 \/___/   \/__/\/__/\/_/ \/__/ \/_/\/____/     \/___/  \/____/ \/_/   \/__/   \/____/ \/*/





app.listen(process.env.PORT || 1188);

console.log("server listening on " + (process.env.PORT || 1188));
console.log("Visit http://localhost:" + (process.env.PORT || 1188) + " in your browser");
