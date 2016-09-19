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



const util = require('util');

const svg2png = require('svg2png');

const toIco = require('to-ico');
const tmpDir = './temp';
//PNG = require('png-coder').PNG;

const PNGPixel = require('png-pixel');

const lwip = require('lwip');

const PNG = require('pngjs').PNG;

const transparent = {r: 255, g: 255, b: 255, a: 0};

const hexToRgba = require('hex-and-rgba').hexToRgba;
const rgbaToHex = require('hex-and-rgba').rgbaToHex;

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
  console.log(fill);
  let rgba = [transparent.a, transparent.g, transparent.b, transparent.a];
  let opacity = undefined;
  let hex = '#FFFFFF';
  if(fill) {
    try {
      fill = hex = color(fill.toString().replace('0x','#')).hex();
      opacity = 1;
    } catch(e) {
      fill = hexToRgba(fill.replace('0x','#'));
      hex = rgbaToHex(fill[0],fill[1],fill[2]);
      opacity = fill[3];
      fill = `rgba(${fill[0]},${fill[1]},${fill[2]},${fill[3]})`;
    }

    rgba = hexToRgba(hex);
    rgba[3] = opacity;
    console.log(opacity);

  }



  return {
    index:index,
    row:row,
    column:column,
    checked:checked,
    fill:fill,
    rgba:rgba,
    hex:hex,
    opacity:opacity
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
    console.log('resolving');
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

app.get('/icos/modmore', function(req, res) {
  res.redirect('/?c0=0x2a5282ff&c1=0x2a5282ff&c2=0x2a5282ff&c3=0x2a5282ff&c4=0x2a5282ff&c5=0x2a5282ff&c6=0x2a5282ff&c7=0x2a5282ff&c8=0x2a5282ff&c9=0x2a5282ff&c10=0x2a5282ff&c11=0x2a5282ff&c12=0x2a5282ff&c13=0x2a5282ff&c14=0x2a5282ff&c15=0x2a5282ff&c16=0x2a5282ff&c17=0x2a5282ff&c18=0x2a5282ff&c19=0x2a5282ff&c20=0x2a5282ff&c21=0x2a5282ff&c22=0x2a5282ff&c23=0x2a5282ff&c24=0x2a5282ff&c25=0x2a5282ff&c26=0x2a5282ff&c27=0x2a5282ff&c28=0x2a5282ff&c29=0x2a5282ff&c30=0x2a5282ff&c31=0x2a5282ff&c32=0x295282ff&c33=0x295282ff&c34=0x295282ff&c35=0x295282ff&c36=0x295282ff&c37=0x295282ff&c38=0x295282ff&c39=0x295282ff&c40=0x295282ff&c41=0x295282ff&c42=0x295282ff&c43=0x295282ff&c44=0x295282ff&c45=0x295282ff&c46=0x295282ff&c47=0x295282ff&c48=0x295181ff&c49=0x295181ff&c50=0x295281ff&c51=0x8fa4bdff&c52=0xc0cbd9ff&c53=0x285080ff&c54=0x295181ff&c55=0x295181ff&c56=0x295181ff&c57=0x295181ff&c58=0x41658fff&c59=0xc5d0ddff&c60=0x748eadff&c61=0x295181ff&c62=0x295181ff&c63=0x295181ff&c64=0x285181ff&c65=0x285181ff&c66=0x607da0ff&c67=0xffffffff&c68=0xbdc8d4ff&c69=0x275080ff&c70=0x285181ff&c71=0x285181ff&c72=0x285181ff&c73=0x285181ff&c74=0x3d618cff&c75=0xd4dae2ff&c76=0xfbfcfcff&c77=0x3a5e8aff&c78=0x285181ff&c79=0x285181ff&c80=0x285181ff&c81=0x285181ff&c82=0x7690adff&c83=0xffffffff&c84=0x3d628cff&c85=0x285181ff&c86=0x285181ff&c87=0x2d5584ff&c88=0x2c5483ff&c89=0x285181ff&c90=0x285181ff&c91=0x6481a3ff&c92=0xffffffff&c93=0x4c6d95ff&c94=0x285181ff&c95=0x285181ff&c96=0x285080ff&c97=0x285080ff&c98=0x768fadff&c99=0xffffffff&c100=0x3c618bff&c101=0x285080ff&c102=0x285080ff&c103=0xd1d9e3ff&c104=0xabbbcdff&c105=0x285080ff&c106=0x285080ff&c107=0x6480a2ff&c108=0xffffffff&c109=0x4c6d94ff&c110=0x285080ff&c111=0x285080ff&c112=0x275080ff&c113=0x295080ff&c114=0xced6e1ff&c115=0xe3e7ecff&c116=0x2b5381ff&c117=0x4a6b93ff&c118=0x8ca1bbff&c119=0xe7ebf1ff&c120=0xd3dbe4ff&c121=0x8ca1bbff&c122=0x365b87ff&c123=0x43668eff&c124=0xf5f6f7ff&c125=0xa6b6c9ff&c126=0x275080ff&c127=0x275080ff&c128=0x275080ff&c129=0x295180ff&c130=0xf5f6f7ff&c131=0x9dafc3ff&c132=0x274f7fff&c133=0x6883a3ff&c134=0xe7e9ecff&c135=0xfafafbff&c136=0xf5f6f8ff&c137=0xe7e9ecff&c138=0x42668eff&c139=0x2d5583ff&c140=0xc0cbd7ff&c141=0xced7e0ff&c142=0x275080ff&c143=0x275080ff&c144=0x274f7fff&c145=0x264f7eff&c146=0x859ab3ff&c147=0xfefefeff&c148=0x385c88ff&c149=0x264f7eff&c150=0x264e7eff&c151=0xd3dbe4ff&c152=0xacbbcdff&c153=0x264e7eff&c154=0x264f7fff&c155=0x5f7c9fff&c156=0xffffffff&c157=0x5b789bff&c158=0x274f7fff&c159=0x274f7fff&c160=0x264f7fff&c161=0x264f7fff&c162=0x758eacff&c163=0xffffffff&c164=0x3c608bff&c165=0x264f7fff&c166=0x264f7fff&c167=0x738ba8ff&c168=0x627d9fff&c169=0x264f7fff&c170=0x264f7fff&c171=0x627fa1ff&c172=0xffffffff&c173=0x4a6c93ff&c174=0x264f7fff&c175=0x264f7fff&c176=0x264f7fff&c177=0x264f7fff&c178=0x6f8aa8ff&c179=0xffffffff&c180=0x708aa9ff&c181=0x254e7eff&c182=0x264f7fff&c183=0x264f7fff&c184=0x264f7fff&c185=0x264f7fff&c186=0x2d5483ff&c187=0x92a6beff&c188=0xffffffff&c189=0x456890ff&c190=0x264f7fff&c191=0x264f7fff&c192=0x264e7eff&c193=0x264e7eff&c194=0x365a86ff&c195=0xe2e6ebff&c196=0xf3f5f7ff&c197=0x254d7dff&c198=0x264e7eff&c199=0x264e7eff&c200=0x264e7eff&c201=0x264e7eff&c202=0x476991ff&c203=0xfefefeff&c204=0xc8d0daff&c205=0x274e7eff&c206=0x264e7eff&c207=0x264e7eff&c208=0x254e7eff&c209=0x254e7eff&c210=0x254e7eff&c211=0x2b527fff&c212=0x48688eff&c213=0x254d7dff&c214=0x254e7eff&c215=0x254e7eff&c216=0x254e7eff&c217=0x254e7eff&c218=0x2b5280ff&c219=0x47678dff&c220=0x274f7eff&c221=0x254e7eff&c222=0x254e7eff&c223=0x254e7eff&c224=0x254e7eff&c225=0x254e7eff&c226=0x254e7eff&c227=0x254e7eff&c228=0x254e7eff&c229=0x254e7eff&c230=0x254e7eff&c231=0x254e7eff&c232=0x254e7eff&c233=0x254e7eff&c234=0x254e7eff&c235=0x254e7eff&c236=0x254e7eff&c237=0x254e7eff&c238=0x254e7eff&c239=0x254e7eff&c240=0x254d7dff&c241=0x254d7dff&c242=0x254d7dff&c243=0x254d7dff&c244=0x254d7dff&c245=0x254d7dff&c246=0x254d7dff&c247=0x254d7dff&c248=0x254d7dff&c249=0x254d7dff&c250=0x254d7dff&c251=0x254d7dff&c252=0x254d7dff&c253=0x254d7dff&c254=0x254d7dff&c255=0x254d7dff');
  res.end();
});

app.get('/icos/thinkful', function(req, res) {
  res.redirect('/?c0=0x202a34&c1=0x202a34&c2=0x202a34&c3=0x202a34&c4=0x202a34&c5=0x202a34&c6=0x202a34&c7=0x202a34&c8=0x202a34&c9=0x202a34&c10=0x202a34&c11=0x202a34&c14=0x202a34&c15=0x202a34&c16=0x202a34&c17=0x202a34&c18=0x202a34&c19=0x202a34&c20=0x202a34&c21=0x202a34&c22=0x202a34&c23=0x202a34&c24=0x202a34&c25=0x202a34&c26=0x202a34&c27=0x202a34&c30=0x202a34&c31=0x202a34&c32=0x202a34&c33=0x202a34&c46=0x202a34&c47=0x202a34&c48=0x202a34&c49=0x202a34&c62=0x202a34&c63=0x202a34&c64=0x202a34&c65=0x202a34&c66=0x202a34&c67=0x202a34&c68=0x202a34&c69=0x202a34&c70=0x202a34&c71=0xffffff&c73=0x202a34&c74=0x202a34&c75=0x202a34&c76=0x202a34&c77=0x202a34&c78=0x202a34&c79=0x202a34&c80=0x202a34&c81=0x202a34&c82=0x202a34&c83=0x202a34&c84=0x202a34&c85=0x202a34&c86=0x202a34&c87=0xffffff&c89=0x202a34&c90=0x202a34&c91=0x202a34&c92=0x202a34&c93=0x202a34&c94=0x202a34&c95=0x202a34&c101=0x202a34&c102=0x202a34&c103=0xffffff&c105=0x202a34&c106=0x202a34&c107=0xffffff&c117=0x202a34&c118=0x202a34&c119=0xffffff&c121=0x202a34&c122=0x202a34&c123=0xffffff&c133=0x202a34&c134=0x202a34&c135=0xffffff&c137=0x202a34&c138=0x202a34&c139=0xffffff&c149=0x202a34&c150=0x202a34&c151=0xffffff&c153=0x202a34&c154=0x202a34&c155=0xffffff&c165=0x202a34&c166=0x202a34&c167=0xffffff&c169=0x202a34&c170=0x202a34&c171=0xffffff&c181=0x202a34&c182=0x202a34&c183=0xffffff&c185=0x202a34&c186=0x202a34&c187=0xffffff&c201=0x202a34&c202=0x202a34&c203=0xffffff&c217=0x202a34&c218=0x202a34&c219=0xffffff&c229=0x202a34&c230=0x202a34&c231=0x202a34&c232=0x202a34&c233=0x202a34&c234=0x202a34&c235=0xffffff&c245=0x202a34&c246=0x202a34&c247=0x202a34&c248=0x202a34&c249=0x202a34&c250=0x202a34&c251=0xffffff');
  res.end();
})

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
  const baseUrl = `${(req.protocol + '://' + req.get('host').substr(-1)) !== '/'}` ? `${req.protocol + '://' + req.get('host')}/` : req.protocol + '://' + req.get('host');
  //res.set('Content-Encoding', 'gzip');
  var filledCells = getFilledCells(req.query);
  let cells = getCells(filledCells);

  res.render('index.twig',{
    cells: cells,
    startOver: filledCells.length > 0,
    cellURL: getCellURLString(req.query),
    baseUrl: baseUrl,
    production: process.env.NODE_ENV == 'production'
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

function handleMakeFaviconPng(req, res, matte = transparent, size = 16) {
  let filledCells = getFilledCells(req.query);
  let cells = getCells(filledCells);

  createDirectoryIfNonExistant(tmpDir);

  if(req.query['dl']) res.setHeader('Content-Disposition', contentDisposition(undefined,{
    type:'attachment'
  }));

  urlParamsToPNG(cells, matte, size).then(function(buffer) {
    res.end(buffer);
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
      res.end(buffer);
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
