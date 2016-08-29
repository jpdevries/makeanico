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
svg_to_png = require('svg-to-png'),
rmdir = require('rimraf'),
//endpoints = require('./_build/js/model/endpoints'),
path = require('path'),
app = express();

const toIco = require('to-ico');
const tmpDir = './temp';
//PNG = require('png-coder').PNG;

const PNGPixel = require('png-pixel');

const lwip = require('lwip');

const PNG = require('pngjs').PNG;

const transparent = {r: 255, g: 255, b: 255, a: 0};

if(process.env.NODE_ENV) {
  app.use(minifyHTML({
    override: true,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: false,
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

app.get('/png-coder', function(req, res) {
  console.log('get png-coder ' + new Date().getTime());
  let redirect = '';

  createDirectoryIfNonExistant(tmpDir);

  let folder = fs.mkdtempSync(tmpDir + path.sep);

  lwip.open('favicon24.png', function(err, image) {
    // check err...
    // define a batch of manipulations and save to disk as JPEG:
    image.batch()
      .contain(16,16)          // scale to 16x16
      .writeFile(folder + path.sep + 'favicon16.png', function(err) {
        console.log('wrote ' + folder + path.sep + 'favicon16.png');

        fs.createReadStream(folder + path.sep + 'favicon16.png').pipe(new PNG({
          depth:8
        })).on('parsed', function() {
          console.log('parsed', this.width, this.height);
          let c = 0;
          let params = [];
          for (let y = 0; y < this.height; y++) {
              for (let x = 0; x < this.width; x++) {
                  let idx = (this.width * y + x) << 2;
                  //console.log(idx, this.data[idx+3]);
                  let hex = helpers.rgbToHex(this.data[idx], this.data[idx+1], this.data[idx+2]);

                  //console.log(hex);

                  // if not transparent paint the cell param
                  if(this.data[idx+3]) params.push(`c${c}=${hex.replace('#','0x')}`);

                  c++;
              }
          }

          res.redirect(`/?${params.join('&')}`);
          res.end();

        });

      });

  });

});

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

    //console.log(targetColor);
    //console.log(fields);
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

  });
});

app.get('/make/favicon.svg', function(req, res){
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

app.get('/make/favicon.png', function(req, res) {
  let filledCells = getFilledCells(req.query);
  let cells = getCells(filledCells);

  createDirectoryIfNonExistant(tmpDir);

  if(req.query['dl']) res.setHeader('Content-Disposition', contentDisposition(undefined,{
    type:'attachment'
  }));

  urlParamsToPNG(cells).then(function(buffer) {
    res.end(buffer);
  });

});

app.get('/make/favicon.ico', function(req, res) {
  let filledCells = getFilledCells(req.query);
  let cells = getCells(filledCells);

  createDirectoryIfNonExistant(tmpDir);

  if(req.query['dl']) res.setHeader('Content-Disposition', contentDisposition(undefined,{
    type:'attachment'
  }));

  urlParamsToPNG(cells).then(function(buffer) {
    const files = [buffer];

    toIco(files).then(buf => {
      res.end(buf);
    });
  });
});

app.get('/es', function(req, res) { // this is kind of weird. This is to support the ExtendScript which reads a Photoshop file, creates a 16x16 favicon and creates a MakeAnIco URL for it. The mac terminal open command only supports one URL param, so this supports cramming all the data in one URL by parsing that param and redirect to the appropriate endpoint
  try {
    let cells = req.query.d.split('__').map((cell) => (
      cell.split('0x')[0] + '=0x' + cell.split('0x')[1]
    )).join('&');

    res.redirect(`/?${cells}`);
  } catch(e) {
    res.redirect(`/`);
  }
  res.end();
});

function createDirectoryIfNonExistant(dir) {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}

function svgToPNG(folder) { // consider https://www.npmjs.com/package/png-pixel
  return svg_to_png.convert([folder + path.sep + 'favicon.svg'], folder) // async, returns promise
  .then(() => ([
        fs.readFileSync(folder + path.sep + 'favicon.png')
  ]));
}

function urlParamsToPNG(cells) {
  return new Promise(function(resolve, reject) {
    let pixels = [];

    cells.map(function(row) {
      row.map(function(cell) {
        if(cell.fill) pixels.push({
          x: cell.column,
          y: cell.row,
          color: cell.fill.replace('#','').toUpperCase()
        });
      });
    });

    fs.mkdtemp(tmpDir + path.sep, (err, folder) => {
      if (err) throw err;
      console.log(folder);

      lwip.create(16, 16, transparent, function(err, image) {
        image.writeFile(folder + path.sep + 'favicon.png', function(err) { // save the matte image to the filesystem
          PNGPixel.add(folder + path.sep + 'favicon.png', folder + path.sep + 'favicon.png', pixels)
          .then(function(writeStream) {
            writeStream.on('close', function() {
              fs.readFile(this.path, function(err, buffer) {
                resolve(buffer);

                rmdir(folder, function(error){
                  try {
                    fs.rmdirSync(tmpDir);
                  } catch(e) { console.log(e) }
                });

              });
            });
          }); // end PNGPixel
        }); // end image.writeFile
      }); // end lwip.create
    }); // end fs.mkdtemp
  });
}

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
