/*require('babel-core/register')({
    presets: ['es2015']
});*/

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

//PNG = require('png-coder').PNG;
const redirects = require('./_build/js/redirects'),
util = require('util'),
svg2png = require('svg2png'),
toIco = require('to-ico'),
tmpDir = './temp',
PNGPixel = require('png-pixel'),
lwip = require('node-lwip'),
PNG = require('pngjs').PNG,
transparent = {r: 255, g: 255, b: 255, a: 0},
hexToRgba = require('hex-and-rgba').hexToRgba,
rgbaToHex = require('hex-and-rgba').rgbaToHex;

if(process.env.NODE_ENV == 'production') {
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
  //console.log(fill);
  let rgba = [transparent.a, transparent.g, transparent.b, transparent.a];
  let opacity = undefined;
  let hex = '#FFFFFF';
  if(fill) {
    try {
      fill = hex = color(fill.toString().replace('0x','#')).hex();
      opacity = 1;
    } catch(e) {
      fill = hexToRgba(fill.replace('0x','#'));
      hex = rgbaToHex(fill[0],fill[1],fill[2],fill[3]);
      opacity = fill[3];
      fill = `rgba(${fill[0]},${fill[1]},${fill[2]},${fill[3]})`;
    }

    rgba = hexToRgba(hex);
    //rgba[3] = opacity;
    //console.log(opacity);

  }

  rowLabel = String.fromCharCode(65 + row);


  let d = {
    index:index,
    row:row,
    column:column,
    checked:checked,
    fill:fill,
    rgba:rgba,
    hex:hex,
    rgb:rgbaToHex(rgba[0],rgba[1],rgba[2]),
    opacity:opacity,
    rowLabel:rowLabel
  };
  console.log(d);
  return d;
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

    if(key.includes('c__')) {
      let index = parseInt(key.replace('c__',''));
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
        //console.log('!!',filledCells[index]);
        a.push(CellDTO(index, row, col, false, filledCells[index]))
      }
      return a;
    }
  }
  return a;
}

function rasterizeIfNeeded(pic) {
  console.log('rasterizeIfNeeded', pic.path);
  return new Promise(function(resolve, reject) {
    //console.log('resolving');
    if(pic.type !== 'image/svg+xml') {
      resolve({
        filepath: pic.path,
        isBuffer: false
      });
    } else {

      fs.readFile(pic.path, function (err, buffer) {
          if (err) reject(err);
          console.log(buffer);

          svg2png(buffer, {})
            .then((buf) => {
              console.log(buf);
              fs.writeFile("dest.png", buf);
              resolve({
                filepath: buf,
                isBuffer: true
              });
            })
            .catch(e => console.error(e))
          ;

          //resolve(pic.path);
      });
    }
  });
}

app.post('/png-coder', function(req, res) {
  var form = new formidable.IncomingForm();

  //form.uploadDir = tmpDir;
  form.keepExtensions = true;

  form.parse(req, function(err, fields, files) {
    //res.writeHead(200, {'content-type': 'text/plain'});
    //res.write('received upload:\n\n');
    console.log(files.pic.path);
    console.log(files.pic.type);

    rasterizeIfNeeded(files.pic).then(function(data) {
      let filepath = data.filepath,
      isBuffer = data.isBuffer;

      console.log('resolved', isBuffer);

      let callback = function(err, image) {
        image.batch()
        .cover(16,16)
        .exec(function(err, image) {
          let params = [],
          i = 0;
          for(let y = 0; y < 16; y++) {
            for(let x = 0; x < 16; x++) {
              let rgb = image.getPixel(x, y),
              hex = helpers.rgbToHex(rgb.r, rgb.g, rgb.b, rgb.a / 100);

              console.log(rgb);

              if(rgb.a) {
                params.push(`c${i}=${hex.replace('#','0x')}`);
              }

              i++;
            }
          }

          res.redirect(`/?${params.join('&')}`);
          res.end();
        });
      };

      if(isBuffer) {
        lwip.open(filepath, 'png', callback);
      } else {
        lwip.open(filepath, callback);
      }

    }, function(err) {
      console.log('err', err);
    });

    //res.end(util.inspect({fields: fields, files: files}));
  });



});

/* redirects */

Object.keys(redirects).forEach(function(key) {
  //http://localhost:1188/icos/modx
  app.get(key, function(req, res) {
    res.redirect(redirects[key]);
    res.end();
  });
  //http://localhost:1188/get/svg/icos/modx
  //http://localhost:1188/get/svg/icos/flags/zw
  app.get(`/get/svg${key}`, function(req, res) {
    res.redirect(`/make/favicon.svg${redirects[key]}${(req.query['dl']) ? '&dl=1' : ''}`);
    res.end();
  });
  //http://localhost:1188/get/png/icos/flags/nl
  app.get(`/get/png${key}`, function(req, res) {
    res.redirect(`/make/favicon.png${redirects[key]}${(req.query['dl']) ? '&dl=1' : ''}`);
    res.end();
  });
  //http://localhost:1188/get/ico/icos/flags/zw
  app.get(`/get/ico${key}`, function(req, res) {
    res.redirect(`/make/favicon.ico${redirects[key]}${(req.query['dl']) ? '&dl=1' : ''}`);
    res.end();
  });
});

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

app.get('/api/components/:component', function(req, res) {
  res.render(`components/${req.params.component}.twig`, {
    production: process.env.NODE_ENV == 'production'
  });
});

app.get('/preferences', function(req, res) {
  const baseUrl = getBaseUrl(req);
  res.render('preferences.twig',{
    baseUrl: baseUrl,
    production: process.env.NODE_ENV == 'production'
  });
});

function getBaseUrl(req) {
  return `${(req.protocol + '://' + req.get('host').substr(-1)) !== '/'}` ? `${req.protocol + '://' + req.get('host')}/` : req.protocol + '://' + req.get('host')
}

app.get('/', function(req, res) {
  const baseUrl = getBaseUrl(req);
  //res.set('Content-Encoding', 'gzip');
  var filledCells = getFilledCells(req.query);
  let cells = getCells(filledCells);

  res.render('index.twig',{
    fill:req.query.fill || undefined,
    fillRGBA:req.query.fill ? hexToRgba(req.query.fill.replace('0x','#')) : undefined,
    cells: cells,
    startOver: filledCells.length > 0,
    colorBy:req.query.colorby || undefined,
    cellURL: getCellURLString(req.query),
    baseUrl: baseUrl,
    production: process.env.NODE_ENV == 'production',
    rowLabels:(function(){
      let a = [];
      for(let i = 65; i <= 81; i++) {
        a.push(String.fromCharCode(i));
      }
      return a;
    })()
  });
});

app.post('/', function(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    let targetColor = '#FFFFFF';
    let hex;
    let colorBy = 'rgba';
    if(fields['input_color_by'] == 'text' && fields['input_color_by__text__color']) {
      targetColor = fields['input_color_by__text__color'].replace('0x','#');
      colorBy = 'hex';
    } else if(fields['input_color_by'] == 'colorpicker' && fields['input_color_by__colorpicker']) {
      targetColor = fields['input_color_by__colorpicker'].replace('0x','#');
      colorBy = 'color';
    } else {
      //targetColor = `rgba(${[fields['rgb_slider_r'],fields['rgb_slider_g'],fields['rgb_slider_b'],fields['rgb_slider_a']].join(',')})`;
      targetColor = hex = helpers.rgbaToHex(fields['rgb_slider_r'],fields['rgb_slider_g'],fields['rgb_slider_b'],fields['rgb_slider_a']);

    }

    //console.log(fields);
    var filledCells = getFilledCells(fields);
    var selectedCells = getSelectedCells(fields);

    let fill = (hex) ? hex.replace('#','0x') : color(targetColor).hex().replace('#','0x');
    //console.log('redhex', color(targetColor).hex());
    selectedCells.map(function(value){
      console.log(value, fill);
      //filledCells[value] = color(targetColor).hex().replace('#','0x');
      filledCells[value] = fill;
    });

    let predirect = `fill=${fill}&colorby=${colorBy}&`;
    let redirect = predirect + filledCells.map((value,index) => (
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

function handleMakeFaviconPng(req, res, matte = transparent, size = 16) {
  let filledCells = getFilledCells(req.query);
  let cells = getCells(filledCells);

  createDirectoryIfNonExistant(tmpDir);

  if(req.query['dl']) res.setHeader('Content-Disposition', contentDisposition(undefined,{
    type:'attachment'
  }));

  res.type('png');

  urlParamsToPNG(cells, matte, size).then(function(buffer) {
    res.send(buffer);
    res.end();
  });
}

app.get('/make/favicon.png', function(req, res) {
  handleMakeFaviconPng(req, res);
});

app.get('/make/:size/favicon.png', function(req, res) {
  //console.log(req.params);
  let size = req.params.size;
  //handleMakeFaviconPng(req, res, undefined, 256);

  var filledCells = getFilledCells(req.query);
  let cells = getCells(filledCells);

  if(req.query['dl']) res.setHeader('Content-Disposition', contentDisposition(undefined,{
    type:'attachment'
  }));

  res.render('svg-preview.twig',{
    cells: cells,
    size: size
  }, function(err, output) {
    svg2png(new Buffer(output), {width:size, height:size}).then(function(buffer) {
      res.type('png');
      res.send(buffer);
      res.end();
    }).catch(e => console.log(e));
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
      res.send(buf);
      res.end();
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

function urlParamsToPNG(cells, matte = transparent, size = 16) {
  return new Promise(function(resolve, reject) {
    let pixels = [];

    cells.map(function(row) {
      row.map(function(cell) {
        //console.log(cell);
        if(cell.fill) pixels.push({
          x: cell.column,
          y: cell.row,
          color: cell.hex.replace('#','').toUpperCase(),
          opacity: Math.min(255, parseInt(cell.opacity * 100, 16))
        });
      });
    });

    //console.log(pixels);

    fs.mkdtemp(tmpDir + path.sep, (err, folder) => {
      if (err) throw err;
      //console.log(folder);

      lwip.create(size, size, matte, function(err, image) {
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


 /* __       __   __ __      
/\ \\ \    /'__`\/\ \\ \
\ \ \\ \  /\ \/\ \ \ \\ \
 \ \ \\ \_\ \ \ \ \ \ \\ \_
  \ \__ ,__\ \ \_\ \ \__ ,__\
   \/_/\_\_/\ \____/\/_/\_\_/
      \/_/   \/___/    \/*/


app.use(function (req, res) {
  res.redirect('/');
  res.end();
});


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
